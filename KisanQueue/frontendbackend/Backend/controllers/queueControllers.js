const Booking = require("../models/Booking");

// GET /api/queue/:centreId
exports.getCentreQueue = async (req, res) => {
  try {
    const { centreId } = req.params;

    const nowServing = await Booking.findOne({
      centreId,
      status: "PROCESSING",
    }).sort({ position: 1 });

    const waiting = await Booking.find({
      centreId,
      status: "WAITING",
    })
      .sort({ position: 1 })
      .select("token position");

    const processing = await Booking.find({
      centreId,
      status: "PROCESSING",
    })
      .sort({ position: 1 })
      .select("token position");

    res.json({
      success: true,
      data: {
        nowServing: nowServing ? nowServing.token : null,
        processing: processing,
        waiting: waiting,
        totalInQueue: waiting.length + processing.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/queue/farmer/:farmerId
exports.getFarmerPosition = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const booking = await Booking.findOne({
      farmerId,
      status: { $in: ["WAITING", "PROCESSING"] },
    }).sort({ createdAt: -1 });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "No active booking found",
      });
    }

    const farmersAhead = await Booking.countDocuments({
      centreId: booking.centreId,
      position: { $lt: booking.position },
      status: { $in: ["WAITING", "PROCESSING"] },
    });

    res.json({
      success: true,
      data: {
        token: booking.token,
        position: booking.position,
        farmersAhead: farmersAhead,
        status: booking.status,
        bookingId: booking._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/queue/:bookingId/complete
exports.completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "COMPLETED";
    booking.procurementStatus = "COMPLETED";
    await booking.save();

    const waitingBookings = await Booking.find({
      centreId: booking.centreId,
      status: "WAITING",
    }).sort({ position: 1 });

    for (let i = 0; i < waitingBookings.length; i++) {
      waitingBookings[i].position = i + 1;
      await waitingBookings[i].save();
    }

    res.json({
      success: true,
      message: "Booking completed successfully",
      data: {
        completedToken: booking.token,
        remainingInQueue: waitingBookings.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
