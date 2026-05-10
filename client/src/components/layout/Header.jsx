/* Header dieu huong chinh, xu ly menu mobile va trang thai dang nhap */
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink className="brand" to="/" onClick={closeMenu}>
          <span className="brand__mark">TV</span>
          <span>
            <strong>Travel Web</strong>
            <small>Hành trình nhỏ, trải nghiệm trọn vẹn</small>
          </span>
        </NavLink>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-expanded={isMenuOpen}
          aria-label="Mở menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`site-header__panel ${isMenuOpen ? "site-header__panel--open" : ""}`}>
          <nav className="site-nav">
            <NavLink to="/" onClick={closeMenu}>Trang chủ</NavLink>
            <NavLink to="/about" onClick={closeMenu}>Giới thiệu</NavLink>
            <NavLink to="/categories" onClick={closeMenu}>Loại tour</NavLink>
            <NavLink to="/tours" onClick={closeMenu}>Tour</NavLink>
            <NavLink to="/destinations" onClick={closeMenu}>Điểm đến</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Liên hệ</NavLink>
            {isAuthenticated ? <NavLink to="/bookings" onClick={closeMenu}>Booking của tôi</NavLink> : null}
            {isAuthenticated ? <NavLink to="/payments" onClick={closeMenu}>Thanh toán</NavLink> : null}
            {isAdmin ? <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink> : null}
          </nav>

          <div className="site-actions">
            {isAuthenticated ? (
              <>
                <NavLink className="site-user" to="/account" onClick={closeMenu}>
                  {user?.full_name || "Tài khoản"}
                </NavLink>
                <button className="button button--ghost button--small" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <NavLink className="button button--ghost button--small" to="/login" onClick={closeMenu}>
                  Đăng nhập
                </NavLink>
                <NavLink className="button button--primary button--small" to="/register" onClick={closeMenu}>
                  Đăng ký
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
