/* Trang gui yeu cau quen mat khau */
import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import ErrorState from "../components/common/ErrorState";
import { forgotPassword } from "../services/auth.service";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await forgotPassword({ email });
      setSuccessMessage(data.message);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHero eyebrow="Quen mat khau" title="Lay lai quyen truy cap tai khoan cua ban" />

      <section className="section auth-shell">
        <form className="auth-card form-grid" onSubmit={handleSubmit}>
          <h3>Nhap email da dang ky</h3>
          {errorMessage ? <ErrorState message={errorMessage} /> : null}
          {successMessage ? <p className="success-message">{successMessage}</p> : null}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button className="button button--primary button--block" disabled={loading}>
            {loading ? "Dang kiem tra..." : "Gui yeu cau"}
          </button>
          <div className="auth-links">
            <Link to="/login">Quay lai dang nhap</Link>
            <Link to="/register">Tao tai khoan moi</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
