const express = require('express');
const helmet = require('helmet');
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const gatewayRoutes = require('./routes/gatewayRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use(helmet());

app.use(mongoSanitize());

app.use(xss());

app.use('/', gatewayRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
