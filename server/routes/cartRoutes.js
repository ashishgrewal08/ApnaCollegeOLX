const express = require("express");
const Cart = require("../models/Cart");
const Listing = require("../models/Listing");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get cart
router.get("/", protect, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("items.listing");

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json(cart);
});

// Add to cart
router.post("/add", protect, async (req, res) => {
  const { listingId } = req.body;

  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  // seller apna item cart me nahi daal sakta
  if (listing.seller.toString() === req.user._id.toString()) {
    return res
      .status(400)
      .json({ message: "You cannot add your own listing to cart" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existing = cart.items.find(
    (i) => i.listing.toString() === listingId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({ listing: listingId, quantity: 1 });
  }

  await cart.save();
  res.json(cart);
});


// Remove from cart
router.post("/remove", protect, async (req, res) => {
  const { listingId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  cart.items = cart.items.filter((i) => i.listing.toString() !== listingId);

  await cart.save();
  res.json(cart);
});

module.exports = router;
