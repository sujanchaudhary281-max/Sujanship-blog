const mongoose = require("mongoose");
const Post = require("../models/posts.model.js");

// GET /:category  — fetch posts by category with pagination + optional search
const posts = async (req, res, next) => {
    try {
        const { category } = req.params;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
        const skip = (page - 1) * limit;

        const filter = { category };
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: "i" };
        }
        if (req.query.featured === "true") {
            filter.featured = true;
        }

        const [data, total] = await Promise.all([
            Post.find(filter).sort({ _id: -1 }).skip(skip).limit(limit),
            Post.countDocuments(filter),
        ]);

        res.status(200).json({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        next(err);
    }
};

// GET /admin/posts — all posts across categories (admin only), with search/filter/pagination
const admin_posts = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: "i" };
        }
        if (req.query.category && req.query.category !== "all") {
            filter.category = req.query.category;
        }
        if (req.query.featured === "true") {
            filter.featured = true;
        }

        const [data, total] = await Promise.all([
            Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Post.countDocuments(filter),
        ]);

        res.status(200).json({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        next(err);
    }
};

// GET /featured — featured posts across all categories (public, for the home page)
const featured_posts = async (req, res, next) => {
    try {
        const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 10));
        const data = await Post.find({ featured: true }).sort({ createdAt: -1 }).limit(limit);
        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
};

// GET /post/:id
const post = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid post id" });
        }
        const response = await Post.findById(id);
        if (!response) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
};

// POST /create_post
const create_post = async (req, res, next) => {
    try {
        const { title, image, content, category, featured } = req.body;
        const post = new Post({ title, image, content, category, featured: !!featured });
        await post.save();
        res.status(201).json({ message: "Post created successfully!", id: post._id });
    } catch (err) {
        next(err);
    }
};

// PUT /post/:id
const update_post = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, image, content, category, featured } = req.body;
        const updated = await Post.findByIdAndUpdate(
            id,
            { title, image, content, category, ...(featured !== undefined && { featured: !!featured }) },
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post updated successfully!", data: updated });
    } catch (err) {
        next(err);
    }
};

// PATCH /post/:id/featured
const toggle_featured = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid post id" });
        }
        const existing = await Post.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "Post not found" });
        }
        existing.featured = !existing.featured;
        await existing.save();
        res.status(200).json({ message: "Featured status updated!", featured: existing.featured });
    } catch (err) {
        next(err);
    }
};

// DELETE /post/:id
const delete_post = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Post.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (err) {
        next(err);
    }
};

module.exports = { posts, admin_posts, featured_posts, post, create_post, update_post, toggle_featured, delete_post };
