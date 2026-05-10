/* Trang danh sach booking cua nguoi dung hien tai */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { useAuth } from "../context/auth-context";
import { getMyBookings } from "../services/bookings.service";
import { formatCurrency } from "../services/api";

function BookingListPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getMyBookings(token);
        setBookings(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [token]);

  return (
    <main>
      <PageHero eyebrow="Chuyến đi của bạn" title="Tất cả booking đang được lưu trong tài khoản" />

      <section className="section">
        <div className="container">
          {errorMessage ? (
            <ErrorState message={errorMessage} />
          ) : loading ? (
            <LoadingState message="Đang tải booking..." />
          ) : !bookings.length ? (
            <div className="message-box">Chưa có booking nào.</div>
          ) : (
            <div className="data-list">
              {bookings.map((booking) => (
                <article key={booking.id} className="card data-row">
                  <div>
                    <p className="card-meta">{booking.booking_code}</p>
                    <h3>{booking.tour_title}</h3>
                    <p>Khởi hành: {booking.departure_date}</p>
                  </div>
                  <div className="data-row__meta">
                    <strong>{formatCurrency(booking.total_amount)}</strong>
                    <span>{booking.status}</span>
                    <Link className="button button--ghost button--small" to={`/bookings/${booking.booking_code}`}>
                      Xem chi tiết
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default BookingListPage;
