'use strict';
const jwt = require('jsonwebtoken');
const { JWT_EXPIRATION, JWT_SECRET } = require('../constants');
const { isNullOrUndefined } = require('./utilities');

/**
 * Create JWT token
 * @param {Object} content 
 */
const signJWT = (content) => {
    try { 
        return jwt.sign(content, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    } catch (error) {
        throw error;
    }
}

/**
 * Verify JWT token
 * @param {String} token 
 */
const verifyJWT = (token) => {
    try {
        if(isNullOrUndefined(token)) throw `Token required`;

        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    signJWT,
    verifyJWT
}