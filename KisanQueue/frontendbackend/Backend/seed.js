const mongoose = require("mongoose");
require("dotenv").config();

const Farmer = require("./models/farmer");
const Centre = require("./models/Center");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/kisanqueue";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Create test farmer
    const farmer = await Farmer.create({
      name: "Test Farmer",
      mobile: "9876543210",
      farmerId: "F1001",
      village: "Test Village",
      district: "Test District",
    });
    console.log("✅ Farmer created:", farmer.farmerId);

    // Create test centre
    const centre = await Centre.create({
      name: "Test Centre",
      location: "Test Location",
      capacity: 100,
      crops: ["Wheat", "Rice"],
      active: true,
    });
    console.log("✅ Centre created:", centre.name);

    console.log("🎉 Seed data created successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedData();
