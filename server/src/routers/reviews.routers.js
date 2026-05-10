const express = require("express");
const router = express.Router();
const controller = require("../controllers/reviews.controller");
const authMiddleware = require("../middleware/auth.middleware");

/* Review gắn với tour và chỉ cho phép user đã đăng nhập thao tác */
router.get("/tour/:tourId", authMiddleware, controller.getReviewsByTour);
router.post("/", authMiddleware, controller.createReview);

module.exports = router;
