const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'formService',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'formServiceGroup' });

const subscribe = async (topics, callback) => {
    await consumer.connect()

    await consumer.subscribe({ topics, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            callback(topic, JSON.parse(message.value.toString()));
        },
    })
};

module.exports = subscribe;
