/* Trang danh sach diem den public */
import { useEffect, useState } from "react";
import PageHero from "../components/common/PageHero";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import DestinationList from "../components/destinations/DestinationList";
import { getDestinations } from "../services/destinations.service";

function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDestinations() {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadDestinations();
  }, []);

  return (
    <main>
      <PageHero
        eyebrow="Điểm đến"
        title="Khám phá những điểm đến để bắt đầu một kỳ nghỉ đúng ý"
        description="Mỗi nơi đều có một sắc thái riêng, từ thành phố biển nhiều nắng đến khung cảnh se lạnh và lãng mạn."
      />

      <section className="section">
        <div className="container">
          {errorMessage ? (
            <ErrorState message={errorMessage} />
          ) : loading ? (
            <LoadingState message="Đang tải điểm đến..." />
          ) : (
            <DestinationList destinations={destinations} />
          )}
        </div>
      </section>
    </main>
  );
}

export default DestinationsPage;
