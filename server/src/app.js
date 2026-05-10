const express = require("express");
const cors = require("cors");
const path = require("path");
const authRouter = require("./routers/auth.routers");
const bookingsRouter = require("./routers/bookings.routers");
const toursRouter = require("./routers/tours.routers");
const destinationsRouter = require("./routers/destinations.routers");
const uploadRouter = require("./routers/upload.routers");
const userRouter = require("./routers/user.routers");
const categoriesRouter = require("./routers/categories.routers");
const reviewsRouter = require("./routers/reviews.routers");
const paymentsRouter = require("./routers/payments.routers");
const adminToursRouter = require("./routers/admin.tours.routers");
const adminDestinationsRouter = require("./routers/admin.destinations.routers");
const adminCategoriesRouter = require("./routers/admin.categories.routers");
const adminReviewsRouter = require("./routers/admin.reviews.routers");
const adminPaymentsRouter = require("./routers/admin.payments.routers");

const app = express();

/* Middleware dùng chung cho toàn bộ API */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* Health check đơn giản để kiểm tra backend đang chạy */
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

/* Nhóm route public và route cần đăng nhập phía người dùng */
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/tours", toursRouter);
app.use("/api/destinations", destinationsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/payments", paymentsRouter);

/* Nhóm route quản trị, yêu cầu JWT và quyền admin */
app.use("/api/admin/tour", adminToursRouter);
app.use("/api/admin/destination", adminDestinationsRouter);
app.use("/api/admin/categories", adminCategoriesRouter);
app.use("/api/admin/reviews", adminReviewsRouter);
app.use("/api/admin/payments", adminPaymentsRouter);

module.exports = app;
