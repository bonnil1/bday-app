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

dotenv.config();

// Initialize the Express app
const app = express();
const port = 5001;

// Middlewares
app.use(cors());
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

// Multer storage to save files locally
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
    console.log('Saved file path:', req.file.path);
    newUser.photo = req.file.path;
  } else {
    console.log('No file uploaded');
    newUser.photo = null
  }

  // query for existing username before inserting into the database
  const query = 'SELECT COUNT(*) AS count FROM friends WHERE username = ?';

  pool.query(query, [newUser.username], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error occurred checking username in db." })
    }
  
    if (result[0].count > 0 ) {
      return res.status(400).json({ message: "Username already exists." })
    } else {
      const query = `
        INSERT INTO friends (username, password, name, birthday, color, photo) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      pool.query(query, [newUser.username, newUser.password, newUser.name, newUser.birthday, newUser.color, newUser.photo], (err, result) => {
        if (err) {
          return res.status(500).json({ message: "500 error here in post backend" });
        }
        res.status(200).json({ message: 'New user info. inserted successfully!' });
      })
    }
  })
});

// Post log in user data
app.post('/login', (req, res) => {
  const user = req.body;
  
  const query = 'SELECT password FROM friends WHERE username = ?';

  pool.query(query, [user.username], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } 
    if (result.length === 0) {
      return res.status(404).json({ message: 'Username not found.'});
    }

    const storedpw = result[0].password // result returned as an array

    bcrypt.compare(user.password, storedpw, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords.' });
      } 

      if (isMatch) {
        req.session.user = user.username
        return res.status(200).json({ 
          currentUser: req.session.user, 
          message:'Log in successful.'
        });
      } else {
        return res.status(401).json({ message: 'Invalid credentials.'});
      }
    })
  })
})

// Post to get friend data
app.post('/', (req, res) => {
  const friend = req.body.name;
  console.log(friend)
  const query = 'SELECT * FROM friends WHERE name = ?';

  pool.query(query, [friend], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error getting friend data." });
    } 
    if (result.length === 0) {
      return res.status(404).json({ message: 'That is not a CV friend.'});
    }
    res.json(result);
  })
})

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
*/
