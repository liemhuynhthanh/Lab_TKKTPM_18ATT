const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Cấu hình kết nối MariaDB
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root', // thay đổi theo cấu hình của bạn
    password: 'root', // thay đổi theo cấu hình của bạn
    database: 'tour_db', // thay đổi theo tên database của bạn
    connectionLimit: 5
});

// Kiểm tra kết nối
pool.getConnection()
    .then(conn => {
        console.log('Đã kết nối thành công tới MariaDB');
        conn.release(); // trả lại connection cho pool
    })
    .catch(err => {
        console.error('Không thể kết nối tới MariaDB:', err);
    });

// POST /login - Đăng nhập
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Vui lòng cung cấp username và password'
        });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (rows.length > 0) {
            const user = rows[0];
            // Không trả về password cho client
            const { password, ...userInfo } = user;

            // Xử lý các kiểu dữ liệu đặc biệt của MariaDB (như BigInt)
            // chuyển đổi BigInt sang string để không bị lỗi JSON.stringify
            Object.keys(userInfo).forEach(key => {
                if (typeof userInfo[key] === 'bigint') {
                    userInfo[key] = userInfo[key].toString();
                }
            });

            res.status(200).json({
                status: 'success',
                message: 'Đăng nhập thành công',
                data: userInfo
            });
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Sai tên đăng nhập hoặc mật khẩu'
            });
        }
    } catch (err) {
        console.error('Lỗi truy vấn DB:', err);
        res.status(500).json({
            status: 'error',
            message: 'Lỗi server nội bộ'
        });
    } finally {
        if (conn) conn.release();
    }
});

// GET /users/:id - Lấy thông tin người dùng
app.get('/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            status: 'error',
            message: 'ID người dùng không hợp lệ'
        });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM users WHERE id = ?', [id]);

        if (rows.length > 0) {
            const user = rows[0];
            // Không trả về password cho client
            const { password, ...userInfo } = user;

            // Chuyển đổi BigInt sang string nếu có
            Object.keys(userInfo).forEach(key => {
                if (typeof userInfo[key] === 'bigint') {
                    userInfo[key] = userInfo[key].toString();
                }
            });

            res.status(200).json({
                status: 'success',
                data: userInfo
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Không tìm thấy người dùng'
            });
        }
    } catch (err) {
        console.error('Lỗi truy vấn DB:', err);
        res.status(500).json({
            status: 'error',
            message: 'Lỗi server nội bộ'
        });
    } finally {
        if (conn) conn.release();
    }
});

// Port và Host cho service
const PORT = 8081;
// Chạy trên 0.0.0.0 để có thể nhận các request từ mọi IP trong mạng LAN
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`User Service đang chạy tại http://${HOST}:${PORT}`);
    console.log(`Các máy khác trong mạng LAN (hoặc Orchestrator) có thể truy cập qua IP: http://172.16.35.155:${PORT}`);
});
