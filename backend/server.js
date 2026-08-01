const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP
}));

// If the database isn't connected, fail fast with a clear message instead of
// letting requests hang for ~10s on mongoose's buffering timeout. Routes that
// don't touch the database (e.g. WhatsApp link generation) are unaffected.
app.use("/api/books", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected. Set MONGODB_URI in your .env file." });
  }
  next();
});
app.use("/api/users", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected. Set MONGODB_URI in your .env file." });
  }
  next();
});
app.use("/api/offers", (req, res, next) => {
  if (req.path === "/send-whatsapp" || mongoose.connection.readyState === 1) {
    return next();
  }
  return res.status(503).json({ message: "Database not connected. Set MONGODB_URI in your .env file." });
});
app.use("/api/news", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected. Set MONGODB_URI in your .env file." });
  }
  next();
});
app.use("/api/ads", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected. Set MONGODB_URI in your .env file." });
  }
  next();
});

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/users", require("./routes/users"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/news", require("./routes/news"));
app.use("/api/ads", require("./routes/ads"));

app.get("/", (req, res) => {
  res.json({ message: "Thailand Books API is running" });
});

const PORT = process.env.PORT || 5000;

async function start() {
  if (process.env.MONGODB_URI) {
    await connectDB();
  } else {
    console.warn("MONGODB_URI not set - starting server without a database connection");
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();

module.exports = app;
