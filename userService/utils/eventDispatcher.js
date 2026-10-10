const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'userService',
    brokers: ['kafka:9092'],
});

const producer = kafka.producer();

const dispatchEvent = async (topic, message) => {
    await producer.connect();

    await producer.send({
        topic,
        messages: [message],
    });

    await producer.disconnect();
};

module.exports = dispatchEvent;
