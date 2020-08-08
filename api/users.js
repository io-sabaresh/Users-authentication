'use strict';
const { isNullOrUndefined } = require('../utils/utilities');
const { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } = require('http-status-codes');

const verifyUserJWT = async (req, res) => {
    try {
        if(isNullOrUndefined(req.user))
            return res(UNAUTHORIZED).json({ success: false, message: 'Invalid token' });

        res.status(OK).json({ success: true, message: req.user })
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error });
    }
}

module.exports = {
    verifyUserJWT
}