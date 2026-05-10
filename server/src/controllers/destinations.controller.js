const db = require("../config/db");

/* Lấy danh sách điểm đến public */
exports.getDestinations = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        slug,
        country,
        city,
        short_description,
        hero_image_url,
        best_season
      FROM destinations
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Lấy chi tiết điểm đến theo slug */
exports.getDestinationBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        name,
        slug,
        country,
        city,
        short_description,
        description,
        hero_image_url,
        best_season
      FROM destinations
      WHERE slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
