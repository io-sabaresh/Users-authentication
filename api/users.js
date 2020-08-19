'use strict';
const sendMail = require('../email');
const { ErrorHandler } = require('../interceptors/errors');
const { OK, UNAUTHORIZED, BAD_REQUEST } = require('http-status-codes');
const passwordChangedMail = require('../email/templates/newPasswordUpdated');
const { updateUser } = require('../database/mongodb/services/userServices');
const { isNullOrUndefined, mongoId, encryptString } = require('../utils/utilities');

const verifyUserJWT = async (req, res, next) => {
    try {
        if (isNullOrUndefined(req.user))
            throw new ErrorHandler(UNAUTHORIZED, 'Invalid token');

        res.status(OK).json({ success: true, message: req.user })
    } catch (error) {
        next(error);
    }
}

const updateNewPassword = async (req, res, next) => {
    try {
        if (isNullOrUndefined(req.user) || isNullOrUndefined(req.body.password))
            throw new ErrorHandler(BAD_REQUEST, 'Insuffecient data');

        await updateUser({ _id: mongoId(req.user._id) }, {
            password: encryptString(req.body.password.trim()),
            tokenValidFrom: new Date()
        });

        const mailTemplate = passwordChangedMail(req.user.email);
        sendMail(mailTemplate);

        res.status(OK).json({ success: true, message: `Password updated` });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    verifyUserJWT,
    updateNewPassword
}