const express = require("express");
const router = express.Router();
const toursController = require("../controllers/tours.controller");

/* API public để lấy danh sách tour và chi tiết theo slug */
router.get("/", toursController.getTours);
router.get("/:slug", toursController.getTourBySlug);

module.exports = router;
