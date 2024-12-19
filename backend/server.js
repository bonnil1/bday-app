// backend/server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createPool } from 'mysql2';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path'
import fetch from 'node-fetch'

dotenv.config();

// Initialize the Express app
const app = express();
const port = 5001;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true  //cookie
}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:false
  })
)
app.use('/uploads', express.static('uploads'));

// MySQL pool connection
const pool = createPool({
  host: 'mysql',
  user: 'root',
  password: 'birthday',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test MySQL connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Successfully connected to MySQL!');
  connection.release(); // Release the connection back to the pool
});

// Multer storage to save photo files locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname)
    cb(null, filename);
  }
})

const upload = multer({ storage })

//ROUTES:

// Post sign up new user data
app.post('/new-user', upload.single("photo"), (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  const newUser = req.body;

  if (req.file) {
    console.log('File uploaded:', req.file);
    newUser.photo = req.file.path;
  } else {
    console.log('No file uploaded');
    newUser.photo = null
  }

  // query for existing username  / email before inserting into the database
  const usernameQuery = 'SELECT COUNT(*) AS count FROM friends WHERE username = ?';
  const emailQuery = 'SELECT COUNT(*) AS count FROM friends WHERE email = ?';

  Promise.all([
    new Promise((resolve, reject) => {
      pool.query(usernameQuery, [newUser.username], (err, result) => {
        if (err) {
          reject({ message: "Error occurred checking username in db." });
        }
        resolve(result[0].count > 0 ? 'username' : null);
      });
    }),
    new Promise((resolve, reject) => {
      pool.query(emailQuery, [newUser.email], (err, result) => {
        if (err) {
          reject({ message: "Error occurred checking email in db." });
        }
        resolve(result[0].count > 0 ? 'email' : null);
      });
    })
  ])
    .then((results) => {
      // If either username or email exists, send an appropriate response
      if (results.includes('username')) {
        return res.status(400).json({ message: "Username already exists." });
      }
      if (results.includes('email')) {
        return res.status(400).json({ message: "Email already exists." });
      }
  
      // If neither exists, insert the new user
      const insertQuery = `
        INSERT INTO friends (role, username, password, email, name, birthday, color, photo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      pool.query(insertQuery, [newUser.role, newUser.username, newUser.password, newUser.email, newUser.name, newUser.birthday, newUser.color, newUser.photo], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error occurred while inserting user data.' });
        }
        res.status(200).json({ message: 'New user info inserted successfully!' });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: err.message });
    });
  
});

// Post log in user data
app.post('/login', (req, res) => {
  const user = req.body;
  
  const query = 'SELECT * FROM friends WHERE username = ?';

  pool.query(query, [user.username], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } 
    if (result.length === 0) {
      return res.status(404).json({ message: 'Username not found.' });
    }

    // result returned as an array
    const storedpw = result[0].password 
    const storedrole = result[0].role

    bcrypt.compare(user.password, storedpw, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords.' });
      } 

      if (isMatch) {
        req.session.user = user.username
        return res.status(200).json({ 
          currentUser: req.session.user, 
          role: storedrole,
          message:'Log in successful.'
        });
      } else {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
    })
  })
})

// Post to get friend data
app.post('/', (req, res) => {
  if (req.session.user) {
    const friend = req.body.name;
    console.log(friend)
    const query = 'SELECT * FROM friends WHERE name = ?';

    pool.query(query, [friend], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error getting friend data.' });
      } 
      if (result.length === 0) {
        return res.status(404).json({ message: 'That is not a CV friend.' });
      }
      res.json(result);
    })
  } else {
    return res.status(401).json({ message: 'You are not logged in.' });
  }
})

// Get friend usernames
app.get('/friends', async (req, res) => {
  if (req.session.user) {
    try {
      const response = await fetch("http://python:4000/friends"); 
      console.log("backend reached fastapi")
      const data = await response.json();
      //console.log(data)

      res.json(data);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch data from FastAPI.' });
    }
  } else {
    return res.status(401).json({ message: 'You are not logged in.' });
  }
})

// Delete user
app.delete('/byeuser', async (req, res) => {
  console.log("hitting delete user in backend")
  if(req.session.user) { 
    const username = req.body.username;
    const loggedinuser = req.body.loggedinuser;

    if (!username) {
      return res.status(400).json({ message: 'Username is required.' });
    }

    const query = 'DELETE FROM friends WHERE username = ?'

    if (req.session.user === loggedinuser) {
      pool.query(query, [username], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error deleting user from the database.' });
        } else {
          return res.status(200).json({ message: 'User deleted.' })
        }
      })
    } else {
      return res.status(403).json({ message: 'You do not have access to delete user.' })
    }
  } else {
    return res.status(401).json({ message: 'You are not logged in.' });
  }
})

// Post to log user out 
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful.' });
  });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend is running on port ${port}`);
});

/*
// API endpoint to handle data
app.post('/send-array', (req, res) => {
  const dataArray = req.body.data;
  
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty data array'});
  }

  const query = 'INSERT INTO friends (name, birthday, color, font, photo) VALUES ?';
  const values = dataArray.map(item => [item.name, item.birthday, item.color, item.font, item.photo]);

  pool.query(query, [values], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Data inserted successfully' });
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname)
    cb(null, filename);
  }
})

const upload = multer({ storage })


pool.query(query, [newUser.username], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error occurred checking username in db." })
    }
  
    if (result[0].count > 0 ) {
      return res.status(400).json({ message: "Username already exists." })
    } else {
      const insertQuery = `
        INSERT INTO friends (role, username, password, email, name, birthday, color, photo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      pool.query(insertQuery, [newUser.role, newUser.username, newUser.password, newUser.email, newUser.name, newUser.birthday, newUser.color, newUser.photo], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: '500 error here in post backend' });
        }
        res.status(200).json({ message: 'New user info inserted successfully!' });
      })
    }
  })
*/
