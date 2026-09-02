const express = require("express");
const router = express.Router();
const {
  getCentreQueue,
  getFarmerPosition,
  completeBooking,
} = require("../controllers/queueControllers");

// GET /api/queue/farmer/:farmerId - Get farmer's queue status and position
router.get("/farmer/:farmerId", getFarmerPosition);

// GET /api/queue/:centreId - Get centre queue status
router.get("/:centreId", getCentreQueue);

// PUT /api/queue/:bookingId/complete - Complete a booking and advance queue
router.put("/:bookingId/complete", completeBooking);

module.exports = router;
