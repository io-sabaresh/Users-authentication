const { EMAIL_FROM } = require('../../constants');

module.exports = (to, OTP) => {
    return {
        from: EMAIL_FROM,
        subject: 'Forgot password OTP',
        to,
        html: `<p>OTP to reset your app password is ${OTP}</p></br><p>your OTP will be valid only for 5 more minutes</p>`
    }
}