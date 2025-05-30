const Booking = require('../models/Booking');
const User = require('../models/User');
const Estate = require('../models/Estate');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { estateId, startDate, endDate, totalPrice } = req.body;
        const userId = req.userId;
        const estate = await Estate.findById(estateId);
        if (!estate) {
            return res.status(404).json({ message: 'Estate not found' });
        }
        const booking = new Booking({
            user: userId,
            estate: estateId,
            startDate,
            endDate,
            totalPrice,
            status: 'pending' // always pending on creation
        });
        await booking.save();
        // Add booking to user's bookedEstates
        await User.findByIdAndUpdate(userId, { $push: { bookedEstates: estateId } });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin approves a booking
exports.approveBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        booking.status = 'confirmed';
        await booking.save();
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user estate');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get bookings for a user
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.userId;
        const bookings = await Booking.find({ user: userId }).populate('estate');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
