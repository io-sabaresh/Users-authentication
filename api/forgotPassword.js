'use stript';
const sendMail = require('../email');
const validator = require('validator');
const passwordChangedMail = require('../email/templates/newPasswordUpdated');
const forgotPasswordOTPMail = require('../email/templates/forgotPasswordOTP');
const { findOneUser, updateUser } = require('../database/mongodb/services/userServices');
const { INTERNAL_SERVER_ERROR, OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const { isNullOrUndefined, generateRadomNumber, mongoId, addMinutes, encryptString } = require('../utils/utilities');

const forgotPasswordOTP = async (req, res) => {
    try {
        if(isNullOrUndefined(req.body.email) || !validator.isEmail(req.body.email))
            return res.status(BAD_REQUEST).json({ success: false, message: 'Invalid email' });

        const userDetails = await findOneUser({ email: req.body.email }, 'isVerified');

        if(isNullOrUndefined(userDetails) || userDetails.isVerified !== true) 
            return res.status(NOT_FOUND).json({ success: false, message: 'Email Not registered or verified' });

        const OTP = generateRadomNumber();

        await updateUser({ _id: mongoId(userDetails._id)}, {
            "resetPassword.otp": OTP,
            "resetPassword.expiresAt": addMinutes(5),
            isOTPVerified: false,
            "resetPassword.resetBefore": null,
            "resetPassword.isOTPVerified": false,
        });

        const OTPMailTemplate = forgotPasswordOTPMail(req.body.email, OTP);
        sendMail(OTPMailTemplate);

        res.status(OK).json({ success: true, message: 'OTP sent to your email'})
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error });
    }
}


const verifyForgotPasswordOTP = async (req, res) => {
    try {
        if(isNullOrUndefined(req.body.email) || isNullOrUndefined(req.body.otp))
            return res.status(BAD_REQUEST).json({ success: false, message: 'Insuffecient data' });

        const userDetails = await findOneUser({ 
            email: req.body.email,
            "resetPassword.otp": parseInt(req.body.otp),
            "resetPassword.expiresAt": {
                $gte: new Date()
            },
            "resetPassword.isOTPVerified": false,
        }, "email");


        if(isNullOrUndefined(userDetails))
            return res.status(BAD_REQUEST).json({ success: false, message: 'Password Mismatch or expired' });

        await updateUser({ _id: mongoId(userDetails._id) }, {
            "resetPassword.isOTPVerified": true,
            "resetPassword.resetBefore": addMinutes(15),
            "resetPassword.isResetDone": false
        });

        res.status(OK).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error });
    }
}

const resetNewPassword = async (req, res) => {
    try {
        if(isNullOrUndefined(req.body.email) || isNullOrUndefined(req.body.password))
            return res(BAD_REQUEST).json({ success: false, message: 'Insuffecient data' });

        const userDetails = await findOneUser({ 
            email: req.body.email,
            "resetPassword.isResetDone": false,
            "resetPassword.resetBefore": {
                $gte: new Date()
            }
        }, 'isVerified');

        if(isNullOrUndefined(userDetails) || userDetails.isVerified !== true) 
            return res.status(UNAUTHORIZED).json({ success: false, message: 'Email Not registered or verified' });

        await updateUser({ _id: mongoId(userDetails._id)}, {
            password: encryptString(req.body.password.trim()),
            tokenValidFrom: new Date(),
            "resetPassword.isResetDone": true
        });

        const mailTemplate = passwordChangedMail(req.body.email);
        sendMail(mailTemplate);
        
        res.status(OK).json({ success: true, message: `Password updated` });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error });
    }
}

module.exports = {
    forgotPasswordOTP,
    verifyForgotPasswordOTP,
    resetNewPassword
}