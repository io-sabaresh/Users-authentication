const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY } = require('../constants');

sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = (message) => {
    sgMail.send(message);
}