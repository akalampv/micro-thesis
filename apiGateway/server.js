const express = require('express');
const httpProxy = require('http-proxy');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const apiProxy = httpProxy.createProxyServer();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const FORM_SERVICE_URL = process.env.FORM_SERVICE_URL;

// User Service Proxy
app.use('/api/users', (req, res) => {
    apiProxy.web(req, res, { target: USER_SERVICE_URL });
});

// Form Service Proxy
app.use('/api/forms', (req, res) => {
    apiProxy.web(req, res, { target: FORM_SERVICE_URL });
});

// Error handling
apiProxy.on('error', (err, req, res) => {
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
