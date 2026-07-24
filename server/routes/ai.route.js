const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { ask_ai } = require("../controllers/ai.controller.js");

// Protect the Gemini quota from spam/abuse without throttling the rest of the API.
const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "You're sending messages too fast — please wait a moment." },
});

router.post("/api/ask", aiLimiter, ask_ai);

module.exports = router;
