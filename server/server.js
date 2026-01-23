const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

/* ✅ CORS — YAHIN, ROUTES SE PEHLE */
app.use(cors({
  origin: [
    "http://localhost:5173",              // local frontend
    "https://apnacollegeolx.vercel.app"   // deployed frontend
  ],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ApnaCollegeOLX API running");
});

/* ✅ ROUTES (NO DUPLICATES) */
app.use("/auth", require("./routes/authRoutes"));
app.use("/listings", require("./routes/listingRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/orders", require("./routes/orderRoutes"));

/* ⚠️ Optional (local only) */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
