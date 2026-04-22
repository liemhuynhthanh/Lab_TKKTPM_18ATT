const path = require('path');

module.exports = {
    PORT: process.env.PORT || 8082,
    DATA_FILE: path.join(__dirname, '../../data/movies.json')
};
