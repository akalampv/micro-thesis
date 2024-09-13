const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const dotenv = require('dotenv');
const axios = require('./../utils/axios');
const crypto = require('crypto');
const dispatchEvent = require('./../utils/eventDispatcher');

dotenv.config({ path: './../config.env' });

const correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const changedPasswordAfter = (user, JWTTimestamp) => {
    if (user.passwordChangedAt) {
        if (typeof user.passwordChangedAt === 'string') {
            user.passwordChangedAt = new Date(user.passwordChangedAt);
        }
        const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

const createPasswordResetToken = async () => {
    return crypto.randomBytes(32).toString('hex');
};

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const response = await axios.post(process.env.USER_SERVICE_URL, req.body);
    const newUser = response.data.data?.user;

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists && password is correct
    const response = await axios.get(`${process.env.USER_SERVICE_URL}/email/${email}`);
    const user = response.data.data?.user;

    if (!user || !(await correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const response = await axios.get(`${process.env.USER_SERVICE_URL}/${decoded.id}`);
    const currentUser = response.data.data?.user;

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (changedPasswordAfter(currentUser, decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.headers['user_id'] = currentUser._id;
    req.headers['user_email'] = currentUser.email;
    req.headers['user_role'] = currentUser.role;
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        const role = req.user?.role || req.headers['user_role'];

        if (!roles.includes(role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const response = await axios.get(`${process.env.USER_SERVICE_URL}/email/${req.body.email}`);
    const user = response.data.data?.user;

    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    const resetToken = await createPasswordResetToken();

    const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    await axios.patch(`${process.env.USER_SERVICE_URL}/${user._id}`, {
        passwordResetToken: passwordResetToken,
        passwordResetExpires: Date.now() + 10 * 60 * 1000
    });

    const resetURL = `${req.get('origin')}/resetPassword/${resetToken}`;

    const message = `Ξεχάσατε τον κωδικό σας; Ακουλουθήστε τον παρακάτω σύνδεσμο για να δημιουργήσετε καινούριο κωδικό.
        \n${resetURL}
        \nΑν δεν ξεχάσατε τον κωδικό σας, παρακαλούμε αγνοήστε αυτό το email!`;

    dispatchEvent('forgorPassword', {
        value: JSON.stringify({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        })
    });

    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const response = await axios.patch(
        `${process.env.USER_SERVICE_URL}/resetPassword/${req.params.token}`,
        req.body
    );

    const user = response.data.data?.user;

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const response = await axios.post(
        `${process.env.USER_SERVICE_URL}/updateMyPassword`,
        req.body
    );

    const user = response.data.data?.user;

    createSendToken(user, 200, res);
});

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for password updates. Please use /updateMyPassword.', 400)
        );
    }

    const userId = req.user?.id || req.headers['user_id'];

    const response = await axios.patch(`${process.env.USER_SERVICE_URL}/${userId}`, req.body);

    const updatedUser = response.data.data?.user;

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});
