const mongoose = require('mongoose');
const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');

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

const port = process.env.PORT || 3001;

const options = {
    key: fs.readFileSync(`/Users/thanasis/localhost-key.pem`),
    cert: fs.readFileSync('/Users/thanasis/localhost.pem'),
};

https.createServer(options, app).listen(port, function () {
    console.log(`User service running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });
});
