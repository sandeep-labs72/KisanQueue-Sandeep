const Booking = require("../models/Booking");

// GET /api/procurement/:bookingId
exports.getProcurementStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: {
        bookingId: booking._id,
        token: booking.token,
        procurementStatus: booking.procurementStatus,
        paymentStatus: booking.paymentStatus,
        amount: booking.paymentAmount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/procurement/:bookingId/status
exports.updateProcurementStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "BOOKED",
      "CHECKED_IN",
      "WAITING",
      "PROCESSING",
      "QUALITY_CHECK",
      "WEIGHING",
      "COMPLETED",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid procurement status",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.procurementStatus = status;
    await booking.save();

    res.json({
      success: true,
      message: "Procurement status updated",
      data: {
        bookingId: booking._id,
        token: booking.token,
        procurementStatus: booking.procurementStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/procurement/payment
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and amount are required",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.paymentStatus = "INITIATED";
    booking.paymentAmount = amount;
    await booking.save();

    // Simulate payment after 2 seconds
    setTimeout(async () => {
      try {
        booking.paymentStatus = "CREDITED";
        booking.transactionId = `TXN-${Date.now()}`;
        await booking.save();
        console.log(`✅ Payment credited for ${bookingId}`);
      } catch (err) {
        console.error(`❌ Payment update failed for ${bookingId}:`, err);
      }
    }, 2000);

    res.json({
      success: true,
      message: "Payment initiated",
      data: {
        bookingId: booking._id,
        paymentStatus: booking.paymentStatus,
        amount: booking.paymentAmount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
