const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/db');
const { ValidationError, UnauthorizedError, ConflictError } = require('../utils/errors');
const { successResponse, errorResponse } = require('../utils/response');
const { validateEmail, validatePassword } = require('../utils/validators');
const { createNotification } = require('../utils/notifications');

async function register(req, res) {
    const db = getDb();
    
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        
        // Validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json(errorResponse('Missing required fields', 400));
        }
        
        if (!validateEmail(email)) {
            return res.status(400).json(errorResponse('Invalid email format', 400));
        }
        
        if (!validatePassword(password)) {
            return res.status(400).json(errorResponse('Password must be at least 8 characters and contain at least 1 digit', 400));
        }
        
        // Check if user exists
        return new Promise((resolve) => {
            db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
                if (err) {
                    console.error('REGISTER DB ERROR (check existing user):', err);
                    res.status(500).json(errorResponse(
                        process.env.NODE_ENV === 'development' ? err.message : 'Database error',
                        500
                    ));
                    resolve();
                    return;
                }
                
                if (existingUser) {
                    res.status(409).json(errorResponse('Email already registered', 409));
                    resolve();
                    return;
                }
                
                // Hash password
                const passwordHash = await bcrypt.hash(password, 10);
                
                // Insert user
                db.run(
                    'INSERT INTO users (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)',
                    [firstName, lastName, email, phone || null, passwordHash],
                    function(err) {
                        if (err) {
                            console.error('REGISTER DB ERROR (insert user):', err);
                            res.status(500).json(errorResponse(
                                process.env.NODE_ENV === 'development' ? err.message : 'Failed to create user',
                                500
                            ));
                            resolve();
                            return;
                        }
                        
                        const userId = this.lastID;
                        
                        // Create welcome notification
                        createNotification(userId, 'Добро пожаловать', `Добро пожаловать в ФОК "Олимп", ${firstName}! Ваш аккаунт успешно создан.`);
                        
                        // Generate token
                        const token = jwt.sign(
                            { id: userId, email },
                            process.env.JWT_SECRET,
                            { expiresIn: '7d' }
                        );
                        
                        // Get created user (without password)
                        db.get(
                            'SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?',
                            [userId],
                            (err, user) => {
                                if (err) {
                                    console.error('REGISTER DB ERROR (retrieve user):', err);
                                    res.status(500).json(errorResponse(
                                        process.env.NODE_ENV === 'development' ? err.message : 'Failed to retrieve user',
                                        500
                                    ));
                                    resolve();
                                    return;
                                }
                                
                                res.status(201).json(successResponse({
                                    token,
                                    user: {
                                        id: user.id,
                                        firstName: user.first_name,
                                        lastName: user.last_name,
                                        email: user.email,
                                        phone: user.phone,
                                        createdAt: user.created_at
                                    }
                                }));
                                resolve();
                            }
                        );
                    }
                );
            });
        });
    } catch (error) {
        console.error('REGISTER DB ERROR (catch):', error);
        res.status(500).json(errorResponse(
            process.env.NODE_ENV === 'development' ? error.message : 'Registration failed',
            500
        ));
    }
}

async function login(req, res) {
    const db = getDb();
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json(errorResponse('Email and password are required', 400));
        }
        
        return new Promise((resolve) => {
            // Find user
            db.get(
                'SELECT id, first_name, last_name, email, phone, password_hash FROM users WHERE email = ?',
                [email],
                async (err, user) => {
                    if (err) {
                        res.status(500).json(errorResponse('Database error', 500));
                        resolve();
                        return;
                    }
                    
                    if (!user) {
                        res.status(401).json(errorResponse('Invalid email or password', 401));
                        resolve();
                        return;
                    }
                    
                    // Check password
                    const isValidPassword = await bcrypt.compare(password, user.password_hash);
                    
                    if (!isValidPassword) {
                        res.status(401).json(errorResponse('Invalid email or password', 401));
                        resolve();
                        return;
                    }
                    
                    // Generate token
                    const token = jwt.sign(
                        { id: user.id, email: user.email },
                        process.env.JWT_SECRET,
                        { expiresIn: '7d' }
                    );
                    
                    res.json(successResponse({
                        token,
                        user: {
                            id: user.id,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            email: user.email,
                            phone: user.phone
                        }
                    }));
                    resolve();
                }
            );
        });
    } catch (error) {
        res.status(500).json(errorResponse('Login failed', 500));
    }
}

async function getMe(req, res) {
    const db = getDb();
    const userId = req.user.id;
    
    try {
        return new Promise((resolve) => {
            db.get(
                'SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?',
                [userId],
                (err, user) => {
                    if (err) {
                        res.status(500).json(errorResponse('Database error', 500));
                        resolve();
                        return;
                    }
                    
                    if (!user) {
                        res.status(404).json(errorResponse('User not found', 404));
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
        });
    } catch (error) {
        res.status(500).json(errorResponse('Failed to get user', 500));
    }
}

module.exports = {
    register,
    login,
    getMe
};
