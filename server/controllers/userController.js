// server/controllers/userController.js

const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('bookedEstates');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ ...user._doc, role: user.role }); // Include role in the response
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user bookings
const getUserBookings = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('bookedEstates');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.bookedEstates);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserBookings,
};