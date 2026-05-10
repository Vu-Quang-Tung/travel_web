const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.payments.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

/* Admin theo dõi và cập nhật trạng thái thanh toán */
router.get("/", authMiddleware, adminMiddleware, controller.getPaymentsForAdmin);
router.put("/:id/confirm", authMiddleware, adminMiddleware, controller.confirmPayment);
router.put("/:id/fail", authMiddleware, adminMiddleware, controller.failPayment);

module.exports = router;
