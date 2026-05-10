const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.tour.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

/* Admin quản lý thông tin chính của tour */
router.get("/", authMiddleware, adminMiddleware, controller.getToursForAdmin);
router.get("/:id", authMiddleware, adminMiddleware, controller.getTourByIdForAdmin);
router.post("/", authMiddleware, adminMiddleware, controller.createTour);
router.put("/:id", authMiddleware, adminMiddleware, controller.updateTour);
router.delete("/:id", authMiddleware, adminMiddleware, controller.deleteTour);

/* Admin quản lý lịch khởi hành, lịch trình và hình ảnh của từng tour */
router.post("/:id/schedules", authMiddleware, adminMiddleware, controller.createSchedule);
router.put("/:id/schedules/:scheduleId", authMiddleware, adminMiddleware, controller.updateSchedule);
router.delete("/:id/schedules/:scheduleId", authMiddleware, adminMiddleware, controller.deleteSchedule);
router.post("/:id/itinerary", authMiddleware, adminMiddleware, controller.createItinerary);
router.put("/:id/itinerary/:itineraryId", authMiddleware, adminMiddleware, controller.updateItinerary);
router.delete("/:id/itinerary/:itineraryId", authMiddleware, adminMiddleware, controller.deleteItinerary);
router.post("/:id/images", authMiddleware, adminMiddleware, controller.createImage);
router.put("/:id/images/:imageId", authMiddleware, adminMiddleware, controller.updateImage);
router.delete("/:id/images/:imageId", authMiddleware, adminMiddleware, controller.deleteImage);

module.exports = router;
