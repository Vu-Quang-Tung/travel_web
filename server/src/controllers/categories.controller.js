const db = require("../config/db");

/* Lấy danh sách category public cho trang lọc tour */
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, slug, description, created_at, updated_at
      FROM categories
      ORDER BY name ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Lấy chi tiết category theo slug */
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await db.query(
      `
      SELECT id, name, slug, description, created_at, updated_at
      FROM categories
      WHERE slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
