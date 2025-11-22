const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking.controller');
const {
  holdSeatsValidation,
  confirmSeatsValidation,
  cancelSeatsValidation,
  getBooking,
} = require('../validation/booking.validation');
const { validate } = require('../../middleware/validation');

// Route for holding seats
router.post(
  '/reserved',
  validate(holdSeatsValidation),
  bookingController.holdSeats
);

// Route for confirming booking
router.post(
  '/confirmed',
  validate(confirmSeatsValidation),
  bookingController.confirmSeats
);

// Route for cancelling booking
router.put(
  '/cancel',
  validate(cancelSeatsValidation),
  bookingController.cancelBooking
);

// Route for fetch booking
router.get('/:id', validate(getBooking), bookingController.getBooking);

module.exports = router;
