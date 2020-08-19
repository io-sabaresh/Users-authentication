'use strict';
const sendMail = require('../email');
const { ErrorHandler } = require('../interceptors/errors');
const verificationEmail = require('../email/templates/verifyRegistration');
const { BAD_REQUEST, OK, CONFLICT } = require('http-status-codes');
const { USER_VERIFICATION_API, HOUR_IN_MINUTES, VERIFICATION_TOKEN_SPLIT, LOGIN_PAGE } = require('../constants');
const { isNullOrUndefined, generateRandonString, mongoId, addMinutes } = require('../utils/utilities');
const { findOneUser, createNewUser, updateUser } = require('../database/mongodb/services/userServices');

const userRegistration = async (req, res, next) => {
    try {
        if (isNullOrUndefined(req.body.email) || isNullOrUndefined(req.body.password) || isNullOrUndefined(req.body.password))
            throw new ErrorHandler(BAD_REQUEST, `Bad Request`);

        let user = await findOneUser({ email: req.body.email }, "isVerified");

        if (isNullOrUndefined(user)) {  // New user
            user = await createNewUser({
                username: req.body.username,
                firstName: req.body.username,
                email: req.body.email,
                password: req.body.password,
            });
        } else { // Already registred user
            if (user.isVerified === true) // If the user is verified
                throw new ErrorHandler(CONFLICT, `User already exist!`);
        }

        const key = `${user._id}${VERIFICATION_TOKEN_SPLIT}${generateRandonString()}`; // User Specific key for registration

        await updateUser({ _id: mongoId(user._id) }, { // Upate registration key in DB
            registration: {
                token: key,
                isUsed: false,
                expiresAt: new Date(addMinutes(HOUR_IN_MINUTES * 2))
            }
        });

        // Account Verification email
        const mailContent = verificationEmail(req.body.email, `${USER_VERIFICATION_API}${key}`);
        sendMail(mailContent);

        res.status(OK).json({ success: true, message: `Success` });
    } catch (error) {
        next(error);
    }
}


const verifyUserRegistration = async (req, res, next) => {
    try {
        if (isNullOrUndefined(req.query.token) || (req.query.token).split(VERIFICATION_TOKEN_SPLIT).length !== 2)
            throw new ErrorHandler(BAD_REQUEST, `Token missing or Invalid`);

        const userId = req.query.token.split(VERIFICATION_TOKEN_SPLIT)[0];

        const query = {
            _id: mongoId(userId),
            "registration.token": (req.query.token).trim(),
            "registration.isUsed": false,
            "registration.expiresAt": {
                $gte: new Date().toISOString()
            }
        }
        const user = await findOneUser(query, "isVerified registration");

        if (isNullOrUndefined(user))
            throw new ErrorHandler(BAD_REQUEST, `Token Invalid or already used`);

        await updateUser({ _id: mongoId(user._id) }, { // Upate registration key in DB
            registration: {
                isUsed: true
            },
            isVerified: true,
            verifiedAt: new Date(),
            tokenValidFrom: new Date()
        });

        res.redirect(LOGIN_PAGE);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    userRegistration,
    verifyUserRegistration
}