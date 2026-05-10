const express = require("express");
const router = express.Router();
const destinationsController = require("../controllers/destinations.controller");

/* API public để hiển thị điểm đến */
router.get("/", destinationsController.getDestinations);
router.get("/:slug", destinationsController.getDestinationBySlug);

module.exports = router;
