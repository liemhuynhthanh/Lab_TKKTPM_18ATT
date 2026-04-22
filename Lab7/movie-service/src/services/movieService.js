const movieModel = require('../models/movieModel');

class MovieService {
    /**
     * Lấy danh sách phim từ database và áp dụng logic nghiệp vụ
     */
    async getAllMovies() {
        console.log('[Service] Fetching movies...');
        return await movieModel.findAll();
    }

    /**
     * Xử lý logic tạo mới phim
     */
    async createMovie(movieData) {
        console.log('[Service] Creating movie:', movieData.title);
        
        // Logic nghiệp vụ: Title không được để trống
        if (!movieData.title) {
            throw new Error('Title is required to create a movie');
        }

        return await movieModel.save(movieData);
    }
}

module.exports = new MovieService();
