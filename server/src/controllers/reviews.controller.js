const db = require("../config/db");

/* Lấy các review đã được admin duyệt của một tour */
exports.getReviewsByTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    const [rows] = await db.query(
      `
      SELECT r.id, r.rating, r.title, r.content, r.created_at, u.full_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.tour_id = ? AND r.is_published = 1
      ORDER BY r.created_at DESC
      `,
      [tourId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Tạo review cho booking của user, mặc định chờ admin duyệt */
exports.createReview = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = req.user.id;
    const { booking_id, rating, title, content } = req.body;

    if (!booking_id || !rating) {
      return res.status(400).json({ message: "booking_id and rating are required" });
    }

    const [bookingRows] = await connection.query(
      `
      SELECT b.id, ts.tour_id
      FROM bookings b
      JOIN tour_schedules ts ON b.tour_schedule_id = ts.id
      WHERE b.id = ? AND b.user_id = ?
      LIMIT 1
      `,
      [booking_id, userId]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const [existingReviews] = await connection.query(`SELECT id FROM reviews WHERE booking_id = ? LIMIT 1`, [
      booking_id,
    ]);

    if (existingReviews.length > 0) {
      return res.status(400).json({ message: "This booking has already been reviewed" });
    }

    const booking = bookingRows[0];

    const [result] = await connection.query(
      `
      INSERT INTO reviews (booking_id, user_id, tour_id, rating, title, content, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [booking_id, userId, booking.tour_id, rating, title || null, content || null, 0]
    );

    res.status(201).json({ message: "Review created successfully", reviewId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
