const jwt = require("jsonwebtoken");
const { isAuthorized } = require("../utils/authorized.js");

const requireAuth = (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : null;
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server auth not configured: set JWT_SECRET in .env" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!isAuthorized(decoded.email)) {
            return res.status(403).json({ message: "This email is not authorized" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = { requireAuth };
