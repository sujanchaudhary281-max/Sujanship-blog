const { authorizedEmails } = require("../config/authorizedEmails.json");

const isAuthorized = (email) =>
    authorizedEmails.some((e) => e.toLowerCase() === String(email).toLowerCase());

module.exports = { isAuthorized };
