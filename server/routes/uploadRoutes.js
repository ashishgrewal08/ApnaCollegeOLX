const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");

// POST /api/upload
// field name: "images"
router.post(
  "/",
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          {
            folder: "apnacollegeolx"
          }
        );
      });

      const results = await Promise.all(uploadPromises);

      const urls = results.map((result) => result.secure_url);

      res.status(200).json({ urls });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Cloudinary upload failed" });
    }
  }
);

module.exports = router;
