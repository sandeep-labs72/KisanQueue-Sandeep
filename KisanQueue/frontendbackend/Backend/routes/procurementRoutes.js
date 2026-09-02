const express = require("express");
const router = express.Router();
const {
  getProcurementStatus,
  updateProcurementStatus,
  processPayment,
} = require("../controllers/procurementcontroller");

router.get("/:bookingId", getProcurementStatus);
router.put("/:bookingId/status", updateProcurementStatus);
router.post("/payment", processPayment);

module.exports = router;
