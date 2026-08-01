const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  linkUrl: String,
  altText: String,
}, { timestamps: true });

module.exports = mongoose.model("Ad", adSchema);
