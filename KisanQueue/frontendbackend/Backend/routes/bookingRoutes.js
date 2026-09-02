const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBooking,
} = require("../controllers/bookingControllers");

// POST /api/bookings - Create booking
router.post("/", createBooking);

// GET /api/bookings/:bookingId - Get single booking
router.get("/:bookingId", getBooking);

module.exports = router;
