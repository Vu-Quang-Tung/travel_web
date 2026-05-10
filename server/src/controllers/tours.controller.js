const db = require("../config/db");

/* Lấy danh sách tour */
exports.getTours = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        tours.id,
        tours.title,
        tours.slug,
        tours.summary,
        tours.duration_days,
        tours.duration_nights,
        tours.featured,
        categories.name AS category_name,
        destinations.name AS destination_name,
        destinations.hero_image_url AS destination_hero_image_url,
        MIN(tour_schedules.base_price) AS base_price,
        MIN(tour_schedules.departure_date) AS nearest_departure_date
      FROM tours
      LEFT JOIN categories ON tours.category_id = categories.id
      LEFT JOIN destinations ON tours.destination_id = destinations.id
      LEFT JOIN tour_schedules ON tours.id = tour_schedules.tour_id AND tour_schedules.status = 'open'
      WHERE tours.status = 'published'
      GROUP BY 
        tours.id,
        tours.title,
        tours.slug,
        tours.summary,
        tours.duration_days,
        tours.duration_nights,
        tours.featured,
        categories.name,
        destinations.name,
        destinations.hero_image_url
      ORDER BY tours.featured DESC, tours.id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Lấy chi tiết tour theo slug */
exports.getTourBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const [tourRows] = await db.query(
      `
      SELECT 
        tours.*,
        destinations.name AS destination_name,
        destinations.slug AS destination_slug,
        destinations.country,
        destinations.city,
        destinations.short_description AS destination_short_description,
        destinations.hero_image_url AS destination_hero_image_url,
        destinations.best_season
      FROM tours
      LEFT JOIN destinations ON tours.destination_id = destinations.id
      WHERE tours.slug = ? AND tours.status = 'published'
    `,
      [slug]
    );

    if (tourRows.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const tour = tourRows[0];

    /* Lấy ảnh của tour */
    const [imageRows] = await db.query(
      `
        SELECT id, image_url, alt_text, is_cover, sort_order
        FROM tour_images 
        WHERE tour_id = ?
        ORDER BY is_cover DESC, sort_order ASC, id ASC
        `,
      [tour.id]
    );

    /* Lấy thông tin lịch trình của tour */
    const [itineraryRows] = await db.query(
      `
        SELECT id, day_number, title, description, meals, accommodation, transport
        FROM tour_itineraries 
        WHERE tour_id = ?
        ORDER BY day_number ASC
        `,
      [tour.id]
    );

    /* Lấy ngày khởi hành của tour */
    const [scheduleRows] = await db.query(
      `
        SELECT id, code, departure_date, return_date, booking_deadline, seats_total, seats_available, base_price, child_price, currency, status
        FROM tour_schedules 
        WHERE tour_id = ? AND status = 'open'
        ORDER BY departure_date ASC
        `,
      [tour.id]
    );

    /* Lấy thông tin review của tour */
    const [reviewRows] = await db.query(
      `
        SELECT reviews.id, reviews.rating, reviews.title, reviews.content, reviews.created_at, users.full_name
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        WHERE tour_id = ? AND is_published = 1
        ORDER BY created_at DESC
        `,
      [tour.id]
    );

    res.json({
      ...tour,
      images: imageRows,
      itinerary: itineraryRows,
      schedules: scheduleRows,
      reviews: reviewRows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
