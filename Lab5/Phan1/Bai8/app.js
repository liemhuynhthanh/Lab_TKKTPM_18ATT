const express = require('express');
const mysql = require('mysql2');

const app = express();

const db = mysql.createConnection({
  host: 'mysql',
  user: 'user',
  password: 'password',
  database: 'mydb'
});

db.connect((err) => {
  if (err) {
    console.log('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Node.js connected to MySQL successfully!');
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});
