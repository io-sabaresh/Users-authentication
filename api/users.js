'use strict';
const { isNullOrUndefined, mongoId, encryptString } = require('../utils/utilities');
const { updateUser } = require('../database/mongodb/services/userServices');
const { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED, BAD_REQUEST } = require('http-status-codes');

const verifyUserJWT = async (req, res) => {
    try {
        if(isNullOrUndefined(req.user))
            return res(UNAUTHORIZED).json({ success: false, message: 'Invalid token' });

        res.status(OK).json({ success: true, message: req.user })
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error });
    }
}

const updateNewPassword = async (req, res) => {
    try {
        if(isNullOrUndefined(req.user) || isNullOrUndefined(req.body.password))
            return res(BAD_REQUEST).json({ success: false, message: 'Insuffecient data' });
        
        await updateUser({ _id: mongoId(req.user._id)}, {
            password: encryptString(req.body.password.trim()),
            tokenValidFrom: new Date()
        });
        
        res.status(OK).json({ success: true, message: `Password updated` });
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error });
    }
}

module.exports = {
    verifyUserJWT,
    updateNewPassword
}