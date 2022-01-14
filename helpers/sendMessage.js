// Credentials for Twilio api use
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Initalize Twilio client
const client = require('twilio')(accountSid, authToken);

/* Use Twilio client to send a sms message
 * @param: {string} 'to' SMS recipient's phone number (no spaces or dashes, add country code at beginning e.g. +1)
 * @param: {string} 'from' SMS sender phone number (same format above)
 * @param: {string} 'body' Text message that is sent to recipient
 * @param: {function} 'cb' Callback function, by default returns response from Twilio
 */

const sendMessage = (to, from, body, cb = (response) => { return response; }) => {
  client.messages.create({ to, from, body })
    .then((message) => {
      console.log(`Message sent sucessfully to ${to}`);
      cb(message);
    })
    .catch((error) => {
      console.log(`Error sending message ${to}`, error);
      cb(error);
    });
};

module.exports = { sendMessage };
