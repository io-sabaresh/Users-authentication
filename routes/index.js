const passport = require('passport');
const route = require('express').Router();
const { userRegistration, verifyUserRegistration } = require('../api/signup');
// const { userLogin, loginPage } = require('../api/login');

route.post('/register', userRegistration);
route.get('/register', verifyUserRegistration);
// route.post('/login',  passport.authenticate('local'), userLogin);
// route.get('/login', loginPage);

module.exports = route;