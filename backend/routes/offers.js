const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const getCycleDate = require("../utils/dateCycle");

// Get all offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit new offer (with min $1 validation + auto cycle date)
router.post("/", async (req, res) => {
  try {
    const books = req.body.books || [];
    for (let b of books) {
      if (b.pricePerBook < 1) {
        return res.status(400).json({ message: "Price cannot be below $1" });
      }
    }

    req.body.cycleDate = getCycleDate();
    const newOffer = new Offer(req.body);
    await newOffer.save();
    res.json(newOffer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update offer status (accept/reject)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Offer not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete offer
router.delete("/:id", async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate WhatsApp message link for an offer
router.post("/send-whatsapp", async (req, res) => {
  try {
    const { customerName, country, whatsapp, books = [], totalAmount, cycleDate } = req.body;

    let message = `THAILAND BOOK NUMBERS / OVERSEAS\nORDER OFFER\n-----------------------------\n`;
    message += `Cycle Date: ${cycleDate}\nCustomer: ${customerName}\nCountry: ${country}\nWhatsApp: ${whatsapp}\n\nSelected Books:\n`;

    books.forEach((b) => {
      message += `#${b.serial} x ${b.quantity} = $${b.total}\n`;
    });

    message += `-----------------------------\nTotal Offer: $${totalAmount} USD\n`;

    const waLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    res.json({ waLink });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
