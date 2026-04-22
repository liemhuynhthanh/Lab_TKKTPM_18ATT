const path = require('path');
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8082,
    DB: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'movie_ticket_db'
    }
};
