const express = require("express");

const { googleLogin, getLogins } = require("../controllers/googleAuth.controller.js")


const router = express.Router();

router.get("/google", googleLogin);
router.post("/google", getLogins);

module.exports = router;