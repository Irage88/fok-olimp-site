const { getDb } = require('../db/db');
const { successResponse, errorResponse } = require('../utils/response');

async function createContact(req, res) {
    const db = getDb();
    
    try {
        const { name, contact, message } = req.body;
        
        // Validation
        if (!name || !contact || !message) {
            return res.status(400).json(errorResponse('Missing required fields: name, contact, message', 400));
        }
        
        if (name.trim().length < 2) {
            return res.status(400).json(errorResponse('Name must be at least 2 characters', 400));
        }
        
        if (message.trim().length < 10) {
            return res.status(400).json(errorResponse('Message must be at least 10 characters', 400));
        }
        
        return new Promise((resolve) => {
            db.run(
                'INSERT INTO contacts (name, contact, message) VALUES (?, ?, ?)',
                [name.trim(), contact.trim(), message.trim()],
                function(err) {
                    if (err) {
                        res.status(500).json(errorResponse('Failed to create contact', 500));
                        resolve();
                        return;
                    }
                    
                    res.status(201).json(successResponse({
                        id: this.lastID,
                        message: 'Contact submitted successfully'
                    }));
                    resolve();
                }
            );
        });
    } catch (error) {
        res.status(500).json(errorResponse('Failed to create contact', 500));
    }
}

module.exports = {
    createContact
};
