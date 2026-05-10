/* Hien thi trang thai dang tai du lieu dung chung */
function LoadingState({ message = "Đang tải dữ liệu..." }) {
  return <div className="message-box">{message}</div>;
}

export default LoadingState;
