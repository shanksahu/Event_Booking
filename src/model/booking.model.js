const mongoose = require('mongoose');
const { statusEnums, status } = require('../../enums/constants.enums');

const bookingSchema = new mongoose.Schema({
  seatIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SeatAvailability',
    required: true
  }],
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  holdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SeatAvailability',
    default:null
  },
  isBooked:{
    type:Boolean,
    default:false
  },
  isCanceled:{
    type:Boolean,
    default:false
  },
  bookingDate:{
    type:Date,
  },
  bookingStatus: {
    type: String,
    enum:statusEnums,
    default:status.PENDING,
    required: true
  },
  amount: {
    type: Number,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
