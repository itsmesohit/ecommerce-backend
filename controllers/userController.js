const e = require('express');
const bigPromise = require('../middlewares/bigPromise');
const User = require('../models/user');
const cookieToken = require('../utils/cookieToken');
const CustomError = require('../utils/customError');
const fileupload = require('express-fileupload');
const mailHelper = require('../utils/emailHelper');
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');


exports.signup = bigPromise(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
        return next(new CustomError('Please provide name, email and password, It is a required.', 400));
    }
    if(req.file === undefined){
        return next(new CustomError('Please provide a photo', 400));
    }
    let result;
    if(req.files){
        let file = req.files.photo;
        result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "user1",
                width: 150,
                crop: "scale"
            }
        );
    }
    // Implement signup logic (e.g., create a new user in the database)
    const user = await User.create({ name, email, password, photo: {
        id: result.public_id,
         url: result.secure_url
        }
    });

    cookieToken(user, res);
    // Return a JSON response indicating successful signup
    res.status(201).json({ message: 'User signed up successfully' });
   
});

exports.login = bigPromise(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new CustomError('Please provide email and password', 400));
    }

    // Implement login logic (e.g., verify user credentials)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPasswords(password))) {
        return next(new CustomError('Invalid credentials', 401));
    }

    cookieToken(user, res);

    // Return a JSON response indicating successful login
    res.status(200).json({ message: 'User logged in successfully' });
    
});

exports.forgetPassword = bigPromise(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new CustomError('Please provide an email', 400));
    }
    // Implement forget password logic (e.g., send a reset password email)
    const user = await User.findOne({ email });

    if (!user) {
        return next(new CustomError('No user found with this email', 404));
    }
    const forgetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${forgetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await mailHelper({
            email: user.email,
            subject: 'Coding Spark - password reset token',
            message,
        });
    }
    catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new CustomError('Email could not be sent', 500));
    }
    // Return a JSON response indicating successful forget password
    res.status(200).json({ message: 'Email sent successfully' });
    
});

exports.resetPassword = bigPromise(async (req, res, next) => {
    const token  = req.params.token;
    console.log(token);
    const { password, confirmPassword } = req.body;

    if (!token || !password) {
        return next(new CustomError('Please provide token and password', 400));
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
        return next(new CustomError('Invalid link', 400));
    }
    if(password !== confirmPassword){
        return next(new CustomError('Password and confirm password does not match', 400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    cookieToken(user, res);

    // Return a JSON response indicating successful password reset
    res.status(200).json({ message: 'Password reset successfully' });
    
});

exports.userProfile = bigPromise(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
});

exports.changePassword = bigPromise(async (req, res, next) => {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(new CustomError('Please provide current password, new password and confirm password', 400));
    }
    if (!(await user.matchPasswords(currentPassword))) {
        return next(new CustomError('Current password is incorrect', 400));
    }
    if(newPassword !== confirmPassword){
        return next(new CustomError('New password and confirm password does not match', 400));
    }
    user.password = newPassword;
    await user.save();
    cookieToken(user, res);
    res.status(200).json({ message: 'Password changed successfully', success: true });

});

exports.updateProfile = bigPromise(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
    };
    // this should be only run if the user is updating the photo
    if( req.files){
        // delete file from cloudinary
        const user = await User.findById(req.user.id);
        await cloudinary.uploader.destroy(user.photo.id);

        let result;
        if(req.files){
            let file = req.files.photo;
            result = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "user1",
                    width: 150,
                    crop: "scale"
                }
            );
        }
        newData.photo = {
            id: result.public_id,
            url: result.secure_url
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({ success: true, data: user });


});

exports.adminAllUsers = bigPromise(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
});

exports.adminGetOneUser = bigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new CustomError(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: user });
});
// can update the user details
exports.adminUpdateUser = bigPromise(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    if (!user) {
        return next(new CustomError(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: user });
});

exports.adminDeleteUser = bigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new CustomError(`User not found with id of ${req.params.id}`, 404));
    }
    // delete file from cloudinary
    await cloudinary.uploader.destroy(user.photo.id);

    await user.remove();

    res.status(200).json({ success: true, data: {} });
}
);

exports.managerAllUsers = bigPromise(async (req, res, next) => {
    const users = await User.find({role: 'user'});
    res.status(200).json({ success: true, data: users });
});



exports.logout = bigPromise(async (req, res, next) => {
    res.cookie('token', 'none', {
        expiresIn: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({ message: 'User logged out successfully', success: true});
    
});
