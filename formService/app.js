const express = require('express');
const cors = require('cors')
const helmet = require('helmet');
const subscribe = require('./utils/eventSubscriber');
const formController = require('./controllers/formController');

subscribe(['userUpdated'], formController.updateUserData);

const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/errorMiddleware');
const formRouter = require('./routes/formRoutes');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3002'],
}));

app.use(helmet());

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1', formRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
