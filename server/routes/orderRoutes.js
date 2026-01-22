const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Listing = require("../models/Listing");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { sendOrderEmail } = require("../utils/mailer");

const router = express.Router();

/**
 * POST /api/orders/single
 * Buy Now -> single listing se order + email to seller
 */
router.post("/single", protect, async (req, res) => {
  try {
    const { listingId, quantity = 1 } = req.body;

    const listing = await Listing.findById(listingId).populate("seller");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const totalAmount = listing.price * quantity;

    const order = await Order.create({
      user: req.user._id,
      items: [
        {
          listing: listing._id,
          quantity,
          price: listing.price,
        },
      ],
      totalAmount,
    });

    const buyer = await User.findById(req.user._id);

    await sendOrderEmail({
      sellerEmail: listing.seller?.email,
      sellerName: listing.seller?.name,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      productTitle: listing.title,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Place single order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/orders/from-cart
 * Cart -> multiple listings order + har seller ko email
 */
router.post("/from-cart", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.listing",
      populate: { path: "seller" },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      listing: item.listing._id,
      quantity: item.quantity,
      price: item.listing.price,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
    });

    const buyer = await User.findById(req.user._id);

    // har item ke seller ko mail
    const emailPromises = cart.items.map((item) => {
      const listing = item.listing;
      const seller = listing.seller;

      if (!seller || !seller.email) return Promise.resolve();

      return sendOrderEmail({
        sellerEmail: seller.email,
        sellerName: seller.name,
        buyerName: buyer.name,
        buyerEmail: buyer.email,
        productTitle: listing.title,
      });
    });

    await Promise.all(emailPromises);

    // empty cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Place order from cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/orders/my
 * Logged-in user ke saare orders
 */
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.listing")
    .sort({ createdAt: -1 });

  res.json(orders);
});

/**
 * GET /api/orders/:id
 * Ek specific order ka detail (for Order confirmed page)
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.listing");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


