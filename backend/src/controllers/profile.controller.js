const { getDb } = require('../db/db');
const { successResponse, errorResponse } = require('../utils/response');
const { validateEmail, validatePhone } = require('../utils/validators');
const { createNotification } = require('../utils/notifications');

async function updateProfile(req, res) {
    const db = getDb();
    const userId = req.user.id;
    const { email, phone } = req.body;
    
    try {
        // Build update query dynamically
        const updates = [];
        const values = [];
        
        if (email !== undefined) {
            if (!validateEmail(email)) {
                return res.status(400).json(errorResponse('Invalid email format', 400));
            }
            updates.push('email = ?');
            values.push(email);
        }
        
        if (phone !== undefined) {
            if (phone && !validatePhone(phone)) {
                return res.status(400).json(errorResponse('Invalid phone format', 400));
            }
            updates.push('phone = ?');
            values.push(phone || null);
        }
        
        if (updates.length === 0) {
            return res.status(400).json(errorResponse('No fields to update', 400));
        }
        
        // Check email uniqueness if email is being updated
        if (email !== undefined) {
            return new Promise((resolve) => {
                db.get(
                    'SELECT id FROM users WHERE email = ? AND id != ?',
                    [email, userId],
                    (err, existingUser) => {
                        if (err) {
                            res.status(500).json(errorResponse('Database error', 500));
                            resolve();
                            return;
                        }
                        
                        if (existingUser) {
                            res.status(409).json(errorResponse('Email already in use', 409));
                            resolve();
                            return;
                        }
                        
                        // Update user
                        values.push(userId);
                        db.run(
                            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                            values,
                            function(err) {
                                if (err) {
                                    res.status(500).json(errorResponse('Failed to update profile', 500));
                                    resolve();
                                    return;
                                }
                                
                                // Create notification for profile update
                                if (email !== undefined) {
                                    createNotification(userId, 'Профиль обновлён', 'Ваш email был успешно обновлён.');
                                } else if (phone !== undefined) {
                                    createNotification(userId, 'Профиль обновлён', 'Ваш телефон был успешно обновлён.');
                                }
                                
                                // Get updated user
                                db.get(
                                    'SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?',
                                    [userId],
                                    (err, user) => {
                                        if (err) {
                                            res.status(500).json(errorResponse('Failed to retrieve user', 500));
                                            resolve();
                                            return;
                                        }
                                        
                                        res.json(successResponse({
                                            id: user.id,
                                            firstName: user.first_name,
                                            lastName: user.last_name,
                                            email: user.email,
                                            phone: user.phone,
                                            createdAt: user.created_at
                                        }));
                                        resolve();
                                    }
                                );
                            }
                        );
                    }
                );
            });
        } else {
            // Update without email check
            values.push(userId);
            return new Promise((resolve) => {
                db.run(
                    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                    values,
                    function(err) {
                        if (err) {
                            res.status(500).json(errorResponse('Failed to update profile', 500));
                            resolve();
                            return;
                        }
                        
                        // Get updated user
                        db.get(
                            'SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?',
                            [userId],
                            (err, user) => {
                                if (err) {
                                    res.status(500).json(errorResponse('Failed to retrieve user', 500));
                                    resolve();
                                    return;
                                }
                                
                                res.json(successResponse({
                                    id: user.id,
                                    firstName: user.first_name,
                                    lastName: user.last_name,
                                    email: user.email,
                                    phone: user.phone,
                                    createdAt: user.created_at
                                }));
                                resolve();
                            }
                        );
                    }
                );
            });
        }
    } catch (error) {
        res.status(500).json(errorResponse('Failed to update profile', 500));
    }
}

module.exports = {
    updateProfile
};
