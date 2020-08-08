const { EMAIL_FROM } = require('../../constants');

module.exports = (to, verificationLink) => {
    return {
        from: EMAIL_FROM,
        subject: 'Account Verification',
        to,
        html: `<p>Click the below link to verify the account</p><br><a>${verificationLink}</a>`,
        text: 'and easy to do anywhere, even with Node.js'
    }
}