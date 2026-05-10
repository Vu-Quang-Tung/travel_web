/* Trang xac minh email tu token trong link */
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { verifyEmail } from "../services/auth.service";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function submitToken() {
      const token = searchParams.get("token");

      if (!token) {
        setErrorMessage("Verification token is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await verifyEmail({ token });
        setSuccessMessage(data.message);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    submitToken();
  }, [searchParams]);

  return (
    <main>
      <PageHero eyebrow="Verify email" title="Confirm your Travel Web account" />

      <section className="section auth-shell">
        <div className="auth-card form-grid">
          {loading ? <LoadingState message="Verifying your email..." /> : null}
          {errorMessage ? <ErrorState message={errorMessage} /> : null}
          {successMessage ? <p className="success-message">{successMessage}</p> : null}
          <div className="auth-links">
            <Link to="/login">Go to login</Link>
            <Link to="/register">Create another account</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default VerifyEmailPage;
