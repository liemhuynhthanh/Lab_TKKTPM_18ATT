const movieService = require('../services/movieService');

/**
 * Controller xử lý danh sách phim
 */
exports.getMovies = async (req, res) => {
    try {
        const movies = await movieService.getAllMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
};

/**
 * Controller xử lý tạo mới phim
 */
exports.createMovie = async (req, res) => {
    try {
        const newMovie = await movieService.createMovie(req.body);
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(400).json({ status: 'Error', message: error.message });
    }
};
