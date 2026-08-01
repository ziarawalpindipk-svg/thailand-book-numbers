const express = require("express");
const router = express.Router();
const Ad = require("../models/Ad");
const adminAuth = require("../middleware/adminAuth");

// Public - anyone can see the ad cards
router.get("/", async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin only - add an ad card
router.post("/", adminAuth, async (req, res) => {
  try {
    const newAd = new Ad(req.body);
    await newAd.save();
    res.json(newAd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin only - delete an ad card
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: "Ad deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
