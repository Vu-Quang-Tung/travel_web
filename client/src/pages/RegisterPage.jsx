/* Trang dang ky tai khoan khach hang */
import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import ErrorState from "../components/common/ErrorState";
import { useAuth } from "../context/auth-context";

function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await register(form);
      setSuccessMessage(data.message);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHero eyebrow="Đăng ký" title="Tạo tài khoản để sẵn sàng cho chuyến đi tiếp theo" />

      <section className="section auth-shell">
        <form className="auth-card form-grid" onSubmit={handleSubmit}>
          <h3>Bắt đầu hành trình của bạn</h3>
          {errorMessage ? <ErrorState message={errorMessage} /> : null}
          {successMessage ? <p className="success-message">{successMessage}</p> : null}
          <label>
            Họ tên
            <input
              value={form.full_name}
              onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
          <label>
            Số điện thoại
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            />
          </label>
          <label>
            Mật khẩu
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>
          <button className="button button--primary button--block" disabled={loading}>
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
          <div className="auth-links">
            <span>Da co tai khoan?</span>
            <Link to="/login">Dang nhap</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;
