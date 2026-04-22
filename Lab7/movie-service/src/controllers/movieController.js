const movieModel = require('../models/movieModel');

exports.getMovies = (req, res) => {
    try {
        console.log('[Movie Service] Getting all movies');
        const movies = movieModel.getAll();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
};

exports.createMovie = (req, res) => {
    try {
        console.log('[Movie Service] Creating new movie', req.body);
        const { title, genre, duration, price } = req.body;
        
        if (!title || !genre) {
            return res.status(400).json({ error: 'Title and Genre are required' });
        }

        const newMovie = movieModel.add({ title, genre, duration, price });
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create movie' });
    }
};

exports.updateMovie = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        console.log(`[Movie Service] Updating movie ID: ${id}`);
        
        const updatedMovie = movieModel.update(id, req.body);
        
        if (!updatedMovie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update movie' });
    }
};
