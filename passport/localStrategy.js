const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { isNullOrUndefined } = require('../utils/utilities');
const { fetchUserDate } = require('../database/mongodb/services/userServices');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    async function (req, email, password, done) {

        const user = await fetchUserDate({ email }, 'isVerified username email password');

        if (isNullOrUndefined(user) || user.isVerified !== true) return done(null, false, 'Unauthorized');

        const isMatch = await user.comparePassword(password);

        if (isMatch === true) return done(null, user);
        else return done(null, false, 'Unauthorized');
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;