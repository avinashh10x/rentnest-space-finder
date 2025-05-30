require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const estateRoutes = require('./routes/estate');
const userRoutes = require('./routes/user');
const bookingRoutes = require('./routes/booking');
const { json } = require('body-parser');
const cors = require('cors');
const authController = require('./controllers/authController');



const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: '*', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(json());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('MongoDB connected');
        // Ensure admin account exists
        await authController.ensureAdminAccount();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/estate', estateRoutes);
app.use('/api/user', userRoutes);
app.use('/api/booking', bookingRoutes);

app.get('/', (req, res) => {
    res.send('hello world')
})



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});