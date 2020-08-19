const { EMAIL_FROM } = require('../../constants');

module.exports = (to) => {
    return {
        from: EMAIL_FROM,
        subject: 'Password Updated',
        to,
        html: `<p>Password has been updated successfully, If it's not you please change the password immediately</p>`
    }
}