function sendNotification(userId, orderId) {
  console.log(`🔔 User ${userId} đã thanh toán đơn #${orderId} thành công`);
}

module.exports = {
  sendNotification,
};
