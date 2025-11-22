const { body, param, query } = require('express-validator');
const moment = require('moment');
// Validation for creating an event
const createEventValidation = [
  body('eventName')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be a string between 1 and 100 characters'),
  body('eventDate')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in yyyy-mm-dd format')
    .custom(value => {
      const inputDate = moment(value, 'YYYY-MM-DD');
      const today = moment().startOf('day');
      if (inputDate.isBefore(today)) {
        throw new Error('Event date must be today or in the future');
      }
      return true;
    }),
  body('location')
    .isString()
    .isLength({ min: 1, max: 200 })
    .withMessage('Location must be a string between 1 and 200 characters'),
  body('totalSeats')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Total seats must be an integer greater than 0'),
  body('bookingAmount')
    .isNumeric()
    .withMessage('Booking price must be a number'),
];

// Validation for event ID
const eventIdValidation = [
  param('id')
    .isString()
    .isLength({ min: 24, max: 24 })
    .isHexadecimal()
    .withMessage('ID must be a valid 24-character hexadecimal string'),
];

// Validation for updating an event
const updateEventValidation = [
  ...eventIdValidation,
  body('eventName')
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be a string between 1 and 100 characters'),
  body('eventDate')
    .optional({ checkFalsy: true })
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in yyyy-mm-dd format'),
  body('location')
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ min: 1, max: 200 })
    .withMessage('Location must be a string between 1 and 200 characters'),
  body('bookingAmount')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Booking price must be a number'),
];

// Validation for pagination
const paginationValidation = [
  query('pageNo').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
];

module.exports = {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  paginationValidation,
};
