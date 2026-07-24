const express = require("express");
const router = express.Router();
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const { upload_image } = require("../controllers/upload.controller.js");
const { requireAuth } = require("../middleware/requireAuth.js");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) return cb(null, true);
        cb(new Error("Only image files are allowed"));
    },
});

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many uploads, please try again later." },
});

router.post("/api/upload", requireAuth, uploadLimiter, upload.single("image"), upload_image);

module.exports = router;
