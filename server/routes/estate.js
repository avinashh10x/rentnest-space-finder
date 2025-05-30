const express = require('express');
const router = express.Router();
const estateController = require('../controllers/estateController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a new estate (admin only)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, estateController.createEstate);

// Route to get all estates (public)
router.get('/', estateController.getAllEstates);

// Route to get a specific estate by ID (public)
router.get('/:id', estateController.getEstateById);

// Route to update an estate by ID (admin only)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, estateController.updateEstate);

// Route to delete an estate by ID (admin only)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, estateController.deleteEstate);

module.exports = router;