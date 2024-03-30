const bigPromise = require('./bigPromise');
const user = require('../models/user');
const CustomError = require('../utils/customError');
const jwt = require('jsonwebtoken');

exports.isLoggedIn = bigPromise(async (req, res, next) => {
    let token =  req.cookies.token ||req.header("Authorization ").replace('Bearer ', "");

    if (!token) {
        return next(new CustomError('Please login to get access', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await user.findById(decoded.id);

    if (!currentUser) {
        return next(new CustomError('User not found', 404));
    }
    req.user = currentUser;
    next();
});

exports.customRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new CustomError(`You are not authorized to access this url`, 403));
        }
        next();
    };
};

