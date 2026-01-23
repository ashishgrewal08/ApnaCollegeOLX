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
// app.use(cors({
//   origin: [
//     "http://localhost:5173",              // local frontend
//     "https://apnacollegeolx.vercel.app"   // deployed frontend
//   ],
//   credentials: true
// }));

// Simple CORS: allow all origins (safe for public API), handle preflight
app.use(cors({
  origin: "*",  // Allow all origins
  credentials: false,  // Cannot use credentials with origin: "*"
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());  // Handle preflight for all routes

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ApnaCollegeOLX API running");
});

/* ✅ ROUTES (NO DUPLICATES) */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

/* ⚠️ Optional (local only) */
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
