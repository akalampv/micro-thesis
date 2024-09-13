const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const subscribe = require('./utils/eventSubscriber');
const sendEmail = require('./utils/email');

subscribe(['formStatusChanged', 'forgorPassword'], async (topic, data) => {
    await sendEmail({
        email: data.email,
        subject: data.subject,
        message: data.message,
    });
});
