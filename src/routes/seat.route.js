const express = require('express');
const seatController = require('../controller/seat.controller');
const { eventIdValidationForSeats } = require('../validation/seat.validation');
const  {validate}  = require('../../middleware/validation');

const router = express.Router();

router.get('/:eventId', validate(eventIdValidationForSeats), seatController.getSeatsByEvent);

module.exports = router;
