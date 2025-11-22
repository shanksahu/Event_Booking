const { param, query } = require('express-validator');



// Validation for pagination
const paginationValidation = [
  query('pageNo')
    .optional()
    .isInt({ min: 1 }),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }),
];

// Validation for event ID in seat routes
const eventIdValidationForSeats = [
    ...paginationValidation,
  param('eventId')
    .isString()
    .isLength({ min: 24, max: 24 })
    .isHexadecimal()
    .withMessage('Event ID must be a valid 24-character hexadecimal string')
];

module.exports = {
  eventIdValidationForSeats
};
