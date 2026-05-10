const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const uploadMiddleware = require("../middleware/upload.middleware");

/* Upload avatar cho người dùng đã đăng nhập */
router.post("/avatars", authMiddleware, uploadMiddleware.single("avatar"), uploadController.uploadAvatar);

/* Upload ảnh nội dung chỉ dành cho admin */
router.post("/tours", authMiddleware, adminMiddleware, uploadMiddleware.single("image"), uploadController.uploadTourImage);
router.post("/destinations", authMiddleware, adminMiddleware, uploadMiddleware.single("image"), uploadController.uploadDestinationImage);

module.exports = router;
