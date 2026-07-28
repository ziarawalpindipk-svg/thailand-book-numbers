const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single book by serial
router.get("/:serial", async (req, res) => {
  try {
    const book = await Book.findOne({ serialNumber: req.params.serial });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new book
router.post("/", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update book
router.put("/:serial", async (req, res) => {
  try {
    const updated = await Book.findOneAndUpdate(
      { serialNumber: req.params.serial },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete book
router.delete("/:serial", async (req, res) => {
  try {
    await Book.deleteOne({ serialNumber: req.params.serial });
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
