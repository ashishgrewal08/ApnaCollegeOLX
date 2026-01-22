const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Books", "Electronics", "Hostel Items", "Cycle", "Other"],
      default: "Other"
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Average"],
      default: "Good"
    },
    images: [{ type: String }],   // for now URLs / base64 strings
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    //isSold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
