const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const getCycleDate = require("../utils/dateCycle");
const sanitizePhone = require("../utils/sanitizePhone");
const adminAuth = require("../middleware/adminAuth");

// Get all offers - admin only, this contains customer names/numbers so it
// must not be publicly readable.
router.get("/", adminAuth, async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit new offer (with minimum-amount validation + auto cycle date)
router.post("/", async (req, res) => {
  try {
    const books = req.body.books || [];
    for (let b of books) {
      if (b.pricePerBook < 1) {
        return res.status(400).json({ message: "Offer amount cannot be below 1" });
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

// Update offer status (accept/reject) - admin only
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Offer not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete offer - admin only
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate WhatsApp message link for an offer.
// IMPORTANT: the link should open a chat TO the site owner's WhatsApp
// number (ownerWhatsapp), pre-filled with the offer details, so the
// customer can tap Send and the owner receives it. The customer's own
// WhatsApp number (whatsapp) is only included inside the message text as
// their contact info - it is never used as the link's destination.
router.post("/send-whatsapp", async (req, res) => {
  try {
    const { customerName, country, whatsapp, ownerWhatsapp, books = [], totalAmount, currency, cycleDate } = req.body;

    const cleanOwnerNumber = sanitizePhone(ownerWhatsapp);

    if (!cleanOwnerNumber) {
      return res.status(400).json({ message: "ownerWhatsapp (the site owner's number) is required" });
    }

    const currencyLabel = currency || "USD";

    let message = `THAILAND BOOK NUMBERS / OVERSEAS\nORDER OFFER\n-----------------------------\n`;
    message += `Cycle Date: ${cycleDate}\nCustomer: ${customerName}\nCountry: ${country}\nCustomer WhatsApp: ${whatsapp}\n\nSelected Books:\n`;

    books.forEach((b) => {
      message += `#${b.serial} x ${b.quantity} = ${b.total} ${currencyLabel}\n`;
    });

    message += `-----------------------------\nTotal Offer: ${totalAmount} ${currencyLabel}\n`;

    const waLink = `https://wa.me/${cleanOwnerNumber}?text=${encodeURIComponent(message)}`;
    res.json({ waLink });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
