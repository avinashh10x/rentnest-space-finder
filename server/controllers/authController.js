// server/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { email, password, role, name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: email, // always set username to email
            email,
            name,
            password: hashedPassword,
            role: role || 'user'
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error });

    }
};

// Utility: Ensure admin account exists
exports.ensureAdminAccount = async () => {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
    const adminName = "Admin";
    try {
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin = new User({
                username: adminEmail,
                email: adminEmail,
                name: adminName,
                password: hashedPassword,
                role: "admin"
            });
            await admin.save();
            console.log("Admin account created:", adminEmail);
        } else if (admin.role !== "admin") {
            admin.role = "admin";
            await admin.save();
            console.log("Admin account role updated:", adminEmail);
        }
    } catch (error) {
        console.error("Error ensuring admin account:", error);
    }
};



