const db = require("../config/db");

/* Lấy danh sách category cho admin */
exports.getCategoriesForAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM categories ORDER BY id DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Tạo category mới */
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    
    /* Kiểm tra xem có name và slug không */
    if (!name || !slug) {
      return res.status(400).json({ message: "name and slug are required" });
    }
    const [result] = await db.query(
      `INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)`,
      [name, slug, description || null]
    );
    res.status(201).json({ message: "Category created successfully", categoryId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Cập nhật category */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;
    await db.query(
      `UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?`,
      [name, slug, description || null, id]
    );
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 /* Xoá category */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM categories WHERE id = ?`, [id]);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
