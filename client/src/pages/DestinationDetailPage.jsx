/* Trang chi tiet diem den theo slug */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { getDestinationBySlug } from "../services/destinations.service";
import { toAbsoluteAssetUrl } from "../services/api";

function DestinationDetailPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDestination() {
      try {
        const data = await getDestinationBySlug(slug);
        setDestination(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadDestination();
  }, [slug]);

  if (errorMessage) {
    return (
      <main>
        <PageHero eyebrow="Điểm đến" title="Không thể tải điểm đến" description={errorMessage} />
      </main>
    );
  }

  if (loading || !destination) {
    return (
      <main>
        <PageHero eyebrow="Điểm đến" title="Đang tải..." />
        <section className="section">
          <div className="container">
            <LoadingState message="Đang tải chi tiết điểm đến..." />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHero
        eyebrow="Chi tiết điểm đến"
        title={destination.name}
        description={`${destination.city || destination.country} • ${destination.best_season || "Đang cập nhật"}`}
      />

      <section className="section">
        <div className="container detail-layout detail-layout--single">
          <article className="detail-main">
            <div className="detail-hero">
              <img src={toAbsoluteAssetUrl(destination.hero_image_url)} alt={destination.name} />
            </div>
            <div className="detail-content">
              <p className="card-meta">Mùa đẹp: {destination.best_season || "Đang cập nhật"}</p>
              <h3>{destination.short_description || `Cảm hứng du lịch tại ${destination.name}`}</h3>
              <p>{destination.description || "Điểm đến này đang được cập nhật thông tin chi tiết."}</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default DestinationDetailPage;
