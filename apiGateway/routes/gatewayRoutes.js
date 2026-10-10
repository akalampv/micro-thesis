const express = require('express');
const authController = require('../controllers/authController');
const formRouter = require('./formRoutes');
const userRouter = require('./userRoutes');
const limiter = require('../utils/rateLimiter');

const router = express.Router();

router.use('/forms', formRouter);
router.use('/users', userRouter);

router.use(express.json({ limit: '10kb' }));

router.post('/signup', limiter, authController.signup);
router.post('/login', limiter, authController.login);
router.post('/forgotPassword', limiter, authController.forgotPassword);
router.patch('/resetPassword/:token', limiter, authController.resetPassword);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);
router.patch('/updateMe', authController.protect, authController.updateMe);

module.exports = router;
