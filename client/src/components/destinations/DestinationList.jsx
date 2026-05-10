/* Danh sach diem den, gom xu ly trang thai rong */
import DestinationCard from "./DestinationCard";

function DestinationList({ destinations = [] }) {
  if (!destinations.length) {
    return <div className="message-box">Chưa có điểm đến nào.</div>;
  }

  return (
    <div className="card-grid">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
}

export default DestinationList;
