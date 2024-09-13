const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.patch('/resetPassword/:token', userController.resetPassword);
router.patch('/updateMyPassword', userController.updatePassword);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router
    .route('/email/:email')
    .get(userController.getUserByEmail);

module.exports = router;
