const { getDb } = require('../db/db');
const { successResponse, errorResponse } = require('../utils/response');
const { validateDate, validateTime } = require('../utils/validators');
const { createNotification } = require('../utils/notifications');

async function createBooking(req, res) {
    const db = getDb();
    const userId = req.user.id;
    
    try {
        const { serviceId, serviceTitle, date, time } = req.body;
        
        // Validation
        if (!serviceTitle || !date || !time) {
            return res.status(400).json(errorResponse('Missing required fields: serviceTitle, date, time', 400));
        }
        
        if (!validateDate(date)) {
            return res.status(400).json(errorResponse('Invalid date format. Expected DD.MM.YY', 400));
        }
        
        if (!validateTime(time)) {
            return res.status(400).json(errorResponse('Invalid time format. Expected HH:MM', 400));
        }
        
        return new Promise((resolve) => {
            db.run(
                'INSERT INTO bookings (user_id, service_id, service_title, date, time, status) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, serviceId || null, serviceTitle, date, time, 'pending'],
                function(err) {
                    if (err) {
                        res.status(500).json(errorResponse('Failed to create booking', 500));
                        resolve();
                        return;
                    }
                    
                    const bookingId = this.lastID;
                    
                    // Create notification for booking
                    createNotification(userId, 'Бронирование создано', `Ваше бронирование "${serviceTitle}" на ${date} в ${time} успешно создано.`);
                    
                    // Get created booking
                    db.get(
                        'SELECT * FROM bookings WHERE id = ?',
                        [bookingId],
                        (err, booking) => {
                            if (err) {
                                res.status(500).json(errorResponse('Failed to retrieve booking', 500));
                                resolve();
                                return;
                            }
                            
                            res.status(201).json(successResponse({
                                id: booking.id,
                                userId: booking.user_id,
                                serviceId: booking.service_id,
                                serviceTitle: booking.service_title,
                                date: booking.date,
                                time: booking.time,
                                status: booking.status,
                                createdAt: booking.created_at
                            }));
                            resolve();
                        }
                    );
                }
            );
        });
    } catch (error) {
        res.status(500).json(errorResponse('Failed to create booking', 500));
    }
}

async function getMyBookings(req, res) {
    const db = getDb();
    const userId = req.user.id;
    
    try {
        return new Promise((resolve) => {
            db.all(
                'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
                [userId],
                (err, bookings) => {
                    if (err) {
                        res.status(500).json(errorResponse('Failed to fetch bookings', 500));
                        resolve();
                        return;
                    }
                    
                    const transformedBookings = bookings.map(booking => ({
                        id: booking.id,
                        userId: booking.user_id,
                        serviceId: booking.service_id,
                        serviceTitle: booking.service_title,
                        date: booking.date,
                        time: booking.time,
                        status: booking.status,
                        createdAt: booking.created_at
                    }));
                    
                    res.json(successResponse(transformedBookings));
                    resolve();
                }
            );
        });
    } catch (error) {
        res.status(500).json(errorResponse('Failed to fetch bookings', 500));
    }
}

async function deleteBooking(req, res) {
    const db = getDb();
    const userId = req.user.id;
    const { id } = req.params;
    
    try {
        return new Promise((resolve) => {
            // First verify the booking belongs to the user
            db.get(
                'SELECT id FROM bookings WHERE id = ? AND user_id = ?',
                [id, userId],
                (err, booking) => {
                    if (err) {
                        res.status(500).json(errorResponse('Database error', 500));
                        resolve();
                        return;
                    }
                    
                    if (!booking) {
                        res.status(404).json(errorResponse('Booking not found', 404));
                        resolve();
                        return;
                    }
                    
                    // Delete booking
                    db.run(
                        'DELETE FROM bookings WHERE id = ? AND user_id = ?',
                        [id, userId],
                        function(err) {
                            if (err) {
                                res.status(500).json(errorResponse('Failed to delete booking', 500));
                                resolve();
                                return;
                            }
                            
                            res.json(successResponse({ message: 'Booking deleted successfully' }));
                            resolve();
                        }
                    );
                }
            );
        });
    } catch (error) {
        res.status(500).json(errorResponse('Failed to delete booking', 500));
    }
}

module.exports = {
    createBooking,
    getMyBookings,
    deleteBooking
};
