const express = require("express");
const router = express.Router();
const controller = require("../controllers/payments.controller");
const authMiddleware = require("../middleware/auth.middleware");

/* Người dùng tạo thanh toán và xem lịch sử thanh toán của mình */
router.post("/", authMiddleware, controller.createPayment);
router.get("/me", authMiddleware, controller.getMyPayments);

module.exports = router;
