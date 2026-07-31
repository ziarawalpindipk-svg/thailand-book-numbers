const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Simple password-based admin login. No separate "admin user" record is
// needed in the database - the password lives only in the ADMIN_PASSWORD
// environment variable, so it never gets committed to GitHub or exposed
// in the frontend code.
router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;

    if (!process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ message: "Admin login is not configured (ADMIN_PASSWORD missing on the server)." });
    }

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
