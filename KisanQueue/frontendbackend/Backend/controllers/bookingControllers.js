const Booking = require("../models/Booking");

// Generate token
const generateToken = async (centreId) => {
  const count = await Booking.countDocuments({ centreId });
  const tokenNumber = String(count + 1).padStart(3, "0");
  return `A-${tokenNumber}`;
};

// Calculate position
const calculatePosition = async (centreId) => {
  const count = await Booking.countDocuments({
    centreId,
    status: { $in: ["WAITING", "PROCESSING"] },
  });
  return count + 1;
};

// POST /api/bookings - Create booking
exports.createBooking = async (req, res) => {
  try {
    const { farmerId, centreId, crop, quantity, date, slot } = req.body;

    if (!farmerId || !centreId || !crop || !quantity || !date || !slot) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const token = await generateToken(centreId);
    const position = await calculatePosition(centreId);

    const booking = new Booking({
      farmerId,
      centreId,
      crop,
      quantity,
      date: new Date(date),
      slot,
      token,
      position,
      status: "WAITING",
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        bookingId: booking._id,
        token: booking.token,
        position: booking.position,
        status: booking.status,
        procurementStatus: booking.procurementStatus,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// GET /api/bookings/:bookingId
exports.getBooking = async (req, res) => {
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
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
