const dns = require("dns")
dns.setServers(["8.8.8.8", "1.1.1.1"]) // system resolver points at 127.0.0.1 which refuses SRV lookups
const express = require('express')
const app = express()
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const postsRoutes = require("./routes/postRoute.route.js");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose")
const googleAuthRoutes = require("./routes/googleAuth.route.js")
const categoryRoutes = require("./routes/category.route.js")
const aiRoutes = require("./routes/ai.route.js")
const uploadRoutes = require("./routes/upload.route.js")

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser()); // it parses incomming cookies from http

// Env-driven CORS allowlist. CLIENT_ORIGINS is a comma-separated list.
// Default allows the common Vite dev ports (5173 auto-bumps to 5174+ when busy).
const allowedOrigins = (
  process.env.CLIENT_ORIGINS ||
  "https://sujanship-blog.vercel.app,http://localhost:5173,http://localhost:5174,http://localhost:5175,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser clients (curl, health checks) that send no origin
      if (!origin) {
        return callback(null, true);
      }
      // allow origins in the list, or any localhost/127.0.0.1 origin
      const isAllowed = allowedOrigins.includes(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isAllowed) {
        return callback(null, true);
      }
      // reject cleanly (no CORS headers) instead of throwing into the error handler
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// Rate limiting: broad limiter for everything, stricter one for mutations/auth.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use(globalLimiter);

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later." },
});

const PORT = process.env.PORT || 4000
const URI = process.env.mongoDBURI;

app.use('/auth', strictLimiter, googleAuthRoutes);
app.use("/", aiRoutes)
app.use("/", categoryRoutes)
app.use("/", uploadRoutes)
app.use("/", postsRoutes)

// 404 for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err && err.name === "MulterError") {
    const msg = err.code === "LIMIT_FILE_SIZE" ? "Image too large (max 5MB)" : err.message;
    return res.status(400).json({ message: msg });
  }
  if (err && err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }
  const status = err.status || 500;
  const message =
    status === 500 ? "Internal server error" : err.message || "Error";
  res.status(status).json({ message });
});

mongoose.connect(URI).then(() => {
  console.log("monogoDB connected successfully !")
  app.listen(PORT, () => {
    console.log(`I am running on port ${PORT}`)
  })
}).catch((err) => {
  console.error("Can not connect to mongodb:", err.message)
  process.exit(1)
})
