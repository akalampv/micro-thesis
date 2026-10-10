const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const purgeOrphanFiles = require('./commands/purgeOrphanFiles.js');

cron.schedule('0 2 * * *', purgeOrphanFiles, {
    timezone: 'Europe/Athens',
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3002;

const server = app.listen(port, () => {
    console.log(`Form service running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });
});
