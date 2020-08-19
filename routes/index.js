const passport = require('passport');
const route = require('express').Router();

const jwt = require('../interceptors/jwt');
const { verifyUserJWT, updateNewPassword } = require('../api/users');
const { userLogin, loginPage } = require('../api/login');
const { userRegistration, verifyUserRegistration } = require('../api/signup');
const { forgotPasswordOTP, verifyForgotPasswordOTP, resetNewPassword } = require('../api/forgotPassword');

// Render Login Page (sample/test)
route.get('/login', loginPage);

// Login API
route.post('/login', passport.authenticate('local'), userLogin);

// Register New user
route.post('/register', userRegistration);

// Verify User and redirect to Login on success
route.get('/register', verifyUserRegistration);

// Verify JWT token and Fetch user details
route.post('/token', jwt, verifyUserJWT);

// Reset new password
route.put('/password', jwt, updateNewPassword);

// Send forgot password OTP mail
route.post('/forgot-password', forgotPasswordOTP);

// Verify the reset password OTP
route.post('/forgot-password/otp', verifyForgotPasswordOTP);

// Reset new password
route.put('/forgot-password/reset', resetNewPassword);

module.exports = route;