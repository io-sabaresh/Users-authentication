const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const bcrypt = require('bcrypt');
const { BCRYPT_SALT: SALT } = require('../../../constants');

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        minlength: [6, 'user name is too short'],
        unique: [true, 'username is already taken'],
        required: [true, 'username is required']
    },
    email: {
        type: String,
        trim: true,
        unique: [true, 'Email is alreafy registered, try login'],
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        lowercase: true,
    },
    password: {
        type: String,
        trim: true,
        select: false
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    verifiedAt: {
        type: Date
    },
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First Name is required']
    },
    lastName: {
        type: String,
        trim: true,
    },
    tokenValidFrom: {
        type: Date,
    },
    registration: {
        token: String,
        expiresAt: Date,
        isUsed: {
            type: Boolean,
            default: false
        }
    },
    resetPassword: {
        otp: {
            type: Number,
            min: 100000,
            max: 999999
        },
        expiresAt: Date,
        isUsed: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});


UserSchema.pre('save', function (next) {
    let user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(parseInt(SALT), function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Users', UserSchema);