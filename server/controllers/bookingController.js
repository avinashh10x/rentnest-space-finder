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

        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
            estate: estateId,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                {
                    startDate: { $lte: new Date(endDate) },
                    endDate: { $gte: new Date(startDate) }
                }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({ message: 'Property is already booked for selected dates' });
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

        // Populate the booking with estate and user details before returning
        const populatedBooking = await Booking.findById(booking._id).populate('user estate');

        res.status(201).json(populatedBooking);
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

        // Add booked dates to the estate
        await Estate.findByIdAndUpdate(booking.estate, {
            $push: {
                bookedDates: {
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    bookingId: booking._id
                }
            }
        });

        // Populate the booking before returning
        const populatedBooking = await Booking.findById(booking._id).populate('user estate');

        res.status(200).json(populatedBooking);
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

// Cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = 'cancelled';
        await booking.save();

        // Remove booked dates from the estate
        await Estate.findByIdAndUpdate(booking.estate, {
            $pull: {
                bookedDates: { bookingId: booking._id }
            }
        });

        // Populate the booking before returning
        const populatedBooking = await Booking.findById(booking._id).populate('user estate');

        res.status(200).json(populatedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check estate availability for given dates
exports.checkAvailability = async (req, res) => {
    try {
        const { estateId } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const conflictingBooking = await Booking.findOne({
            estate: estateId,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                {
                    startDate: { $lte: new Date(endDate) },
                    endDate: { $gte: new Date(startDate) }
                }
            ]
        });

        const isAvailable = !conflictingBooking;

        res.status(200).json({
            isAvailable,
            message: isAvailable ? 'Property is available' : 'Property is not available for selected dates'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
