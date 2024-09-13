const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'formService',
    brokers: ['localhost:9092'],
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
