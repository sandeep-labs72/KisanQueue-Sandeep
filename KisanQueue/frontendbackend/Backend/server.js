const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// IMPORTANT: Allow frontend to connect
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "KisanQueue API is running!" });
});

// IMPORTANT: Connect your routes
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/queue", require("./routes/queueRoutes"));
app.use("/api/procurement", require("./routes/procurementRoutes"));

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kisanqueue";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    console.log("⚠️  Make sure you have MongoDB Atlas set up");
    console.log("⚠️  Add your connection string in .env file");
  });
