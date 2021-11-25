const User = require('../models/User');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const { sendJwtToClient } = require('../helpers/authorization/tokenHelpers');
const { validateUserInput, comparePassword } = require('../helpers/input/inputHelpers');
const sendEmail = require('../helpers/lib/sendEmail');

const register = asyncErrorWrapper(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password
    });
    sendJwtToClient(user, res);
});

const getUser = asyncErrorWrapper(async (req, res, next) => {
    return res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    });
});

const login = asyncErrorWrapper(async (req, res, next) => {

    const { email, password } = req.body;
    if (!validateUserInput(email, password)) {
        return next(new CustomError('Please don\'t empty the password and email!', 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (user === null) {
        return next(new CustomError('User does not exist!'));
    }
    if (!comparePassword(password, user.password)) {
        return next(new CustomError('Please check the password!'));
    }
    sendJwtToClient(user, res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {
    const { NODE_ENV } = process.env;
    return res
        .status(200)
        .cookie("token", null, {
            httpOnly: true,
            expires: new Date(Date.now()),
            secure: NODE_ENV === "development" ? false : true
        })
        .json({
            success: true,
            message: 'Logout Successfull'
        });
});

const profilePhotoUpload = asyncErrorWrapper(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        'profile_image': req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    });
    return res.status(200).json({
        success: true,
        message: 'Image upload successful',
    });
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email;
    const user = await User.findOne({ email: resetEmail });
    if (!user) {
        return next(new CustomError('User Not Found With That Email', 400));

    }
    const resetPasswordToken = user.getResetPasswordTokenUser();
    await user.save();
    const resetPasswordUrl = `http://localhost:5001/api/auth/forgotpassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate = `
    <h3>Reset Your Password</h3>    
    <p>This <a href='${resetPasswordUrl}' target="_blank">Link</a> Will Expire in 1 Hour!</p>
    `;
    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: 'Reset your password',
            html: emailTemplate
        });
        return res.status(200).json({
            success: true,
            message: 'Token sent to your Email'
        })
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new CustomError('Email Could Not Be Send', 500));
    }

});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
    const { resetPasswordToken } = req.query;
    const { password } = req.body;
    if (!resetPasswordToken) {
        return next(new CustomError('Please Provide a Valid Token', 400));
    }
    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new CustomError('Invalid Token or Session Expired!', 404));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
        success: true,
        message: 'Reset Password  Successful',
    });
});

const editDetails = asyncErrorWrapper(async (req, res, next) => {
    const editInformation = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
        new: true,
        runValidators: true
    });
    return res.status(200).json({
        success: true,
        data: user
    })
});

module.exports = {
    register,
    getUser,
    login,
    logout,
    profilePhotoUpload,
    forgotPassword,
    resetPassword,
    editDetails
};
