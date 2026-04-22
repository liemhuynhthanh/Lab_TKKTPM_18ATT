const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class MovieModel {
    constructor() {
        this.init();
    }

    init() {
        // Tạo thư mục data nếu chưa tồn tại
        const dataDir = path.dirname(config.DATA_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        if (!fs.existsSync(config.DATA_FILE)) {
            const initialMovies = [
                { id: 1, title: 'Avengers: Endgame', genre: 'Action', duration: '181 min', price: 100000 },
                { id: 2, title: 'Interstellar', genre: 'Sci-Fi', duration: '169 min', price: 90000 },
                { id: 3, title: 'The Conjuring', genre: 'Horror', duration: '112 min', price: 80000 }
            ];
            this.save(initialMovies);
        }
    }


    getAll() {
        const data = fs.readFileSync(config.DATA_FILE);
        return JSON.parse(data);
    }

    save(movies) {
        fs.writeFileSync(config.DATA_FILE, JSON.stringify(movies, null, 2));
    }

    add(movieData) {
        const movies = this.getAll();
        const newMovie = {
            id: movies.length > 0 ? movies[movies.length - 1].id + 1 : 1,
            ...movieData
        };
        movies.push(newMovie);
        this.save(movies);
        return newMovie;
    }

    update(id, movieData) {
        let movies = this.getAll();
        const index = movies.findIndex(m => m.id === id);
        if (index === -1) return null;

        movies[index] = { ...movies[index], ...movieData, id };
        this.save(movies);
        return movies[index];
    }
}

module.exports = new MovieModel();
