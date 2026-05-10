const db = require("../config/db");

/* Lấy danh sách review cho admin */
exports.getReviewsForAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.full_name, t.title AS tour_title
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN tours t ON r.tour_id = t.id
      ORDER BY r.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Thay đổi trạng thái review thành hiện */
exports.publishReview = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`UPDATE reviews SET is_published = 1 WHERE id = ?`, [id]);
    res.json({ message: "Review published successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Thay đổi trạng thái review thành ẩn */
exports.hideReview = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`UPDATE reviews SET is_published = 0 WHERE id = ?`, [id]);
    res.json({ message: "Review hidden successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Xoá review */
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM reviews WHERE id = ?`, [id]);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
