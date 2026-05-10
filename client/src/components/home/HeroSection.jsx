/* Hero section o trang chu voi CTA chinh */
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container hero-section__grid">
        <div className="hero-copy">
          <p className="hero-copy__eyebrow">Hành trình du lịch được chọn lọc</p>
          <h1>Chọn một chuyến đi nhẹ nhàng, rõ lịch trình và dễ lên kế hoạch.</h1>
          <p>
            Từ những bờ biển nhiều nắng đến không khí se lạnh trên cao nguyên, mỗi hành trình đều được sắp xếp
            để bạn dễ xem, dễ chọn và dễ bắt đầu một kỳ nghỉ đúng ý.
          </p>
          <div className="hero-copy__actions">
            <Link className="button button--primary" to="/tours">
              Khám phá tour
            </Link>
            <Link className="button button--ghost" to="/destinations">
              Xem điểm đến
            </Link>
          </div>
        </div>

        <article className="hero-card">
          <img src={heroImage} alt="Khung cảnh du lịch Việt Nam" />
          <strong>Đà Nẵng, Hạ Long, Đà Lạt</strong>
          <p>Những điểm đến nổi bật cho kỳ nghỉ nhẹ nhàng, nhiều trải nghiệm và dễ lên lịch.</p>
        </article>
      </div>
    </section>
  );
}

export default HeroSection;
