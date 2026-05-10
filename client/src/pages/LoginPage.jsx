/* Trang dang nhap va dieu huong theo role sau khi login */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import ErrorState from "../components/common/ErrorState";
import { useAuth } from "../context/auth-context";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await login(form);
      navigate(data.user.role === "admin" ? "/admin" : "/account");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHero eyebrow="Đăng nhập" title="Đăng nhập để lưu hành trình và quản lý thông tin chuyến đi" />

      <section className="section auth-shell">
        <form className="auth-card form-grid" onSubmit={handleSubmit}>
          {errorMessage ? <ErrorState message={errorMessage} /> : null}
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
            Mật khẩu
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>
          <button className="button button--primary button--block" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <div className="auth-links">
            <Link to="/forgot-password">Quen mat khau?</Link>
            <span>Chua co tai khoan?</span>
            <Link to="/register">Dang ky ngay</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
