const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getNotifications, markAllAsRead } = require('../controllers/notifications.controller');

router.get('/', authenticate, getNotifications);
router.post('/read-all', authenticate, markAllAsRead);

module.exports = router;

