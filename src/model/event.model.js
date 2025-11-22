const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  bookingAmount:{
    type:Number,
    required: true,
  },
  status:{
    type: String,
    default:"Active",
    index:true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);

