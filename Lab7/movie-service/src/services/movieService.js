const movieModel = require('../models/movieModel');
const { sendEvent } = require('../config/kafka');

class MovieService {
    /**
     * Lấy danh sách phim từ database và áp dụng logic nghiệp vụ
     */
    async getAllMovies() {
        console.log('[Service] Fetching movies...');
        return await movieModel.findAll();
    }

    /**
     * Cập nhật thông tin phim và bắn event Kafka
     */
    async updateMovie(id, movieData) {
        console.log(`[Service] Updating movie with ID ${id}`);
        
        const existing = await movieModel.findById(id);
        if (!existing) return null;

        const updatedMovie = await movieModel.update(id, movieData);

        // Bắn event Kafka: MOVIE_UPDATED
        await sendEvent('MOVIE_UPDATED', {
            id: updatedMovie.id,
            title: updatedMovie.title,
            genre: updatedMovie.genre,
            price: updatedMovie.price,
            timestamp: new Date().toISOString()
        });

        return updatedMovie;
    }

    /**
     * Xử lý logic tạo mới phim và bắn event Kafka
     */
    async createMovie(movieData) {
        console.log('[Service] Creating movie:', movieData.title);
        
        // Logic nghiệp vụ
        if (!movieData.title) {
            throw new Error('Title is required');
        }

        const newMovie = await movieModel.save(movieData);

        // Bắn event Kafka: MOVIE_CREATED
        await sendEvent('MOVIE_CREATED', {
            id: newMovie.id,
            title: newMovie.title,
            genre: newMovie.genre,
            price: newMovie.price,
            timestamp: new Date().toISOString()
        });

        return newMovie;
    }
}


module.exports = new MovieService();
