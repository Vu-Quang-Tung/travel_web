const db = require("../config/db");

/* Upload avatar và cập nhật đường dẫn ảnh cho user hiện tại */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userID = req.user.id;
    const imageUrl = `/uploads/avatars/${req.file.filename}`;

    await db.query("UPDATE users SET avatar_url = ? WHERE id = ?", [imageUrl, userID]);

    res.json({ message: "Avatar uploaded successfully", avatarUrl: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Upload ảnh tour và lưu vào bảng tour_images */
exports.uploadTourImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { tour_id, alt_text, is_cover, sort_order } = req.body;

    if (!tour_id) {
      return res.status(400).json({ error: "tour_id is required" });
    }

    const imageUrl = `/uploads/tours/${req.file.filename}`;
    const cover = Number(is_cover || 0);
    const order = Number(sort_order || 0);

    /* Mỗi tour chỉ nên có một ảnh cover */
    if (cover === 1) {
      await db.query("UPDATE tour_images SET is_cover = 0 WHERE tour_id = ?", [tour_id]);
    }

    const [result] = await db.query(
      "INSERT INTO tour_images (tour_id, image_url, alt_text, is_cover, sort_order) VALUES (?, ?, ?, ?, ?)",
      [tour_id, imageUrl, alt_text || null, cover, order]
    );

    res.json({
      message: "Tour image uploaded successfully",
      imageId: result.insertId,
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Upload ảnh hero cho điểm đến */
exports.uploadDestinationImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { destination_id } = req.body;

    if (!destination_id) {
      return res.status(400).json({ error: "destination_id is required" });
    }

    const imageUrl = `/uploads/destinations/${req.file.filename}`;
    await db.query("UPDATE destinations SET hero_image_url = ? WHERE id = ?", [imageUrl, destination_id]);

    res.json({ message: "Destination image uploaded successfully", imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
