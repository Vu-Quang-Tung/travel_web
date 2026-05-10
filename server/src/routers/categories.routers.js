const express = require("express");
const router = express.Router();
const controller = require("../controllers/categories.controller");

/* API public để hiển thị danh mục tour */
router.get("/", controller.getCategories);
router.get("/:slug", controller.getCategoryBySlug);

module.exports = router;
