const passport = require('passport');
const route = require('express').Router();
const { userLogin, loginPage } = require('../api/login');
const { userRegistration, verifyUserRegistration } = require('../api/signup');

route.post('/register', userRegistration);
route.get('/register', verifyUserRegistration);
route.post('/login', passport.authenticate('local'), userLogin);
route.get('/login', loginPage);

module.exports = route;