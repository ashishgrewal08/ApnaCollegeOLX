const express = require("express");
const Listing = require("../models/Listing");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/listings -> all listings + optional category search
router.get("/", async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (q) filter.title = { $regex: q, $options: "i" };

    const listings = await Listing.find(filter)
      .populate("seller", "name collegeName email")
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    console.error("Get listings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/listings/my -> listings of current logged user
router.get("/my", protect, async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({
      createdAt: -1
    });
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/listings/:id
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "seller",
      "name collegeName email"
    );
    if (!listing) return res.status(404).json({ message: "Not found" });
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/listings  (protected)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, price, category, condition, images } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price required" });
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      category,
      condition,
      images: images || [],
      seller: req.user._id
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error("Create listing error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/listings/:id  (protected + owner only)
router.put("/:id", protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Not found" });

  if (listing.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not your listing" });
  }

  Object.assign(listing, req.body);
  await listing.save();

  // ✅ ab seller populate karke bhejo, taki frontend me seller object rahe
  const updated = await Listing.findById(listing._id).populate(
    "seller",
    "name email collegeName"
  );

  res.json(updated);
  } catch (err) {
    console.error("Update listing error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/listings/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Not found" });
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your listing" });
    }

    await listing.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete listing error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
