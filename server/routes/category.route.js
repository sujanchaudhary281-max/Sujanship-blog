const express = require("express");
const router = express.Router();
const { get_categories, create_category, delete_category } = require("../controllers/category.controller.js");
const { requireAuth } = require("../middleware/requireAuth.js");

router.get("/api/categories", get_categories);
router.post("/api/categories", requireAuth, create_category);
router.delete("/api/categories/:id", requireAuth, delete_category);

module.exports = router;
