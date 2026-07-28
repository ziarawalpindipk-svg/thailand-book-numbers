const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  title: String,
  author: String,
  coverImage: String,
  description: String,
  status: { type: String, enum: ["available", "pending", "sold"], default: "available" },
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
