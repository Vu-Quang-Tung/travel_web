/* Card hien thi thong tin tom tat cua mot diem den */
import { Link } from "react-router-dom";
import { toAbsoluteAssetUrl } from "../../services/api";

function DestinationCard({ destination }) {
  return (
    <article className="card destination-card">
      <img
        className="destination-card__media"
        src={toAbsoluteAssetUrl(destination.hero_image_url)}
        alt={destination.name}
      />
      <div className="destination-card__body">
        <p className="card-meta">{destination.city || destination.country}</p>
        <h3>{destination.name}</h3>
        <p>{destination.short_description}</p>
        <small>Mùa đẹp: {destination.best_season || "Đang cập nhật"}</small>
        <div className="destination-card__actions">
          <Link className="button button--ghost button--small" to={`/destinations/${destination.slug}`}>
            Xem điểm đến
          </Link>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;
