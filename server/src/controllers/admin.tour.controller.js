const db = require("../config/db");

/* Admin lấy danh sách tour kèm tên danh mục và điểm đến */
exports.getToursForAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        tours.id,
        tours.category_id,
        tours.destination_id,
        tours.title,
        tours.slug,
        tours.summary,
        tours.description,
        tours.duration_days,
        tours.duration_nights,
        tours.meeting_point,
        tours.max_guests,
        tours.difficulty_level,
        tours.status,
        tours.featured,
        categories.name AS category_name,
        destinations.name AS destination_name,
        tours.created_at,
        tours.updated_at
      FROM tours
      LEFT JOIN categories ON tours.category_id = categories.id
      LEFT JOIN destinations ON tours.destination_id = destinations.id
      ORDER BY tours.id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin lấy chi tiết tour, bao gồm ảnh, lịch trình và lịch khởi hành */
exports.getTourByIdForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM tours
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const tour = rows[0];

    const [imageRows] = await db.query(
      `
      SELECT id, image_url, alt_text, is_cover, sort_order
      FROM tour_images
      WHERE tour_id = ?
      ORDER BY is_cover DESC, sort_order ASC, id ASC
      `,
      [id]
    );

    const [itineraryRows] = await db.query(
      `
      SELECT id, day_number, title, description, meals, accommodation, transport
      FROM tour_itineraries
      WHERE tour_id = ?
      ORDER BY day_number ASC
      `,
      [id]
    );

    const [scheduleRows] = await db.query(
      `
      SELECT
        id,
        code,
        departure_date,
        return_date,
        booking_deadline,
        seats_total,
        seats_available,
        base_price,
        child_price,
        currency,
        status
      FROM tour_schedules
      WHERE tour_id = ?
      ORDER BY departure_date ASC
      `,
      [id]
    );

    res.json({
      ...tour,
      imageRows,
      itineraryRows,
      scheduleRows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin tạo tour mới */
exports.createTour = async (req, res) => {
  try {
    const {
      category_id,
      destination_id,
      title,
      slug,
      summary,
      description,
      duration_days,
      duration_nights,
      meeting_point,
      max_guests,
      difficulty_level,
      status,
      featured,
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO tours (
        category_id,
        destination_id,
        title,
        slug,
        summary,
        description,
        duration_days,
        duration_nights,
        meeting_point,
        max_guests,
        difficulty_level,
        status,
        featured
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        category_id,
        destination_id,
        title,
        slug,
        summary,
        description,
        duration_days,
        duration_nights,
        meeting_point,
        max_guests,
        difficulty_level,
        status,
        featured,
      ]
    );

    res.json({
      message: "Tour created successfully",
      tourId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin cập nhật thông tin chính của tour */
exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      destination_id,
      title,
      slug,
      summary,
      description,
      duration_days,
      duration_nights,
      meeting_point,
      max_guests,
      difficulty_level,
      status,
      featured,
    } = req.body;

    await db.query(
      `
      UPDATE tours
      SET
        category_id = ?,
        destination_id = ?,
        title = ?,
        slug = ?,
        summary = ?,
        description = ?,
        duration_days = ?,
        duration_nights = ?,
        meeting_point = ?,
        max_guests = ?,
        difficulty_level = ?,
        status = ?,
        featured = ?
      WHERE id = ?
      `,
      [
        category_id,
        destination_id,
        title,
        slug,
        summary,
        description,
        duration_days,
        duration_nights,
        meeting_point,
        max_guests,
        difficulty_level,
        status,
        featured,
        id,
      ]
    );

    res.json({ message: "Tour updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin xóa tour */
exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM tours WHERE id = ?", [id]);

    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin tạo lịch khởi hành cho tour */
exports.createSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      departure_date,
      return_date,
      booking_deadline,
      seats_total,
      seats_available,
      base_price,
      child_price,
      currency,
      status,
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO tour_schedules (
        tour_id,
        code,
        departure_date,
        return_date,
        booking_deadline,
        seats_total,
        seats_available,
        base_price,
        child_price,
        currency,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        code,
        departure_date,
        return_date,
        booking_deadline || null,
        seats_total,
        seats_available,
        base_price,
        child_price || null,
        currency || "VND",
        status || "open",
      ]
    );

    res.status(201).json({
      message: "Schedule created successfully",
      scheduleId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin cập nhật lịch khởi hành của tour */
exports.updateSchedule = async (req, res) => {
  try {
    const { id, scheduleId } = req.params;
    const {
      code,
      departure_date,
      return_date,
      booking_deadline,
      seats_total,
      seats_available,
      base_price,
      child_price,
      currency,
      status,
    } = req.body;

    await db.query(
      `
      UPDATE tour_schedules
      SET
        code = ?,
        departure_date = ?,
        return_date = ?,
        booking_deadline = ?,
        seats_total = ?,
        seats_available = ?,
        base_price = ?,
        child_price = ?,
        currency = ?,
        status = ?
      WHERE id = ? AND tour_id = ?
      `,
      [
        code,
        departure_date,
        return_date,
        booking_deadline || null,
        seats_total,
        seats_available,
        base_price,
        child_price || null,
        currency || "VND",
        status || "open",
        scheduleId,
        id,
      ]
    );

    res.json({ message: "Schedule updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin xóa lịch khởi hành của tour */
exports.deleteSchedule = async (req, res) => {
  try {
    const { id, scheduleId } = req.params;

    await db.query("DELETE FROM tour_schedules WHERE id = ? AND tour_id = ?", [scheduleId, id]);

    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin thêm lịch trình từng ngày cho tour */
exports.createItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const { day_number, title, description, meals, accommodation, transport } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO tour_itineraries (
        tour_id,
        day_number,
        title,
        description,
        meals,
        accommodation,
        transport
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [id, day_number, title, description || null, meals || null, accommodation || null, transport || null]
    );

    res.status(201).json({
      message: "Itinerary created successfully",
      itineraryId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin cập nhật lịch trình từng ngày */
exports.updateItinerary = async (req, res) => {
  try {
    const { id, itineraryId } = req.params;
    const { day_number, title, description, meals, accommodation, transport } = req.body;

    await db.query(
      `
      UPDATE tour_itineraries
      SET
        day_number = ?,
        title = ?,
        description = ?,
        meals = ?,
        accommodation = ?,
        transport = ?
      WHERE id = ? AND tour_id = ?
      `,
      [day_number, title, description || null, meals || null, accommodation || null, transport || null, itineraryId, id]
    );

    res.json({ message: "Itinerary updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin xóa một mục lịch trình */
exports.deleteItinerary = async (req, res) => {
  try {
    const { id, itineraryId } = req.params;

    await db.query("DELETE FROM tour_itineraries WHERE id = ? AND tour_id = ?", [itineraryId, id]);

    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin thêm ảnh tour, đảm bảo mỗi tour chỉ có một ảnh cover */
exports.createImage = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    const { image_url, alt_text, is_cover, sort_order } = req.body;

    await connection.beginTransaction();

    /* Khi chọn ảnh cover mới, bỏ trạng thái cover của các ảnh cũ */
    if (Number(is_cover) === 1) {
      await connection.query("UPDATE tour_images SET is_cover = 0 WHERE tour_id = ?", [id]);
    }

    const [result] = await connection.query(
      `
      INSERT INTO tour_images (
        tour_id,
        image_url,
        alt_text,
        is_cover,
        sort_order
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [id, image_url, alt_text || null, Number(is_cover) || 0, Number(sort_order) || 0]
    );

    await connection.commit();

    res.status(201).json({
      message: "Image created successfully",
      imageId: result.insertId,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

/* Admin cập nhật ảnh tour và trạng thái cover */
exports.updateImage = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id, imageId } = req.params;
    const { image_url, alt_text, is_cover, sort_order } = req.body;

    await connection.beginTransaction();

    /* Khi chọn ảnh cover mới, bỏ trạng thái cover của các ảnh cũ */
    if (Number(is_cover) === 1) {
      await connection.query("UPDATE tour_images SET is_cover = 0 WHERE tour_id = ?", [id]);
    }

    await connection.query(
      `
      UPDATE tour_images
      SET
        image_url = ?,
        alt_text = ?,
        is_cover = ?,
        sort_order = ?
      WHERE id = ? AND tour_id = ?
      `,
      [image_url, alt_text || null, Number(is_cover) || 0, Number(sort_order) || 0, imageId, id]
    );

    await connection.commit();

    res.json({ message: "Image updated successfully" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

/* Admin xóa ảnh khỏi tour */
exports.deleteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    await db.query("DELETE FROM tour_images WHERE id = ? AND tour_id = ?", [imageId, id]);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
