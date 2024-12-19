from fastapi import FastAPI
import aiomysql
import uvicorn

app = FastAPI()

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

# Get all users
@app.get("/friends")
async def get_usernames():
    # Get a connection to the database
    connect = await get_db_connection()
    cursor = await connect.cursor()
    
    # Execute the query asynchronously
    await cursor.execute("SELECT username FROM friends")
    
    # Fetch all results
    usernames = await cursor.fetchall()
    
    # Close the cursor and connection
    await cursor.close()
    connect.close()

    # Convert the result to a list
    username_list = [username[0] for username in usernames]

    return username_list


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)

