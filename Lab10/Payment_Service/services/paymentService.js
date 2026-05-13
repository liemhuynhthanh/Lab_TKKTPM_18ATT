const pool = require("../db");

async function processPayment(orderId, userId, method) {
  console.log(`💰 Thanh toán đơn ${orderId} bằng ${method}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const status = "PAID";

  await pool.execute(
    "INSERT INTO payments (orderId, userId, method, status) VALUES (?, ?, ?, ?)",
    [orderId, userId, method, status],
  );

  return status;
}

module.exports = {
  processPayment,
};
