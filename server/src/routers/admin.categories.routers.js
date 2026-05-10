const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.categories.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

/* Admin quản lý danh mục tour */
router.get("/", authMiddleware, adminMiddleware, controller.getCategoriesForAdmin);
router.post("/", authMiddleware, adminMiddleware, controller.createCategory);
router.put("/:id", authMiddleware, adminMiddleware, controller.updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, controller.deleteCategory);

module.exports = router;
