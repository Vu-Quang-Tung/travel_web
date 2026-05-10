const db = require("../config/db");

/* Admin lấy danh sách điểm đến đầy đủ thông tin */
exports.getDestinationsForAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        slug,
        country,
        city,
        short_description,
        description,
        hero_image_url,
        best_season,
        created_at,
        updated_at
      FROM destinations
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin lấy chi tiết điểm đến theo id để chỉnh sửa */
exports.getDestinationsByIdForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

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
        best_season,
        created_at,
        updated_at
      FROM destinations
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin tạo điểm đến mới */
exports.createDestination = async (req, res) => {
  try {
    const {
      name,
      slug,
      country,
      city,
      short_description,
      description,
      hero_image_url,
      best_season,
    } = req.body;

    if (!name || !slug || !country) {
      return res.status(400).json({ message: "name, slug, country are required" });
    }

    const [result] = await db.query(
      `
      INSERT INTO destinations (
        name,
        slug,
        country,
        city,
        short_description,
        description,
        hero_image_url,
        best_season
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        slug,
        country,
        city || null,
        short_description || null,
        description || null,
        hero_image_url || null,
        best_season || null,
      ]
    );

    res.status(201).json({
      message: "Destination created successfully",
      destinationId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin cập nhật thông tin điểm đến */
exports.updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      country,
      city,
      short_description,
      description,
      hero_image_url,
      best_season,
    } = req.body;

    await db.query(
      `
      UPDATE destinations
      SET
        name = ?,
        slug = ?,
        country = ?,
        city = ?,
        short_description = ?,
        description = ?,
        hero_image_url = ?,
        best_season = ?
      WHERE id = ?
      `,
      [
        name,
        slug,
        country,
        city || null,
        short_description || null,
        description || null,
        hero_image_url || null,
        best_season || null,
        id,
      ]
    );

    res.json({ message: "Destination updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin xóa điểm đến */
exports.deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM destinations WHERE id = ?", [id]);

    res.json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
