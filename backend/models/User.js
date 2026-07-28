const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  whatsapp: String,
  country: String,
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  wishlist: [String],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
