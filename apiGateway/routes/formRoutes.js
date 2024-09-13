const express = require('express');
const authController = require('../controllers/authController');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

const proxy = createProxyMiddleware({
    target: process.env.FORM_SERVICE_URL,
    changeOrigin: true,
    secure: false
});

router.use(authController.protect);

router
    .route('/')
    .get(proxy)
    .post(authController.restrictTo('employee'), proxy);

router
    .route('/:id')
    .get(proxy)
    .patch(proxy)
    .delete(authController.restrictTo('employee'), proxy);

router.post('/upload', authController.restrictTo('employee'), proxy);
router.post('/download', proxy);

module.exports = router;
