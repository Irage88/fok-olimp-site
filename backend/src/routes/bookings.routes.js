const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, bookingsController.createBooking);
router.get('/me', authMiddleware, bookingsController.getMyBookings);
router.delete('/:id', authMiddleware, bookingsController.deleteBooking);

module.exports = router;
