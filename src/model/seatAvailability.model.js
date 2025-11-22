const mongoose = require('mongoose');
const { statusEnums, status } = require('../../enums/constants.enums');

const seatAvailabilitySchema = new mongoose.Schema(
  {
    seatNumber: {
      type: Number,
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    bookedDateAndTime: {
      type: Date,
      default: null,
    },
    holdId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    holdExpireTime: {
      type: Date,
      default: null,
    },
    isHold: {
      type: Boolean,
      default: false,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enums: statusEnums,
      default: status.AVAILABLE,
    },
    bookedByUser: {
      type: String,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

seatAvailabilitySchema.index({ eventId: 1, holdId: 1 });

module.exports = mongoose.model('SeatAvailability', seatAvailabilitySchema);
