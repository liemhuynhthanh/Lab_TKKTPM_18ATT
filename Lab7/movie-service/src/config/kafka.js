const { Kafka } = require('kafkajs');
const config = require('./config');

const kafka = new Kafka({
    clientId: config.KAFKA.clientId,
    brokers: config.KAFKA.brokers,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'movie-group' });

/**
 * Kết nối cả Producer và Consumer
 */
const connectKafka = async () => {
    try {
        await producer.connect();
        console.log('[Kafka] Producer connected.');

        await consumer.connect();
        console.log('[Kafka] Consumer connected.');
        
        // Đăng ký lắng nghe các topic quan trọng trong hệ thống
        await consumer.subscribe({ topics: ['BOOKING_CREATED', 'USER_REGISTERED'], fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
                const payload = JSON.parse(message.value.toString());
                
                console.log(`[Kafka Event Received] ${prefix}`);
                console.log('Payload:', payload);

                // Xử lý logic tùy theo topic
                if (topic === 'BOOKING_CREATED') {
                    console.log(`=> Movie Service ghi nhận: Có đơn đặt vé mới cho Movie ID: ${payload.movieId}`);
                }
            },
        });

    } catch (error) {
        console.error('[Kafka] Connection/Subscription Error:', error.message);
    }
};

/**
 * Hàm gửi event
 */
const sendEvent = async (topic, message) => {
    try {
        await producer.send({
            topic,
            messages: [
                { value: JSON.stringify(message) },
            ],
        });
        console.log(`[Kafka Event Sent] Topic: ${topic}`);
    } catch (error) {
        console.error('[Kafka] Produce Error:', error.message);
    }
};

module.exports = { connectKafka, sendEvent };
