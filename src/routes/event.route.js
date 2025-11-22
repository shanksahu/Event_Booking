const express = require('express');
const eventController = require('../controller/event.controller');
const { validate } = require('../../middleware/validation');
const { createEventValidation,paginationValidation, updateEventValidation, eventIdValidation } = require('../validation/event.validation');

const router = express.Router();

// CRUD routes for events
router.post('/', validate(createEventValidation), eventController.createEvent);
router.get('/', validate(paginationValidation),eventController.getAllEvents);
router.get('/:id', validate(eventIdValidation), eventController.getEventById);
router.put('/:id', validate(updateEventValidation), eventController.updateEvent);
router.delete('/:id', validate(eventIdValidation), eventController.deleteEvent);

module.exports = router;
