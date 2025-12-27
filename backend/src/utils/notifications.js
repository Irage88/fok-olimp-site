const { getDb } = require('../db/db');

/**
 * Create a notification for a user
 * @param {number} userId - User ID
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 */
function createNotification(userId, title, message) {
    const db = getDb();
    
    db.run(
        'INSERT INTO notifications (user_id, title, message, is_read) VALUES (?, ?, ?, 0)',
        [userId, title, message],
        (err) => {
            if (err) {
                console.error('Error creating notification:', err);
            }
        }
    );
}

module.exports = { createNotification };

