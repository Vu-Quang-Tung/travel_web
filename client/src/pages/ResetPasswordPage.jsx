/* Trang dat lai mat khau tu token trong email */
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import ErrorState from "../components/common/ErrorState";
import { resetPassword } from "../services/auth.service";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const token = searchParams.get("token");

    if (!token) {
      setErrorMessage("Reset token is missing.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      setLoading(false);
      return;
    }

    try {
      const data = await resetPassword({ token, password });
      setSuccessMessage(data.message);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <PageHero eyebrow="Reset password" title="Create a new password for your account" />

      <section className="section auth-shell">
        <form className="auth-card form-grid" onSubmit={handleSubmit}>
          {errorMessage ? <ErrorState message={errorMessage} /> : null}
          {successMessage ? <p className="success-message">{successMessage}</p> : null}
          <label>
            New password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>
          <button className="button button--primary button--block" disabled={loading}>
            {loading ? "Updating password..." : "Reset password"}
          </button>
          <div className="auth-links">
            <Link to="/login">Back to login</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ResetPasswordPage;
