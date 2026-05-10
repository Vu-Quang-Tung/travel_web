/* Trang chi tiet booking theo ma dat tour */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { useAuth } from "../context/auth-context";
import { getBookingByCode } from "../services/bookings.service";
import { createPayment } from "../services/payments.service";
import { createReview } from "../services/reviews.service";
import { formatCurrency } from "../services/api";

function BookingDetailPage() {
  const { bookingCode } = useParams();
  const { token } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    payment_method: "bank_transfer",
    transaction_code: "",
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    content: "",
  });

  useEffect(() => {
    async function loadBooking() {
      try {
        const data = await getBookingByCode(token, bookingCode);
        setBooking(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingCode, token]);

  async function handlePaymentSubmit(event) {
    event.preventDefault();

    try {
      await createPayment(token, {
        booking_id: booking.id,
        payment_method: paymentForm.payment_method,
        transaction_code: paymentForm.transaction_code,
        amount: booking.total_amount,
        currency: "VND",
      });
      setPaymentMessage("Yêu cầu thanh toán đã được ghi nhận.");
    } catch (error) {
      setPaymentMessage(error.message);
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    try {
      await createReview(token, {
        booking_id: booking.id,
        rating: Number(reviewForm.rating),
        title: reviewForm.title,
        content: reviewForm.content,
      });
      setReviewMessage("Cảm nhận của bạn đã được gửi thành công.");
    } catch (error) {
      setReviewMessage(error.message);
    }
  }

  if (loading) {
    return (
      <main>
        <PageHero eyebrow="Chi tiết booking" title="Đang tải..." />
        <section className="section">
          <div className="container">
            <LoadingState />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main>
        <PageHero eyebrow="Chi tiết booking" title="Không thể tải booking" description={errorMessage} />
      </main>
    );
  }

  return (
    <main>
      <PageHero eyebrow="Chi tiết booking" title={booking.booking_code} description={booking.tour_title} />

      <section className="section">
        <div className="container split-panels">
          <article className="card detail-card">
            <h3>Thông tin booking</h3>
            <div className="info-list">
              <div><span>Khởi hành</span><strong>{booking.departure_date}</strong></div>
              <div><span>Liên hệ</span><strong>{booking.contact_name}</strong></div>
              <div><span>Tổng tiền</span><strong>{formatCurrency(booking.total_amount)}</strong></div>
              <div><span>Trạng thái</span><strong>{booking.status}</strong></div>
              <div><span>Thanh toán</span><strong>{booking.payment_status}</strong></div>
            </div>

            <h4>Người đi cùng</h4>
            <div className="data-list">
              {(booking.travelers || []).map((traveler) => (
                <div key={traveler.id} className="data-row data-row--compact">
                  <strong>{traveler.full_name}</strong>
                  <span>{traveler.traveler_type}</span>
                </div>
              ))}
            </div>
          </article>

          <div className="stack-panels">
            <form className="card detail-card form-grid" onSubmit={handlePaymentSubmit}>
              <h3>Thông tin thanh toán</h3>
              {paymentMessage ? <div className="message-box">{paymentMessage}</div> : null}
              <label>
                Phương thức
                <select
                  value={paymentForm.payment_method}
                  onChange={(event) => setPaymentForm((current) => ({ ...current, payment_method: event.target.value }))}
                >
                  <option value="bank_transfer">Chuyển khoản</option>
                  <option value="cash">Tiền mặt</option>
                  <option value="card">Thẻ</option>
                  <option value="momo">Momo</option>
                  <option value="zalopay">ZaloPay</option>
                  <option value="vnpay">VNPay</option>
                </select>
              </label>
              <label>
                Mã giao dịch
                <input
                  value={paymentForm.transaction_code}
                  onChange={(event) =>
                    setPaymentForm((current) => ({ ...current, transaction_code: event.target.value }))
                  }
                />
              </label>
              <button className="button button--primary">Gửi thông tin thanh toán</button>
            </form>

            <form className="card detail-card form-grid" onSubmit={handleReviewSubmit}>
              <h3>Đánh giá</h3>
              {reviewMessage ? <div className="message-box">{reviewMessage}</div> : null}
              <label>
                Số sao
                <select
                  value={reviewForm.rating}
                  onChange={(event) => setReviewForm((current) => ({ ...current, rating: event.target.value }))}
                >
                  <option value="5">5 sao</option>
                  <option value="4">4 sao</option>
                  <option value="3">3 sao</option>
                  <option value="2">2 sao</option>
                  <option value="1">1 sao</option>
                </select>
              </label>
              <label>
                Tiêu đề
                <input
                  value={reviewForm.title}
                  onChange={(event) => setReviewForm((current) => ({ ...current, title: event.target.value }))}
                />
              </label>
              <label>
                Cảm nhận
                <textarea
                  rows="4"
                  value={reviewForm.content}
                  onChange={(event) => setReviewForm((current) => ({ ...current, content: event.target.value }))}
                />
              </label>
              <button className="button button--ghost">Gửi cảm nhận</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BookingDetailPage;
