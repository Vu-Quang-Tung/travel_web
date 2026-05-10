/* Trang lien he va form gui thong tin tu van */
import { useState } from "react";
import PageHero from "../components/common/PageHero";

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      <PageHero
        eyebrow="Liên hệ"
        title="Cần một điểm bắt đầu cho chuyến đi tiếp theo?"
        description="Nếu bạn muốn hỏi thêm về lịch trình, thời gian khởi hành hay muốn để lại nhu cầu riêng, có thể gửi thông tin tại đây."
      />

      <section className="section">
        <div className="container contact-grid">
          <article className="card detail-card">
            <p className="section-kicker">Thông tin</p>
            <h3>Một vài cách liên hệ đơn giản</h3>
            <div className="info-list">
              <div>
                <span>Email</span>
                <strong>hello@travelweb.local</strong>
              </div>
              <div>
                <span>Hotline</span>
                <strong>0900 000 000</strong>
              </div>
              <div>
                <span>Thời gian</span>
                <strong>08:30 - 18:00 mỗi ngày</strong>
              </div>
            </div>
          </article>

          <form className="card detail-card form-grid" onSubmit={handleSubmit}>
            <h3>Gửi thông tin liên hệ</h3>
            {submitted ? (
              <div className="message-box">
                Thông tin đã được ghi nhận. Bạn có thể tiếp tục xem tour trong lúc chờ phản hồi.
              </div>
            ) : null}
            <label>
              Họ tên
              <input required />
            </label>
            <label>
              Email
              <input type="email" required />
            </label>
            <label>
              Nội dung
              <textarea rows="5" placeholder="Bạn đang quan tâm điểm đến hay hành trình nào?" />
            </label>
            <button className="button button--primary">Gửi liên hệ</button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
