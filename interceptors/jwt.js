'use strict';
const { verifyJWT } = require('../utils/jwt');
const { isNullOrUndefined, mongoId } = require('../utils/utilities');
const { findOneUser } = require('../database/mongodb/services/userServices');
const { INTERNAL_SERVER_ERROR, UNAUTHORIZED } = require('http-status-codes');
const { JWT_METHOD, COOKIE_NAME, SPACE, HEADER_TOKEN, COOKIE_TOKEN } = require('../constants');

module.exports = async (req, res, next) => {
    try {
        let token;
        if (JWT_METHOD === HEADER_TOKEN) { // If token managed through Request Headers
            if (isNullOrUndefined(req.headers.authorization) || (req.headers.authorization).split(SPACE).length != 2)
                return res.status(UNAUTHORIZED).json({ success: false, message: `Token missing` });

            token = req.headers.authorization.split(SPACE)[1];
        } else if (JWT_METHOD === COOKIE_TOKEN) { // If the token managed through cookies
            if (isNullOrUndefined(req.cookies[COOKIE_NAME]))
                return res.status(UNAUTHORIZED).json({ success: false, message: `Token missing` });

            token = req.cookies[COOKIE_NAME];
        }

        const tokenDetails = verifyJWT(token); // Fetch Token details

        const userDetails = await findOneUser({ // Fetch user details 
            _id: mongoId(tokenDetails.user),
            isVerified: true,
            tokenValidFrom: {
                $lte: new Date(tokenDetails.iat)
            },
        }, "firstName lastName username email");

        if(isNullOrUndefined(userDetails)) // If the user details not present 
            return res.status(UNAUTHORIZED).json({ success: false, message: `Invalid Token` });

        req.user = { ...userDetails }; // Add user details in request

        next();
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: error });
    }
}