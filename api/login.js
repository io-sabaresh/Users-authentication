'use strict';
const { signJWT } = require('../utils/jwt');
const { ErrorHandler } = require('../interceptors/errors');
const { JWT_METHOD, COOKIE_NAME } = require('../constants');
const { INTERNAL_SERVER_ERROR, OK } = require('http-status-codes');

const userLogin = async (req, res, next) => {
    try {
        const tokenContent = {
            user: req.user._id,
            username: req.user.username,
            email: req.user.email,
            iat: Date.now()
        }

        const token = signJWT(tokenContent);

        if (JWT_METHOD === 'HEADER') {
            res.status(OK).json({ success: true, message: 'Login success', token });
        } else if (JWT_METHOD === 'COOKIE') {
            res.cookie(COOKIE_NAME, token, { maxAge: 900000, httpOnly: true })
            res.status(OK).json({ success: true, message: 'Login success' });
        }
    } catch (error) {
        next(new ErrorHandler(INTERNAL_SERVER_ERROR, error));
    }
}

const loginPage = async (req, res, next) => {
    try {
        res.status(OK).send("Render Login Page!")
    } catch (error) {
        next(new ErrorHandler(INTERNAL_SERVER_ERROR, error));
    }
}

module.exports = { userLogin, loginPage }