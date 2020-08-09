'use stript';
const sendMail = require('../email');
const validator = require('validator');
const { ErrorHandler } = require('../interceptors/errors');
const passwordChangedMail = require('../email/templates/newPasswordUpdated');
const forgotPasswordOTPMail = require('../email/templates/forgotPasswordOTP');
const { OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const { findOneUser, updateUser } = require('../database/mongodb/services/userServices');
const { isNullOrUndefined, generateRadomNumber, mongoId, addMinutes, encryptString } = require('../utils/utilities');

const forgotPasswordOTP = async (req, res, next) => {
    try {
        if (isNullOrUndefined(req.body.email) || !validator.isEmail(req.body.email))
            throw new ErrorHandler(BAD_REQUEST, 'Invalid email');

        const userDetails = await findOneUser({ email: req.body.email }, 'isVerified');

        if (isNullOrUndefined(userDetails) || userDetails.isVerified !== true)
            throw new ErrorHandler(NOT_FOUND, 'Email Not registered or verified');


        const OTP = generateRadomNumber();

        await updateUser({ _id: mongoId(userDetails._id) }, {
            "resetPassword.otp": OTP,
            "resetPassword.expiresAt": addMinutes(5),
            isOTPVerified: false,
            "resetPassword.resetBefore": null,
            "resetPassword.isOTPVerified": false,
        });

        const OTPMailTemplate = forgotPasswordOTPMail(req.body.email, OTP);
        sendMail(OTPMailTemplate);

        res.status(OK).json({ success: true, message: 'OTP sent to your email' })
    } catch (error) {
        next(error)
    }
}


const verifyForgotPasswordOTP = async (req, res, next) => {
    try {
        if (isNullOrUndefined(req.body.email) || isNullOrUndefined(req.body.otp))
            throw new ErrorHandler(BAD_REQUEST, 'Insuffecient data');

        const userDetails = await findOneUser({
            email: req.body.email,
            "resetPassword.otp": parseInt(req.body.otp),
            "resetPassword.expiresAt": {
                $gte: new Date()
            },
            "resetPassword.isOTPVerified": false,
        }, "email");


        if (isNullOrUndefined(userDetails))
            throw new ErrorHandler(BAD_REQUEST, 'Password Mismatch or expired');

        await updateUser({ _id: mongoId(userDetails._id) }, {
            "resetPassword.isOTPVerified": true,
            "resetPassword.resetBefore": addMinutes(15),
            "resetPassword.isResetDone": false
        });

        res.status(OK).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        next(error)
    }
}

const resetNewPassword = async (req, res, next) => {
    try {
        if (isNullOrUndefined(req.body.email) || isNullOrUndefined(req.body.password))
            throw new ErrorHandler(BAD_REQUEST, 'Insuffecient data');

        const userDetails = await findOneUser({
            email: req.body.email,
            "resetPassword.isResetDone": false,
            "resetPassword.resetBefore": {
                $gte: new Date()
            }
        }, 'isVerified');

        if (isNullOrUndefined(userDetails) || userDetails.isVerified !== true)
            throw new ErrorHandler(UNAUTHORIZED, 'Email Not registered or verified');

        await updateUser({ _id: mongoId(userDetails._id) }, {
            password: encryptString(req.body.password.trim()),
            tokenValidFrom: new Date(),
            "resetPassword.isResetDone": true
        });

        const mailTemplate = passwordChangedMail(req.body.email);
        sendMail(mailTemplate);

        res.status(OK).json({ success: true, message: `Password updated` });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    forgotPasswordOTP,
    verifyForgotPasswordOTP,
    resetNewPassword
}