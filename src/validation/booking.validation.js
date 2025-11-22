const { body, param} = require('express-validator');


const eventId = [
body('eventId')
    .isString()
    .isLength({ min: 24, max: 24 })
    .isHexadecimal()
    .withMessage('Each eventId must be a valid 24-character hexadecimal string'),
]
// Validation for holding seats
const holdSeatsValidation = [
  ...eventId,
  body('seatIds')
    .isArray({ min: 1, max:5 })
    .withMessage('seat must not be empty and max 5 seats allowed to book'),
  body('seatIds.*')
    .isString()
    .isLength({ min: 24, max: 24 })
    .isHexadecimal()
    .withMessage('Each seatId must be a valid 24-character hexadecimal string')
];

// Validation for confirming seats
const confirmSeatsValidation = [
  body('holdId')
    .isString()
    .isLength({ min: 24, max: 24 })
    .isHexadecimal()
    .withMessage('Each holdId must be a valid 24-character hexadecimal string'),
];

// Validation for confirming seats
const getBooking = [
  param('id')
    .isString()
    .isLength({ min: 24, max: 24 })
    .isHexadecimal()
    .withMessage('Each holdId must be a valid 24-character hexadecimal string'),
];

// Validation for cancelling seats
const cancelSeatsValidation = [
  body('bookingId')
    .isString()
    .isLength({ min: 24, max: 24 })
    .isHexadecimal()
    .withMessage('Each bookingId must be a valid 24-character hexadecimal string'),
]

module.exports = {
  holdSeatsValidation,
  confirmSeatsValidation,
  cancelSeatsValidation,
  getBooking
};
