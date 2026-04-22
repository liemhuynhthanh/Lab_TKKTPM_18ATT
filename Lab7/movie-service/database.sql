-- Tạo Database nếu chưa có
CREATE DATABASE IF NOT EXISTS movie_ticket_db;
USE movie_ticket_db;

-- Xóa bảng nếu đã tồn tại (để reset dữ liệu nếu cần)
-- DROP TABLE IF EXISTS movies;

-- Tạo bảng Movies
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    duration VARCHAR(50),
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chèn dữ liệu mẫu
INSERT INTO movies (title, genre, duration, price) VALUES 
('Avengers: Endgame', 'Action', '181 min', 100000),
('Interstellar', 'Sci-Fi', '169 min', 90000),
('The Conjuring', 'Horror', '112 min', 80000),
('Spiderman: No Way Home', 'Action', '148 min', 110000),
('Dune: Part Two', 'Sci-Fi', '166 min', 120000);

-- Kiểm tra dữ liệu
SELECT * FROM movies;
