const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory mock data cho hệ thống quản lý người dùng
const users = [
    { id: 1, username: 'user1', password: 'password1', name: 'Nguyen Van A', email: 'a@example.com', phone: '0123456789' },
    { id: 2, username: 'user2', password: 'password1', name: 'Tran Thi B', email: 'b@example.com', phone: '0987654321' }
];

// POST /login - Đăng nhập
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Vui lòng cung cấp username và password'
        });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Không trả về password cho client
        const { password, ...userInfo } = user;
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
});

// GET /users/:id - Lấy thông tin người dùng
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (user) {
        // Không trả về password cho client
        const { password, ...userInfo } = user;
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
});

// Port và Host cho service
const PORT = 8081;
// Chạy trên 0.0.0.0 để có thể nhận các request từ mọi IP trong mạng LAN
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`User Service đang chạy tại http://${HOST}:${PORT}`);
    console.log(`Các máy khác trong mạng LAN (hoặc Orchestrator) có thể truy cập qua IP: http://172.16.35.155:${PORT}`);
});
