const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'https://apnacollegeolx-frontend.onrender.com', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));
  

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ApnaCollegeOLX API running");
});


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
