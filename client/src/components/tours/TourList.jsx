/* Danh sach tour, gom xu ly trang thai rong */
import TourCard from "./TourCard";

function TourList({ tours = [] }) {
  if (!tours.length) {
    return <div className="message-box">Chưa có tour nào đang mở.</div>;
  }

  return (
    <div className="card-grid">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}

export default TourList;
