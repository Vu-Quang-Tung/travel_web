const db = require("../config/db");

function validatePaymentPayload({ booking_id, payment_method, amount }) {
  if (!booking_id || !payment_method || !amount) {
    return "booking_id, payment_method, amount are required";
  }

  return null;
}

async function findUserBooking(bookingId, userId) {
  const [bookingRows] = await db.query(
    `SELECT id
     FROM bookings
     WHERE id = ? AND user_id = ?
     LIMIT 1`,
    [bookingId, userId]
  );

  return bookingRows[0] || null;
}

/* Tao payment moi cho booking thuoc ve user hien tai */
exports.createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { booking_id, payment_method, transaction_code, amount, currency } = req.body;
    const validationError = validatePaymentPayload({ booking_id, payment_method, amount });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const booking = await findUserBooking(booking_id, userId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const [result] = await db.query(
      `INSERT INTO payments (booking_id, payment_method, transaction_code, amount, currency, status, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [booking_id, payment_method, transaction_code || null, amount, currency || "VND", "pending", null]
    );

    res.status(201).json({ message: "Payment created successfully", paymentId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Lay lich su payment cua user hien tai */
exports.getMyPayments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       WHERE b.user_id = ?
       ORDER BY p.id DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
