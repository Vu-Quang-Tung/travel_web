/* Card hien thi thong tin tom tat cua mot tour */
import { Link } from "react-router-dom";
import { formatCurrency, toAbsoluteAssetUrl } from "../../services/api";

function TourCard({ tour }) {
  return (
    <article className="card tour-card">
      <div className="tour-card__media">
        <img src={toAbsoluteAssetUrl(tour.destination_hero_image_url)} alt={tour.title} />
        {tour.featured ? <span className="tour-badge">Nổi bật</span> : null}
      </div>
      <div className="tour-card__body">
        <p className="card-meta">{tour.destination_name}</p>
        <h3>{tour.title}</h3>
        <p>{tour.summary}</p>
        <div className="tour-card__info">
          <span>
            {tour.duration_days} ngày {tour.duration_nights} đêm
          </span>
          <strong>{formatCurrency(tour.base_price)}</strong>
        </div>
        <Link className="button button--primary button--block" to={`/tours/${tour.slug}`}>
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}

export default TourCard;
