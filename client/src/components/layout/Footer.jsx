/* Footer hien thi thong tin thuong hieu va lien ket cuoi trang */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <strong>Travel Web</strong>
          <p>Những hành trình du lịch dễ chọn, dễ xem và dễ lên lịch cho kỳ nghỉ tiếp theo.</p>
        </div>
        <div className="footer-links">
          <a href="/about">Giới thiệu</a>
          <a href="/categories">Loại tour</a>
          <a href="/contact">Liên hệ</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
