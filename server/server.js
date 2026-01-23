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

// Robust CORS: allow known origins and reflect origin for deployed frontends
const allowedOrigins = [
  "http://localhost:5173",
  "https://apnacollegeolx-frontend.onrender.com",
  // include a possible variant used during testing/deployments
  "https://apnacollegeolx-frontend.onrenderer.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // if origin is in allowed list allow it, otherwise reflect origin (use carefully)
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // fallback: reflect the requesting origin so browser receives Access-Control-Allow-Origin
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Ensure preflight requests are handled
app.options("*", cors({ credentials: true, origin: true }));

// Explicit fallback: echo Origin and handle OPTIONS preflight (helps when proxies strip headers)
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

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
