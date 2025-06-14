const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Get all contacts
const getAll = async (req, res) => {
    try {
        const db = mongodb.getDatabase(); // Get the database instance
        const result = await db.collection('contacts').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving contacts' });
    }
};

// Get a single contact by ID
const getSingle = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const db = mongodb.getDatabase();
        const result = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving the contact' });
    }
};

// Create a new contact
const createContact = async (req, res) => {
    try {
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday,
        };
        const db = mongodb.getDatabase();
        const response = await db.collection('contacts').insertOne(contact);
        res.status(201).json({ message: 'Contact created successfully', contactId: response.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the contact', error });
    }
};

// Update a contact by ID
const updateContact = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday,
        };
        const db = mongodb.getDatabase();
        const response = await db.collection('contacts').replaceOne({ _id: new ObjectId(id) }, contact);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Contact updated successfully' });
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the contact', error });
    }
};

// Delete a contact by ID
const deleteContact = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const db = mongodb.getDatabase();
        const response = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Contact not found or already deleted' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the contact', error });
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact,
};
