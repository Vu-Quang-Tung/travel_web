/* Trang chi tiet tour va form dat tour */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { useAuth } from "../context/auth-context";
import { createBooking } from "../services/bookings.service";
import { getTourBySlug } from "../services/tours.service";
import { formatCurrency, toAbsoluteAssetUrl } from "../services/api";

const initialBookingForm = {
  tour_schedule_id: "",
  adult_count: 1,
  child_count: 0,
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  special_requests: "",
};

function TourDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function loadTour() {
      try {
        const data = await getTourBySlug(slug);
        setTour(data);
        setBookingForm((current) => ({
          ...current,
          tour_schedule_id: data.schedules?.[0]?.id || "",
          contact_name: user?.full_name || "",
          contact_email: user?.email || "",
          contact_phone: user?.phone || "",
        }));
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadTour();
  }, [slug, user]);

  const selectedSchedule = useMemo(
    () => tour?.schedules?.find((item) => String(item.id) === String(bookingForm.tour_schedule_id)),
    [tour, bookingForm.tour_schedule_id]
  );

  const reviewAverage = useMemo(() => {
    if (!tour?.reviews?.length) return null;
    const total = tour.reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    return (total / tour.reviews.length).toFixed(1);
  }, [tour]);

  async function handleBookingSubmit(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      const payload = {
        ...bookingForm,
        adult_count: Number(bookingForm.adult_count),
        child_count: Number(bookingForm.child_count),
      };

      const data = await createBooking(token, payload);
      navigate(`/bookings/${data.bookingCode}`);
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <main>
        <PageHero eyebrow="Chi tiết tour" title="Đang tải..." />
        <section className="section">
          <div className="container">
            <LoadingState message="Đang tải chi tiết tour..." />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main>
        <PageHero eyebrow="Chi tiết tour" title="Không thể tải tour" description={errorMessage} />
      </main>
    );
  }

  return (
    <main>
      <PageHero eyebrow="Chi tiết tour" title={tour.title} description={tour.summary} />

      <section className="section">
        <div className="container detail-layout">
          <article className="detail-main">
            <div className="detail-hero">
              <img
                src={toAbsoluteAssetUrl(tour.destination_hero_image_url || tour.images?.[0]?.image_url)}
                alt={tour.title}
              />
            </div>

            <div className="detail-content">
              <p className="card-meta">
                {tour.destination_name} - {tour.country}
              </p>
              <h3>{tour.title}</h3>
              <p>{tour.description || tour.summary}</p>

              <div className="detail-highlights">
                <div>
                  <span>Thời gian</span>
                  <strong>
                    {tour.duration_days} ngày {tour.duration_nights} đêm
                  </strong>
                </div>
                <div>
                  <span>Điểm hẹn</span>
                  <strong>{tour.meeting_point || "Đang cập nhật"}</strong>
                </div>
                <div>
                  <span>Mức độ</span>
                  <strong>{tour.difficulty_level}</strong>
                </div>
              </div>

              <section className="detail-block">
                <div className="detail-block__head">
                  <div>
                    <p className="section-kicker">Lịch trình</p>
                    <h4>Những gì bạn sẽ trải nghiệm trong chuyến đi này</h4>
                  </div>
                </div>
                <div className="timeline">
                  {(tour.itinerary || []).map((item) => (
                    <article key={item.id} className="timeline__item">
                      <div className="timeline__day">Ngày {item.day_number}</div>
                      <div>
                        <h5>{item.title}</h5>
                        <p>{item.description}</p>
                        <small>
                          {item.meals || "Chưa rõ bữa ăn"} - {item.transport || "Chưa rõ phương tiện"}
                        </small>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="detail-block">
                <div className="detail-block__head">
                  <div>
                    <p className="section-kicker">Hình ảnh</p>
                    <h4>Một vài khung cảnh trong hành trình</h4>
                  </div>
                </div>
                {(tour.images || []).length ? (
                  <div className="gallery-grid gallery-grid--large">
                    {tour.images.map((image) => (
                      <img key={image.id} src={toAbsoluteAssetUrl(image.image_url)} alt={image.alt_text || tour.title} />
                    ))}
                  </div>
                ) : (
                  <div className="message-box">Bộ sưu tập hình ảnh đang được cập nhật thêm.</div>
                )}
              </section>

              <section className="detail-block">
                <div className="detail-block__head">
                  <div>
                    <p className="section-kicker">Cảm nhận</p>
                    <h4>Những chia sẻ từ khách đã từng tham gia</h4>
                  </div>
                  {reviewAverage ? (
                    <div className="review-score">
                      <strong>{reviewAverage}/5</strong>
                      <span>{tour.reviews.length} đánh giá</span>
                    </div>
                  ) : null}
                </div>

                {(tour.reviews || []).length ? (
                  <div className="review-list">
                    {tour.reviews.map((review) => (
                      <article key={review.id} className="review-card">
                        <div className="review-card__head">
                          <strong>{review.title || "Chuyến đi dễ chịu"}</strong>
                          <span>{"★".repeat(Number(review.rating || 0))}</span>
                        </div>
                        <p className="card-meta">{review.full_name || "Khách đã đi tour"}</p>
                        <p>{review.content || "Khách đã để lại đánh giá nhưng chưa viết nội dung chi tiết."}</p>
                        <small>{review.created_at}</small>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="message-box">
                    Tour này chưa có review công khai. Bạn có thể trở thành một trong những người đầu tiên để lại cảm nhận sau chuyến đi.
                  </div>
                )}
              </section>
            </div>
          </article>

          <aside className="detail-side">
            <section className="detail-card">
              <h4>Lịch khởi hành</h4>
              {(tour.schedules || []).length ? (
                <div className="schedule-list">
                  {tour.schedules.map((schedule) => (
                    <article key={schedule.id} className="schedule-item">
                      <div>
                        <strong>{schedule.code}</strong>
                        <p>
                          {schedule.departure_date} đến {schedule.return_date}
                        </p>
                      </div>
                      <div className="schedule-item__meta">
                        <span>{formatCurrency(schedule.base_price)}</span>
                        <small>Còn {schedule.seats_available} chỗ</small>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p>Chưa có lịch khởi hành đang mở.</p>
              )}
            </section>

            <section className="detail-card">
              <h4>Đặt tour</h4>
              <p className="detail-card__note">
                Điền thông tin liên hệ, chọn đợt khởi hành phù hợp và gửi yêu cầu giữ chỗ ngay trên trang này.
              </p>
              {bookingError ? <ErrorState message={bookingError} /> : null}
              <form className="form-grid" onSubmit={handleBookingSubmit}>
                <label>
                  Lịch khởi hành
                  <select
                    value={bookingForm.tour_schedule_id}
                    onChange={(event) =>
                      setBookingForm((current) => ({ ...current, tour_schedule_id: event.target.value }))
                    }
                  >
                    {(tour.schedules || []).map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.code} - {schedule.departure_date}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="form-row">
                  <label>
                    Người lớn
                    <input
                      type="number"
                      min="1"
                      value={bookingForm.adult_count}
                      onChange={(event) =>
                        setBookingForm((current) => ({ ...current, adult_count: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Trẻ em
                    <input
                      type="number"
                      min="0"
                      value={bookingForm.child_count}
                      onChange={(event) =>
                        setBookingForm((current) => ({ ...current, child_count: event.target.value }))
                      }
                    />
                  </label>
                </div>

                <label>
                  Tên liên hệ
                  <input
                    value={bookingForm.contact_name}
                    onChange={(event) =>
                      setBookingForm((current) => ({ ...current, contact_name: event.target.value }))
                    }
                  />
                </label>

                <label>
                  Email liên hệ
                  <input
                    type="email"
                    value={bookingForm.contact_email}
                    onChange={(event) =>
                      setBookingForm((current) => ({ ...current, contact_email: event.target.value }))
                    }
                  />
                </label>

                <label>
                  Số điện thoại
                  <input
                    value={bookingForm.contact_phone}
                    onChange={(event) =>
                      setBookingForm((current) => ({ ...current, contact_phone: event.target.value }))
                    }
                  />
                </label>

                <label>
                  Yêu cầu thêm
                  <textarea
                    rows="4"
                    value={bookingForm.special_requests}
                    onChange={(event) =>
                      setBookingForm((current) => ({ ...current, special_requests: event.target.value }))
                    }
                  />
                </label>

                {selectedSchedule ? (
                  <div className="price-box">
                    <strong>{formatCurrency(selectedSchedule.base_price)}</strong>
                    <span>Giá trẻ em: {formatCurrency(selectedSchedule.child_price)}</span>
                  </div>
                ) : null}

                <button className="button button--primary button--block" type="submit" disabled={bookingLoading}>
                  {bookingLoading ? "Đang giữ chỗ..." : "Đặt chỗ ngay"}
                </button>
              </form>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default TourDetailPage;
