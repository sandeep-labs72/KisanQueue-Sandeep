const express = require("express");
const router = express.Router();
const { loginFarmer, getFarmer } = require("../controllers/farmerControllers");

// POST /api/farmers/login - Login or register farmer
router.post("/login", loginFarmer);

// GET /api/farmers/:farmerId - Get farmer profile
router.get("/:farmerId", getFarmer);

module.exports = router;
