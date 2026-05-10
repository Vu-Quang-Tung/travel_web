/* Trang chu tong hop tour noi bat va diem den */
import { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection";
import TourList from "../components/tours/TourList";
import DestinationList from "../components/destinations/DestinationList";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { getTours } from "../services/tours.service";
import { getDestinations } from "../services/destinations.service";
import { getCategories } from "../services/categories.service";

function HomePage() {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [tourData, destinationData, categoryData] = await Promise.all([
          getTours(),
          getDestinations(),
          getCategories(),
        ]);

        setTours(tourData.slice(0, 3));
        setDestinations(destinationData.slice(0, 3));
        setCategories(categoryData.slice(0, 4));
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main>
      <HeroSection />

      <section className="section">
        <div className="container intro-grid">
          <div>
            <p className="section-kicker">Cảm hứng cho kỳ nghỉ</p>
            <h2 className="section-title">
              Những chuyến đi được sắp xếp gọn gàng cho người muốn nghỉ ngơi đúng nghĩa.
            </h2>
          </div>
          <p className="section-copy">
            Bạn có thể bắt đầu từ một bờ biển đầy nắng, một đêm trên vịnh, hay một hành trình nhẹ giữa rừng thông.
            Mỗi tour đều có thông tin rõ về điểm đến, lịch trình và thời gian khởi hành.
          </p>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="stats-grid">
            {categories.map((category) => (
              <article key={category.id} className="hero-card">
                <span>{category.slug}</span>
                <strong>{category.name}</strong>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-kicker">Tour nổi bật</p>
              <h2 className="section-title">Những hành trình đang được nhiều người quan tâm</h2>
            </div>
          </div>
          {errorMessage ? (
            <ErrorState message={errorMessage} />
          ) : loading ? (
            <LoadingState />
          ) : (
            <TourList tours={tours} />
          )}
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-kicker">Điểm đến</p>
              <h2 className="section-title">Những điểm đến để bắt đầu một kỳ nghỉ nhẹ nhàng</h2>
            </div>
          </div>
          {errorMessage ? (
            <ErrorState message={errorMessage} />
          ) : loading ? (
            <LoadingState />
          ) : (
            <DestinationList destinations={destinations} />
          )}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
