const express = require("express");
const router = express.Router();
const News = require("../models/News");
const adminAuth = require("../middleware/adminAuth");

// Public - anyone can read news
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin only - add a news item
router.post("/", adminAuth, async (req, res) => {
  try {
    const newItem = new News(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin only - edit a news item
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "News item not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin only - delete a news item
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
