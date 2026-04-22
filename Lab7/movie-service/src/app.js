const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const movieRoutes = require('./routes/movieRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Base Route
app.get('/', (req, res) => {
    res.json({ message: 'Movie Service API is healthy' });
});

// Movie Routes
app.use('/movies', movieRoutes);

module.exports = app;
