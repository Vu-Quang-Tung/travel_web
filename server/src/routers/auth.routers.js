const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/* Route xác thực tài khoản người dùng */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
