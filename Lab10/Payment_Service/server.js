require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./db");

const { processPayment } = require("./services/paymentService");
const { sendNotification } = require("./services/notificationService");

const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== ROUTES =====
app.post("/payments", async (req, res) => {
  try {
    const { orderId, userId, method } = req.body;

    if (!orderId || !userId || !method) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const status = await processPayment(orderId, userId, method);

    const ORDER_SERVICE_URL =
      process.env.ORDER_SERVICE_URL || "http://order-service:8083";

    try {
      await axios.put(`${ORDER_SERVICE_URL}/order/${orderId}`, {
        status: status,
      });
    } catch (orderError) {
      console.error("❌ Error updating order:", orderError.message);
    }

    sendNotification(userId, orderId);

    res.json({
      message: "Payment successful",
      orderId,
      paymentStatus: status,
    });
  } catch (error) {
    console.error("❌ Payment error:", error.message);
    res.status(500).json({ message: "Payment failed" });
  }
});

app.get("/payments", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM payments");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments" });
  }
});

// ===== DB FUNCTIONS =====
async function testDB() {
  const conn = await pool.getConnection();
  conn.release();
  console.log("✅ Connected to MariaDB");
}

async function initDB() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderId INT NOT NULL,
      userId INT NOT NULL,
      method VARCHAR(50),
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Table payments ready");
}

// ===== START SERVER WITH RETRY =====
const PORT = process.env.PORT || 8084;

const startServer = async () => {
  let retries = 10;

  while (retries) {
    try {
      console.log("⏳ Connecting to MariaDB...");

      await testDB();
      await initDB();

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Payment Service running at port ${PORT}`);
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
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};

startServer();