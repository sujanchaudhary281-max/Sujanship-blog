const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { body, param, query, validationResult } = require("express-validator");
const {
    posts, admin_posts, featured_posts, post, create_post, update_post, toggle_featured, delete_post
} = require("../controllers/posts.controller.js");
const { requireAuth } = require("../middleware/requireAuth.js");

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }
    next();
};

const createLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts, please try again later." },
});

const postBodyValidators = [
    body("title").trim().notEmpty().withMessage("title is required"),
    body("content").trim().notEmpty().withMessage("content is required"),
    body("category").trim().notEmpty().withMessage("category is required"),
    body("image")
        .optional({ values: "falsy" })
        .custom((value) => {
            if (/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value)) return true;
            if (/^https?:\/\/.+/.test(value)) return true;
            throw new Error("image must be a valid URL or base64 image");
        }),
];

// Admin: all posts with search / filter / pagination
router.get(
    "/admin/posts",
    requireAuth,
    [
        query("page").optional().isInt({ min: 1 }),
        query("limit").optional().isInt({ min: 1, max: 50 }),
    ],
    handleValidation,
    admin_posts
);

router.get(
    "/post/:id",
    param("id").isMongoId().withMessage("Invalid post id"),
    handleValidation,
    post
);

// Featured posts across all categories (public). Must come before "/:category".
router.get("/featured", featured_posts);

router.get(
    "/:category",
    query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be between 1 and 50"),
    handleValidation,
    posts
);

router.post(
    "/create_post",
    requireAuth,
    createLimiter,
    postBodyValidators,
    handleValidation,
    create_post
);

router.put(
    "/post/:id",
    requireAuth,
    createLimiter,
    param("id").isMongoId().withMessage("Invalid post id"),
    postBodyValidators,
    handleValidation,
    update_post
);

// Toggle featured status
router.patch(
    "/post/:id/featured",
    requireAuth,
    param("id").isMongoId().withMessage("Invalid post id"),
    handleValidation,
    toggle_featured
);

router.delete(
    "/post/:id",
    requireAuth,
    createLimiter,
    param("id").isMongoId().withMessage("Invalid post id"),
    handleValidation,
    delete_post
);

module.exports = router;
