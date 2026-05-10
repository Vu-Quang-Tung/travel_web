const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

/* Quản lý thông tin cá nhân của người dùng đang đăng nhập */
router.get("/me", authMiddleware, userController.getMyProfile);
router.put("/me", authMiddleware, userController.updateMyProfile);
router.put("/me/password", authMiddleware, userController.updateMyPassword);

module.exports = router;
