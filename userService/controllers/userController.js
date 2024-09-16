const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const crypto = require('crypto');
const dispatchEvent = require('../utils/eventDispatcher');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const query = Object.assign({}, req.query);
    const excludedFields = ['page', 'sort', 'limit', 'search'];
    excludedFields.forEach(field => delete query[field]);
    Object.keys(query).forEach(key => {
        query[key] = Number(query[key]) || query[key];
    });

    const users = await User.find(query);

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.getUserByEmail = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
        return next(new AppError('No user found with that email', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.createUser = catchAsync(async (req, res) => {
    const userData = req.body.role === 'employee' ? {
        role: req.body.role,
        service: req.body.service,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        dateOfBirth: req.body.dateOfBirth,
        placeOfBirth: req.body.placeOfBirth,
        address: req.body.address,
        idNumber: req.body.idNumber,
        vatNumber: req.body.vatNumber,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    } : {
        role: req.body.role,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    };

    const user = await User.create(userData);

    res.status(201).json({
        status: 'success',
        data: { user }
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    dispatchEvent('userUpdated', {
        value: JSON.stringify(user)
    });

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(201).json({
        status: 'success',
        data: { user }
    });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const userId = req.user?.id || req.headers['user_id'];
    const user = await User.findById(userId).select('+password');

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    res.status(201).json({
        status: 'success',
        data: { user }
    });
});
