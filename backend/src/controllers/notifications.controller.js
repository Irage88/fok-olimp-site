const { getDb } = require('../db/db');
const { successResponse, errorResponse } = require('../utils/response');

async function getNotifications(req, res) {
    const db = getDb();
    const userId = req.user.id;
    
    try {
        return new Promise((resolve) => {
            db.all(
                'SELECT id, title, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
                [userId],
                (err, notifications) => {
                    if (err) {
                        res.status(500).json(errorResponse('Failed to fetch notifications', 500));
                        resolve();
                        return;
                    }
                    
                    const transformedNotifications = notifications.map(notification => ({
                        id: notification.id,
                        title: notification.title,
                        message: notification.message,
                        isRead: notification.is_read === 1,
                        createdAt: notification.created_at
                    }));
                    
                    res.json(successResponse(transformedNotifications));
                    resolve();
                }
            );
        });
    } catch (error) {
        res.status(500).json(errorResponse('Failed to fetch notifications', 500));
    }
}

async function markAllAsRead(req, res) {
    const db = getDb();
    const userId = req.user.id;
    
    try {
        return new Promise((resolve) => {
            db.run(
                'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
                [userId],
                function(err) {
                    if (err) {
                        res.status(500).json(errorResponse('Failed to mark notifications as read', 500));
                        resolve();
                        return;
                    }
                    
                    res.json(successResponse({ message: 'All notifications marked as read', count: this.changes }));
                    resolve();
                }
            );
        });
    } catch (error) {
        res.status(500).json(errorResponse('Failed to mark notifications as read', 500));
    }
}

module.exports = {
    getNotifications,
    markAllAsRead
};

