const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  customerName: String,
  country: String,
  email: String,
  whatsapp: String,
  cycleDate: String,
  books: [
    { serial: String, quantity: Number, pricePerBook: Number, total: Number }
  ],
  totalAmount: Number,
  currency: { type: String, default: "USD" },
  notes: String,
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  paymentLink: String,
  paymentStatus: { type: String, enum: ["unpaid", "paid", "failed"], default: "unpaid" }
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);
