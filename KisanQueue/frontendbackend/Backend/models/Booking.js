const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    farmerId: {
      type: String,
      required: true,
    },
    centreId: {
      type: String,
      required: true,
    },
    crop: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    date: {
      type: Date,
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["BOOKED", "WAITING", "PROCESSING", "COMPLETED", "CANCELLED"],
      default: "WAITING",
    },
    procurementStatus: {
      type: String,
      enum: [
        "BOOKED",
        "CHECKED_IN",
        "WAITING",
        "PROCESSING",
        "QUALITY_CHECK",
        "WEIGHING",
        "COMPLETED",
      ],
      default: "BOOKED",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "INITIATED", "CREDITED", "FAILED"],
      default: "PENDING",
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Booking", BookingSchema);
