const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.destinations.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

/* Admin quản lý điểm đến */
router.get("/", authMiddleware, adminMiddleware, controller.getDestinationsForAdmin);
router.get("/:id", authMiddleware, adminMiddleware, controller.getDestinationsByIdForAdmin);
router.post("/", authMiddleware, adminMiddleware, controller.createDestination);
router.put("/:id", authMiddleware, adminMiddleware, controller.updateDestination);
router.delete("/:id", authMiddleware, adminMiddleware, controller.deleteDestination);

module.exports = router;
