const axios = require('axios');
const https = require('https');
const fs = require('fs');

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        key: fs.readFileSync('/Users/thanasis/localhost-key.pem'),
        cert: fs.readFileSync('/Users/thanasis/localhost.pem'),
        rejectUnauthorized: false
    })
});

module.exports = axiosInstance;
