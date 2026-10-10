const express = require('express');
const authController = require('../controllers/authController');
const { createProxyMiddleware } = require('http-proxy-middleware');
const limiter = require('../utils/rateLimiter');

const router = express.Router();

const proxy = createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    secure: false
});

router.patch('/resetPassword/:token', limiter, proxy);
router.patch('/updateMyPassword', authController.protect, proxy);

router
    .route('/')
    .get(authController.protect, proxy)
    .post(limiter, proxy);

router
    .route('/:id')
    .get(authController.protect, proxy)
    .patch(authController.protect, proxy)
    .delete(authController.protect, proxy);

router
    .route('/email/:email')
    .get(authController.protect, proxy);

module.exports = router;
