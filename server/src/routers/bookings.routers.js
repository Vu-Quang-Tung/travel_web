const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const authMiddleware = require('../middleware/auth.middleware');

/* Người dùng đã đăng nhập mới được tạo và xem booking của mình */
router.post('/', authMiddleware, bookingsController.createBooking);
router.get('/me', authMiddleware, bookingsController.getMyBookings);
router.get('/:bookingCode', authMiddleware, bookingsController.getMyBookingDetails);

module.exports = router;
