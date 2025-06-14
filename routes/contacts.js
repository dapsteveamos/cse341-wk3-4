const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');
const contactsController = require('../controllers/contacts');  // Assuming you have a contacts controller

// Get all contacts (public)
router.get('/', contactsController.getAll);

// Get a single contact (public)
router.get('/:id', contactsController.getSingle);

// Create a new contact (protected)
router.post('/', isAuthenticated, contactsController.createContact);

// Update a contact (protected)
router.put('/:id', isAuthenticated, contactsController.updateContact);

// Delete a contact (protected)
router.delete('/:id', isAuthenticated, contactsController.deleteContact);

module.exports = router;
