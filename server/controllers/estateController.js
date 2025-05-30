// Here are the contents for the file `server/controllers/estateController.js`:

const Estate = require('../models/Estate');

// Create a new estate
exports.createEstate = async (req, res) => {
    try {
        const estate = new Estate(req.body);
        await estate.save();
        res.status(201).json(estate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all estates
exports.getAllEstates = async (req, res) => {
    try {
        const estates = await Estate.find();
        res.status(200).json(estates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single estate by ID
exports.getEstateById = async (req, res) => {
    try {
        const estate = await Estate.findById(req.params.id);
        if (!estate) {
            return res.status(404).json({ message: 'Estate not found' });
        }
        res.status(200).json(estate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an estate by ID
exports.updateEstate = async (req, res) => {
    try {
        const estate = await Estate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!estate) {
            return res.status(404).json({ message: 'Estate not found' });
        }
        res.status(200).json(estate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an estate by ID
exports.deleteEstate = async (req, res) => {
    try {
        const estate = await Estate.findByIdAndDelete(req.params.id);
        if (!estate) {
            return res.status(404).json({ message: 'Estate not found' });
        }
        res.status(200).json({ message: 'Estate deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};