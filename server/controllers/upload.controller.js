const cloudinary = require("../config/cloudinary.js");

const upload_image = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            return res.status(500).json({ message: "Image upload not configured: set CLOUDINARY_* in .env" });
        }

        const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: "blog_posts",
            resource_type: "image",
        });

        return res.status(200).json({ url: result.secure_url });
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Image upload failed" });
    }
};

module.exports = { upload_image };
