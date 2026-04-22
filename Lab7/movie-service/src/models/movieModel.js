const mysql = require('mysql2/promise');
const config = require('../config/config');

/**
 * Định nghĩa thực thể Movie (Entity)
 */
class Movie {
    constructor({ id, title, genre, duration, price, created_at }) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.duration = duration;
        this.price = price ? parseFloat(price) : 0;
        this.createdAt = created_at;
    }
}

/**
 * Lớp xử lý Database (Model/Repository)
 */
class MovieModel {
    constructor() {
        this.pool = mysql.createPool({
            ...config.DB,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        this.init();
    }

    async init() {
        try {
            const connection = await this.pool.getConnection();
            const sql = `
                CREATE TABLE IF NOT EXISTS movies (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    genre VARCHAR(100),
                    duration VARCHAR(50),
                    price DECIMAL(10, 2),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `;
            await connection.query(sql);
            connection.release();
            console.log('[Model] Table check complete.');
        } catch (error) {
            console.error('[Model] Init Error:', error.message);
        }
    }

    async findAll() {
        const [rows] = await this.pool.query('SELECT * FROM movies ORDER BY id DESC');
        return rows.map(row => new Movie(row));
    }

    async findById(id) {
        const [rows] = await this.pool.query('SELECT * FROM movies WHERE id = ?', [id]);
        return rows.length ? new Movie(rows[0]) : null;
    }

    async save(data) {
        const { title, genre, duration, price } = data;
        const [result] = await this.pool.query(
            'INSERT INTO movies (title, genre, duration, price) VALUES (?, ?, ?, ?)',
            [title, genre, duration, price]
        );
        return await this.findById(result.insertId);
    }
}

module.exports = new MovieModel();
