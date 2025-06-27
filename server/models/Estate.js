const mongoose = require('mongoose');

const estateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Not all estates must have an owner (admin upload)
    },
    images: [{
        type: String
    }],
    features: [{
        type: String
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    bookedDates: [{
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }
    }],
    location: {
        type: String
    },
    type: {
        type: String,
        enum: ['apartment', 'house', 'commercial'],
        default: 'apartment'
    },
    size: {
        type: Number
    },
    bedrooms: {
        type: Number
    },
    bathrooms: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Estate = mongoose.model('Estate', estateSchema);

module.exports = Estate;