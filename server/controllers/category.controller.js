const Category = require("../models/category.model.js");

// GET /categories
const get_categories = async (req, res, next) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json({ data: categories });
    } catch (err) {
        next(err);
    }
};

// POST /categories
const create_category = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Category name is required" });
        }
        const trimmedName = name.trim();
        const existing = await Category.findOne({
            name: { $regex: new RegExp("^" + trimmedName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") }
        });
        if (existing) {
            return res.status(409).json({ message: "Category already exists" });
        }
        const category = new Category({ name: trimmedName });
        await category.save();
        res.status(201).json({ message: "Category created!", data: category });
    } catch (err) {
        next(err);
    }
};

// DELETE /categories/:id
const delete_category = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted!" });
    } catch (err) {
        next(err);
    }
};

module.exports = { get_categories, create_category, delete_category };
