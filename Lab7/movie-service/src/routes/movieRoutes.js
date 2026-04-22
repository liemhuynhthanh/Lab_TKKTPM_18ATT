const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// GET /movies
router.get('/', movieController.getMovies);

// POST /movies
router.post('/', movieController.createMovie);

module.exports = router;
