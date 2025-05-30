const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    bookedEstates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estate'
    }],
    name: {
        type: String
    },
    email: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);