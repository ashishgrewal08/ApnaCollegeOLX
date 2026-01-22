const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true } // price at time of order
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "Cancelled", "Completed"],
      default: "Placed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
