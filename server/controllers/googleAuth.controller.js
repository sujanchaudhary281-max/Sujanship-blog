const axios = require("axios");
const jwt = require("jsonwebtoken");
const GoogleUserModel = require("../models/google.model.js");
const { google } = require("googleapis")
const { isAuthorized } = require("../utils/authorized.js");
const googleLogin = async (req, res, next) => {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).json({ message: "Missing Google auth code" });
        }
        const missing = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "JWT_SECRET"]
            .filter((k) => !process.env[k] || process.env[k].startsWith("PASTE_"));
        if (missing.length) {
            return res.status(500).json({
                message: `Server auth not configured: set a real value for ${missing.join(", ")} in .env`,
            });
        }
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "postmessage"
        )
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email, name, picture } = userRes.data;
        if (!isAuthorized(email)) {
            return res.status(403).json({ message: "This email is not authorized to log in" });
        }
        let user = await GoogleUserModel.findOne({ email });
        if (!user) {
            user = await GoogleUserModel.create({
                name, email, image: picture
            })
        };
        console.log("4")

        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TIMEOUT
            }
        );
        return res.status(200).json({
            message: "Success",
            token,
            user
        })
    } catch (err) {
        next(err);
    };
}
const getLogins = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "email is required" });
        }
        const user = await GoogleUserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "can not find the user !" });
        }
        res.status(200).send(user);
    } catch (err) {
        next(err);
    }
}

module.exports = { googleLogin, getLogins }
