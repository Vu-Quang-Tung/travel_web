const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.reviews.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

/* Admin kiểm duyệt review trước khi hiển thị */
router.get("/", authMiddleware, adminMiddleware, controller.getReviewsForAdmin);
router.put("/:id/publish", authMiddleware, adminMiddleware, controller.publishReview);
router.put("/:id/hide", authMiddleware, adminMiddleware, controller.hideReview);
router.delete("/:id", authMiddleware, adminMiddleware, controller.deleteReview);

module.exports = router;
