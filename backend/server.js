// backend/server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createPool } from 'mysql2';

// Initialize the Express app
const app = express();
const port = 5001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

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

// Test route
app.get('/friends', (req, res) => {
  res.send('Hello from the backend!');
});

// API endpoint to handle data
app.post('/send-array', (req, res) => {
  const dataArray = req.body.data;

  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty data array' });
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

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend is running on port ${port}`);
});
