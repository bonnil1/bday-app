from fastapi import FastAPI, HTTPException, Request, Form, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from datetime import datetime, timedelta
from dotenv import load_dotenv
import bcrypt
import os
import shutil
import aiomysql
import uvicorn

load_dotenv()

# Secret key for JWT signing
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# initiate instance of fastapi
app = FastAPI()

# CORS set up
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,  
    allow_methods=["*"], 
    allow_headers=["*"], 
)

"""
# Pydantic model for user data
class UserCreate(BaseModel):
    role: str
    username: str
    password: str
    email: str
    name: str
    birthday: str
    color: str
"""

# OAuth2PasswordBearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Utility functions for JWT
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    print("in create access token")
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise JSONResponse(status_code=403, content={"message": "Invalid token"})

# Hash password
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

# Password verification
def verify_password(password: str, storedpw: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), storedpw.encode("utf-8"))


# Database connection setup with aiomysql
async def get_db_connection():
    connect = await aiomysql.connect(
        host="mysql", 
        user="root",
        password="birthday",
        db="mydb",
        loop=None,
    )
    return connect

# Store uploaded files
UPLOAD_FOLDER = "uploads/"

# Ensure the uploads folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Serve image from the uploads folder
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Sign up
@app.post("/new-user")
async def create_user(
    role: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    email: str = Form(...),
    name: str = Form(...),
    birthday: str = Form(...),
    color: str = Form(...),
    photo: UploadFile = File(...),
    address: str = Form(...),
):
    print(address)

    connect = None
    cursor = None

    try:
        # Hash the password
        hashed_password = hash_password(password)

        # Get a connection to the database
        connect = await get_db_connection()
        # Cursor is an object that executes SQL queries
        cursor = await connect.cursor()

        # Check for existing username and email in the database
        await cursor.execute("SELECT COUNT(*) FROM friends WHERE username = %s", (username,))
        username_result = await cursor.fetchone() #fetches a tuple (0, )
        username_count = username_result[0]

        await cursor.execute("SELECT COUNT(*) FROM friends WHERE email = %s", (email,))
        email_result = await cursor.fetchone()
        email_count = email_result[0]

        if username_count > 0:
            return JSONResponse(status_code=400, content={"message": "Username already exists."})
        if email_count > 0:
            return JSONResponse(status_code=400, content={"message": "Email already exists."})

        # Handle file upload
        if photo:
            print(f"Received photo: {photo.filename}")
            # Create a unique filename using the current timestamp
            filename = f"{int(datetime.now().timestamp())}{os.path.splitext(photo.filename)[1]}"
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            print(file_path)
        else: 
            print("No photo received")

        # Save the photo in uploads
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
            print("photo saved")

        # Set file path to store photo in db
        photo_db = file_path

        # Insert new user into the database
        await cursor.execute("""
            INSERT INTO friends (role, username, password, email, name, birthday, color, photo, address) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (role, username, hashed_password, email, name, birthday, color, photo_db, address))
        
        await connect.commit()
        
        return JSONResponse(status_code=200, content={"message": "User created successfully!"})
    
    except Exception as error:
        # Rollback in case of any error
        if connect:
            await connect.rollback()
        
        # Return error message in case of exception
        return(JSONResponse(status_code=500, content={"message": "Error in sign up."}))
    
    finally:
        # Close the cursor and connection
        if cursor:
            await cursor.close()
        if connect:
            connect.close()

# Log in
@app.post("/login")
async def log_in(request: Request):
    connect = None
    cursor = None

    try:
        # Extract request body data
        data = await request.json()

        # Extract username from request body
        username = data["username"]
        password = data["password"]

        # Get a connection to the database
        connect = await get_db_connection()
        cursor = await connect.cursor()

        # Check for username in database
        await cursor.execute("SELECT * FROM friends WHERE username = %s", (username, ))
        
        # Fetch username result
        user = await cursor.fetchone()
        
        if user:
            print(user)
            storedpw = user[3] #user info retrieved as a tuple
            #print(storedpw)

        if not user: 
            return JSONResponse(status_code=401, content={"message": "Username not found."})
        
        # Compare passwords
        if not verify_password(password, storedpw):
            return(JSONResponse(status_code=500, content={"message": "Invalid credentials."}))

        token = create_access_token(data={"sub": username})
        print(token)

        return {"message": "Log in successful.", "currentUser": user[2], "role": user[1], "token": token, "token_type": "bearer"}
    
    except Exception as error:
        # Rollback in case of any error
        print("in log in error handling")
        if connect:
            await connect.rollback()
        
        # Return error message in case of exception
        #raise HTTPException(status_code=500, detail=f"An error occurred: {str(error)}")
        return(JSONResponse(status_code=500, content={"message": "Error in login."}))
    
    finally:
        # Close the cursor and connection
        if cursor:
            await cursor.close()
        if connect:
            connect.close()

# Get prefilled profile
@app.get("/user/{username}")
async def get_data(username: str, token: str = Depends(oauth2_scheme)):
    verify_token(token)
    connect = None
    cursor = None

    try:
        # Get a connection to the database
        connect = await get_db_connection()
        cursor = await connect.cursor()
        
        # Execute the query asynchronously
        await cursor.execute("SELECT * FROM friends WHERE username = %s", (username, ))

        # Fetch username result
        user = await cursor.fetchone()

        # Error handling 
        if not user: 
            return JSONResponse(status_code=404, content={"message": "Username not found."})

        column = [desc[0] for desc in cursor.description]
        print(user)
        print(column)
        #print(type(friend))

        result = dict(zip(column, user))
        print(result)
        
        return result
    
    except Exception as error:
        # Rollback in case of any error
        if connect:
            await connect.rollback()
        
        # Return error message in case of exception
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(error)}")
    
    finally:
        # Close the cursor and connection
        if cursor:
            await cursor.close()
        if connect:
            connect.close()

# Update profile
@app.put("/user/{username}")
async def update_data(username: str, token: str = Depends(oauth2_scheme),
    name: str = Form(...),
    birthday: str = Form(...),
    color: str = Form(...),
    address: str = Form(...),
    boba: str = Form(...),
    artist: str = Form(...),
    game: str = Form(...),
    photo: UploadFile = File(None),
    ):
    verify_token(token)
    connect = None
    cursor = None

    try:
        # Get a connection to the database
        connect = await get_db_connection()
        cursor = await connect.cursor()

        photo_db = None

        if photo:
            # A new photo has been uploaded
            print(f"Received new photo: {photo.filename}")
            # Create a unique filename using the current timestamp
            filename = f"{int(datetime.now().timestamp())}{os.path.splitext(photo.filename)[1]}"
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            print(f"Saving photo to {file_path}")

            # Save the photo in the uploads directory
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(photo.file, buffer)
                print("Photo saved successfully")

            # Set the photo path for the database
            photo_db = file_path
        else:
            # If no new photo is uploaded, use the existing photo from the database
            print("No new photo received, keeping the existing photo")
            # Optionally, you can query the current photo path from the database if needed
            # e.g., `photo_db = get_existing_photo_path_from_db(username)`
            photo_db = None

        # First, update the existing user fields
        await cursor.execute("""
            UPDATE friends SET name = %s, birthday = %s, color = %s, address = %s, boba = %s, artist = %s, game = %s, photo = COALESCE(%s, photo)
            WHERE username = %s
        """, (name, birthday, color, address, boba, artist, game, photo_db, username))

        await connect.commit()

        return JSONResponse(status_code=200, content={"message": "User updated and new user data added successfully."})


    except Exception as error:
        # Rollback in case of any error
        if connect:
            await connect.rollback()
        
        # Return error message in case of exception
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(error)}")
    
    finally:
        # Close the cursor and connection
        if cursor:
            await cursor.close()
        if connect:
            connect.close()
    

# Get specific friend
# change to a get request!
@app.post("/friend")
async def get_friend(request: Request, token: str = Depends(oauth2_scheme)): 
    verify_token(token)
    connect = None
    cursor = None

    try:
        # Extract request body data
        data = await request.json()

        # Extract username from request body
        name = data["name"]

        # Get a connection to the database
        connect = await get_db_connection()
        cursor = await connect.cursor()
        print(type(cursor))

        # Execute the query asynchronously
        await cursor.execute("SELECT * FROM friends WHERE name = %s", (name, ))

        # Fetch username result
        friend = await cursor.fetchone()

        # Error handling 
        if not friend: 
            return JSONResponse(status_code=404, content={"message": "That is not a CV friend."})

        column = [desc[0] for desc in cursor.description]
        print(friend)
        print(column)
        #print(type(friend))

        result = dict(zip(column, friend))
        print(result)
        
        return result
    
    except Exception as error:
        # Rollback in case of any error
        if connect:
            await connect.rollback()
        
        # Return error message in case of exception
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(error)}")
    
    finally:
        # Close the cursor and connection
        if cursor:
            await cursor.close()
        if connect:
            connect.close()

# Get specific user
@app.post("/user")
async def get_user(request: Request, token: str = Depends(oauth2_scheme)): 
    verify_token(token)
    connect = None
    cursor = None

    try:
        # Extract request body data
        data = await request.json()

        # Extract username from request body
        username = data["username"]

        # Get a connection to the database
        connect = await get_db_connection()
        cursor = await connect.cursor()
        print(type(cursor))

        # Execute the query asynchronously
        await cursor.execute("SELECT * FROM friends WHERE username = %s", (username, ))

        # Fetch username result
        user = await cursor.fetchone()

        # Error handling 
        if not user: 
            return JSONResponse(status_code=404, content={"message": "Username not found."})

        column = [desc[0] for desc in cursor.description]
        print(user)
        print(column)
        #print(type(friend))

        result = dict(zip(column, user))
        print(result)
        
        return result
    
    except Exception as error:
        # Rollback in case of any error
        if connect:
            await connect.rollback()
        
        # Return error message in case of exception
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(error)}")
    
    finally:
        # Close the cursor and connection
        if cursor:
            await cursor.close()
        if connect:
            connect.close()

# Get all users
@app.get("/friends")
async def get_usernames(token: str = Depends(oauth2_scheme)):
    verify_token(token)
    connect = None
    cursor = None

    try:
        # Get a connection to the database
        connect = await get_db_connection()
        cursor = await connect.cursor()
        
        # Execute the query asynchronously
        await cursor.execute("SELECT username FROM friends")
        
        # Fetch all results
        usernames = await cursor.fetchall()
        #print(usernames)

        # Convert the result to a list
        username_list = [username[0] for username in usernames]

        return username_list
    
    except Exception as error:
        # Rollback in case of any error
        if connect:
            await connect.rollback()
        
        # Return error message in case of exception
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(error)}")
    
    finally:
        # Close the cursor and connection
        if cursor:
            await cursor.close()
        if connect:
            connect.close()

# Delete user
# include sessions and role validation for deleting user 
@app.delete("/byeuser")
async def delete_user(request: Request, token: str = Depends(oauth2_scheme)):
    verify_token(token)
    connect = None
    cursor = None
    
    try:
        # Extract request body data
        data = await request.json()
        print(data)

        # Extract username from request body
        username = data["username"]
        loggedinuser = data["loggedinuser"]

        # Get a connection to the database
        connect = await get_db_connection()
        cursor = await connect.cursor()

        # Check if loggedinuser is authorized to delete the user
        #if loggedinuser != username:
            #return JSONResponse(status_code=404, content={"message": "You do not have access to delete user."})

        # Execute the query asynchronously
        await cursor.execute("DELETE FROM friends WHERE username = %s", ((username, )))
        await connect.commit()

        # Error handling + success message
        return {"message": "User deleted."}
    
    except Exception as error:
        # Rollback in case of any error
        if connect:
            await connect.rollback()
        
        # Return error message in case of exception
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(error)}")
    
    finally:
        # Close the cursor and connection
        if cursor:
            await cursor.close()
        if connect:
            connect.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)

