require('dotenv').config();


module.exports = {
    /**
     * Environment Variable Constants
     */
    // Server Port
    PORT: process.env.PORT || 5000,
    // Email Sent from
    EMAIL_FROM: process.env.EMAIL_FROM,
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
    HOUR_IN_MINUTES: 60
}


/**
 * Environment file template
 */
/*
PORT=
BCRYPT_SALT=
EMAIL_FROM=
LOGIN_PAGE=
USER_VERIFICATION_API=
SENDGRID_API_KEY=
MONGO_CONNECTION_STRING=
*/