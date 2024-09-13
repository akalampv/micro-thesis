const express = require('express');
const authController = require('../controllers/authController');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

const proxy = createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    secure: false
});

router.patch('/resetPassword/:token', proxy);
router.patch('/updateMyPassword', proxy);

router
    .route('/')
    .get(authController.protect, proxy)
    .post(proxy);

router
    .route('/:id')
    .get(authController.protect, proxy)
    .patch(authController.protect, proxy)
    .delete(authController.protect, proxy);

router
    .route('/email/:email')
    .get(authController.protect, proxy);

module.exports = router;
