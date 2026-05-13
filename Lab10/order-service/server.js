require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/configs/db.config');

const PORT = process.env.PORT || 8083;

const startServer = async () => {
    let retries = 10;

    while (retries) {
        try {
            console.log("⏳ Đang kết nối MariaDB...");

            await sequelize.authenticate();
            console.log("✅ Connected to MariaDB");

            await sequelize.sync({ alter: true });
            console.log("✅ MariaDB đã đồng bộ hóa!");

            app.listen(PORT, '0.0.0.0', () => {
                console.log(`🚀 Order Service đang chạy tại port ${PORT}`);
            });

            break;
        } catch (err) {
            console.error("❌ DB chưa sẵn sàng:", err.message);
            retries--;

            if (retries === 0) {
                console.error("❌ Hết retry, thoát...");
                process.exit(1);
            }

            console.log("⏳ Retry sau 3s...");
            await new Promise(res => setTimeout(res, 3000));
        }
    }
};

startServer();