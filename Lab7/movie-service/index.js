const app = require('./src/app');
const config = require('./src/config/config');
const { connectKafka } = require('./src/config/kafka');

const startServer = async () => {
    // Kết nối Kafka trước khi khởi động server
    await connectKafka();

    app.listen(config.PORT, () => {
        console.log(`===========================================`);
        console.log(`Movie Service (Person 3) is running!`);
        console.log(`Port: ${config.PORT}`);
        console.log(`Kafka Broker: ${config.KAFKA.brokers}`);
        console.log(`Health Check: http://localhost:${config.PORT}/`);
        console.log(`===========================================`);
    });
};

startServer();

