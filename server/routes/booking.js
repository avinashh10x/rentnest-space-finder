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

// Admin approves a booking
router.put('/:id/approve', verifyToken, isAdmin, bookingController.approveBooking);

module.exports = router;
