require('dotenv').config();


module.exports = {
    /**
     * Environment Variable Constants
     */
    // Server Port
    PORT: process.env.PORT || 5000,
    // Email Sent from
    EMAIL_FROM: process.env.EMAIL_FROM,
    // JWT Managed by Headers/cookies
    JWT_METHOD: process.env.JWT_METHOD || 'HEADER',
    // JWT secret
    JWT_SECRET: process.env.JWT_SECRET,
    // JWT expires in
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
    // JWT Cookie name in case if the token is passed through cookies
    COOKIE_NAME: process.env.COOKIE_NAME,
    // Bcrypt salt rounds
    BCRYPT_SALT: process.env.BCRYPT_SALT,
    // Login page url to redirect on registration
    LOGIN_PAGE: process.env.LOGIN_PAGE,
    // User verification API
    USER_VERIFICATION_API: process.env.USER_VERIFICATION_API,
    // Send grid key
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    // MongoDB connection String
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,

    /**
     * Global Constants
     */
    VERIFICATION_TOKEN_SPLIT: '--',
    SPACE: " ",
    HOUR_IN_MINUTES: 60,
    HEADER_TOKEN: "HEADER",
    COOKIE_TOKEN: "COOKIE"
}


/**
 * Environment file template
 */
/*
PORT=
BCRYPT_SALT=
EMAIL_FROM=
JWT_METHOD= #[HEADER / COOKIE]
JWT_SECRET=
JWT_EXPIRATION=
COOKIE_NAME=
LOGIN_PAGE=
USER_VERIFICATION_API=
SENDGRID_API_KEY=
MONGO_CONNECTION_STRING=
*/