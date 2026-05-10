const db = require("../config/db");

function normalizeGuestCounts(adultCount, childCount) {
  const adultsCount = Number(adultCount) || 1;
  const childrenCount = Number(childCount) || 0;

  return {
    adultsCount,
    childrenCount,
    totalGuests: adultsCount + childrenCount,
  };
}

function calculateTotalPrice(schedule, adultsCount, childrenCount) {
  return adultsCount * Number(schedule.base_price) + childrenCount * Number(schedule.child_price || 0);
}

function generateBookingCode(userId, scheduleId) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const userIdPart = String(userId).padStart(4, "0");
  const scheduleIdPart = String(scheduleId).padStart(4, "0");
  const randomNum = Math.floor(Math.random() * 1000);

  return `BK-${year}${month}${day}-${userIdPart}${scheduleIdPart}-${randomNum}`;
}

function buildContactInfo(user, payload) {
  return {
    contactName: payload.contact_name || user.full_name,
    contactEmail: payload.contact_email || user.email,
    contactPhone: payload.contact_phone || user.phone,
  };
}

async function findActiveUserForBooking(connection, userId) {
  const [users] = await connection.query(
    `SELECT id, full_name, email, phone, status
     FROM users
     WHERE id = ?`,
    [userId]
  );

  return users[0] || null;
}

async function findScheduleForBooking(connection, scheduleId) {
  const [scheduleRows] = await connection.query(
    `SELECT *
     FROM tour_schedules
     WHERE id = ?
     LIMIT 1
     FOR UPDATE`,
    [scheduleId]
  );

  return scheduleRows[0] || null;
}

async function insertTravelers(connection, bookingId, travelers) {
  if (!Array.isArray(travelers)) {
    return;
  }

  for (const traveler of travelers) {
    await connection.query(
      `INSERT INTO booking_travelers (
        booking_id,
        full_name,
        traveler_type,
        gender,
        date_of_birth,
        passport_number,
        nationality
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingId,
        traveler.full_name,
        traveler.traveler_type || "adult",
        traveler.gender || null,
        traveler.date_of_birth || null,
        traveler.passport_number || null,
        traveler.nationality || null,
      ]
    );
  }
}

/* Tao booking moi va tru so ghe trong transaction de tranh dat qua so ghe */
exports.createBooking = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = req.user.id;
    const {
      tour_schedule_id,
      adult_count,
      child_count,
      special_requests,
      travelers,
      contact_name,
      contact_email,
      contact_phone,
    } = req.body;

    if (!tour_schedule_id) {
      return res.status(400).json({ message: "tour_schedule_id is required" });
    }

    await connection.beginTransaction();

    const user = await findActiveUserForBooking(connection, userId);

    if (!user) {
      await connection.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      await connection.rollback();
      return res.status(403).json({ message: "User account is not active" });
    }

    const schedule = await findScheduleForBooking(connection, tour_schedule_id);

    if (!schedule) {
      throw new Error("Tour schedule not found");
    }

    const { adultsCount, childrenCount, totalGuests } = normalizeGuestCounts(adult_count, child_count);

    if (totalGuests <= 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Total guest must be greater than 0" });
    }

    if (schedule.seats_available < totalGuests) {
      throw new Error("Not enough seats available");
    }

    const totalPrice = calculateTotalPrice(schedule, adultsCount, childrenCount);
    const bookingCode = generateBookingCode(userId, tour_schedule_id);
    const { contactName, contactEmail, contactPhone } = buildContactInfo(user, {
      contact_name,
      contact_email,
      contact_phone,
    });

    if (!contactName || !contactEmail || !contactPhone) {
      await connection.rollback();
      return res.status(400).json({ message: "Contact information is incomplete" });
    }

    const [bookingResult] = await connection.query(
      `INSERT INTO bookings (
        booking_code,
        user_id,
        tour_schedule_id,
        contact_name,
        contact_email,
        contact_phone,
        adult_count,
        child_count,
        subtotal_amount,
        total_amount,
        special_requests,
        status,
        payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingCode,
        userId,
        tour_schedule_id,
        contactName,
        contactEmail,
        contactPhone,
        adultsCount,
        childrenCount,
        totalPrice,
        totalPrice,
        special_requests || null,
        "pending",
        "unpaid",
      ]
    );

    const bookingId = bookingResult.insertId;

    await insertTravelers(connection, bookingId, travelers);

    const [updateResult] = await connection.query(
      `UPDATE tour_schedules
       SET seats_available = seats_available - ?
       WHERE id = ? AND seats_available >= ?`,
      [totalGuests, tour_schedule_id, totalGuests]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error("Not enough seats available");
    }

    await connection.commit();

    res.status(201).json({
      message: "Booking created successfully",
      bookingId,
      bookingCode,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

/* Lay danh sach booking cua user hien tai */
exports.getMyBookings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        b.id,
        b.booking_code,
        b.tour_schedule_id,
        b.contact_name,
        b.contact_email,
        b.contact_phone,
        b.adult_count,
        b.child_count,
        b.subtotal_amount,
        b.total_amount,
        b.special_requests,
        b.status,
        b.payment_status,
        ts.tour_id,
        ts.departure_date,
        ts.base_price,
        ts.child_price,
        t.title AS tour_title
      FROM bookings b
      JOIN tour_schedules ts ON b.tour_schedule_id = ts.id
      JOIN tours t ON ts.tour_id = t.id
      WHERE b.user_id = ?`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Lay chi tiet booking theo ma va chi tra ve booking cua user hien tai */
exports.getMyBookingDetails = async (req, res) => {
  const { bookingCode } = req.params;

  try {
    const [bookingRows] = await db.query(
      `SELECT
        b.*,
        t.title AS tour_title,
        t.slug AS tour_slug,
        ts.departure_date,
        ts.return_date,
        ts.base_price,
        ts.child_price
      FROM bookings b
      JOIN tour_schedules ts ON b.tour_schedule_id = ts.id
      JOIN tours t ON ts.tour_id = t.id
      WHERE b.booking_code = ? AND b.user_id = ?`,
      [bookingCode, req.user.id]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = bookingRows[0];
    const [travelers] = await db.query(
      `SELECT
        id,
        full_name,
        traveler_type,
        gender,
        date_of_birth,
        passport_number,
        nationality
      FROM booking_travelers
      WHERE booking_id = ?`,
      [booking.id]
    );

    res.json({
      ...booking,
      travelers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
