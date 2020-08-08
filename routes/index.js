const passport = require('passport');
const route = require('express').Router();
const { userLogin, loginPage } = require('../api/login');
const { verifyUserJWT } = require('../api/users');
const { userRegistration, verifyUserRegistration } = require('../api/signup');

route.post('/register', userRegistration);
route.get('/register', verifyUserRegistration);
route.post('/login', passport.authenticate('local'), userLogin);
route.get('/login', loginPage);
route.post('/token', verifyUserJWT);

module.exports = route;