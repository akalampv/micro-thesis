const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'formService',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'formServiceGroup' });

const subscribe = async (topic, callback) => {
    await consumer.connect()

    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            callback(JSON.parse(message.value.toString()));
        },
    })
};

module.exports = subscribe;
