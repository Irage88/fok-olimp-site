const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const notificationsController = require('../controllers/notifications.controller');

router.get('/', authMiddleware, notificationsController.getNotifications);
router.post('/read-all', authMiddleware, notificationsController.markAllAsRead);

module.exports = router;

