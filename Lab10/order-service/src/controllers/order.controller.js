const Order = require('../models/order.model');

const axios = require('axios');

// POST /order - Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
    try {
        const { userId, items } = req.body; // items is array of { foodId, quantity }
        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ error: 'userId và items là bắt buộc' });
        }

        // 1. Gọi User Service để validate user
        const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://172.16.52.205:8081';
        try {
            const usersRes = await axios.get(`${USER_SERVICE_URL}/users`);
            const users = usersRes.data;
            const userExists = users.some(u => u.id == userId);
            if (!userExists) {
                return res.status(400).json({ error: 'User không tồn tại' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Lỗi khi gọi User Service: ' + error.message });
        }

        // 2. Gọi Food Service để lấy thông tin món ăn và tính tổng tiền
        const FOOD_SERVICE_URL = process.env.FOOD_SERVICE_URL || 'http://172.16.55.94:8082';
        let totalAmount = 0;
        let orderItems = [];

        try {
            const foodsRes = await axios.get(`${FOOD_SERVICE_URL}/foods`);
            const allFoods = foodsRes.data;

            for (let item of items) {
                const food = allFoods.find(f => f.id == item.foodId);
                if (!food) {
                    return res.status(400).json({ error: `Food với id ${item.foodId} không tồn tại` });
                }
                totalAmount += food.price * item.quantity;
                orderItems.push({
                    foodId: food.id,
                    foodName: food.name,
                    price: food.price,
                    quantity: item.quantity
                });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Lỗi khi gọi Food Service: ' + error.message });
        }

        // 3. Tạo đơn hàng
        const newOrder = await Order.create({
            userId,
            totalAmount,
            status: 'PENDING',
            items: orderItems
        });

        res.status(201).json({ message: 'Tạo đơn hàng thành công', data: newOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /order - Lấy danh sách đơn hàng (có thể lọc theo userId)
exports.getOrders = async (req, res) => {
    try {
        const { userId } = req.query;
        let orders;
        if (userId) {
            orders = await Order.findAll({ where: { userId } });
        } else {
            orders = await Order.findAll();
        }
        res.json({ orders, total: orders.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /order/:id - Lấy chi tiết 1 đơn hàng
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /order/:id - Cập nhật trạng thái
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'status là bắt buộc' });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }

        order.status = status;
        await order.save();

        res.json({ message: 'Cập nhật trạng thái thành công', data: order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

