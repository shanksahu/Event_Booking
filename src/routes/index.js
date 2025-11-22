const express = require('express');
const eventRoutes = require('./event.route');
const seatRoutes = require('./seat.route');
const bookingRoutes = require('./booking.route');

const router = express.Router();

// Connect /event route with eventRoutes
router.use('/event', eventRoutes);

// Connect /seat route with seatRoutes
router.use('/seat', seatRoutes);

// Connect /booking route with bookingRoutes
router.use('/booking', bookingRoutes);

module.exports = router;
