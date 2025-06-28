const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// User creates a booking
router.post('/', verifyToken, bookingController.createBooking);

// Admin gets all bookings
router.get('/', verifyToken, isAdmin, bookingController.getAllBookings);

// User gets their bookings
router.get('/my', verifyToken, bookingController.getUserBookings);

// Check estate availability
router.get('/availability/:estateId', bookingController.checkAvailability);

// Get booked dates for an estate
router.get('/booked-dates/:estateId', bookingController.getBookedDates);

// Admin approves a booking
router.put('/:id/approve', verifyToken, isAdmin, bookingController.approveBooking);

// Cancel a booking (user or admin)
router.put('/:id/cancel', verifyToken, bookingController.cancelBooking);

module.exports = router;
