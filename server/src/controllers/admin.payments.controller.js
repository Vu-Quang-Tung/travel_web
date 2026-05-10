const db = require("../config/db");

/* Admin xem toàn bộ lịch sử thanh toán kèm mã booking và tên khách */
exports.getPaymentsForAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, b.booking_code, u.full_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN users u ON b.user_id = u.id
      ORDER BY p.id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Xác nhận payment và đồng bộ trạng thái booking trong cùng transaction */
exports.confirmPayment = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    await connection.beginTransaction();

    const [paymentRows] = await connection.query(
      `SELECT booking_id FROM payments WHERE id = ? LIMIT 1`,
      [id]
    );

    if (paymentRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Payment not found" });
    }

    const payment = paymentRows[0];

    await connection.query(`UPDATE payments SET status = 'success', paid_at = NOW() WHERE id = ?`, [id]);
    await connection.query(`UPDATE bookings SET payment_status = 'paid', status = 'paid' WHERE id = ?`, [
      payment.booking_id,
    ]);

    await connection.commit();

    res.json({ message: "Payment confirmed successfully" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

/* Đánh dấu payment thất bại */
exports.failPayment = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`UPDATE payments SET status = 'failed' WHERE id = ?`, [id]);
    res.json({ message: "Payment marked as failed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
