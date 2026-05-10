/* Panel hien thi thong tin chi tiet va gia tour */
import { formatCurrency, toAbsoluteAssetUrl } from "../../services/api";

function TourDetailPanel({ tour }) {
  if (!tour) {
    return <div className="message-box">Chọn một tour để xem chi tiết.</div>;
  }

  return (
    <div className="detail-layout">
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
            <h4>Lịch trình</h4>
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
          <h4>Hình ảnh</h4>
          <div className="gallery-grid">
            {(tour.images || []).map((image) => (
              <img
                key={image.id}
                src={toAbsoluteAssetUrl(image.image_url)}
                alt={image.alt_text || tour.title}
              />
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

export default TourDetailPanel;
