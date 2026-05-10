/* Trang tai khoan: xem va cap nhat thong tin ca nhan */
import { useEffect, useState } from "react";
import PageHero from "../components/common/PageHero";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import { useAuth } from "../context/auth-context";
import { updateMyPassword, updateMyProfile } from "../services/user.service";

function AccountPage() {
  const { token, user, setUser, refreshProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({ full_name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "" });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setLoadingProfile(true);
    setErrorMessage("");
    setMessage("");

    try {
      const data = await updateMyProfile(token, profileForm);
      setUser((current) => ({
        ...current,
        full_name: data.user.full_name,
        phone: data.user.phone,
      }));
      setMessage("Cập nhật hồ sơ thành công.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setLoadingPassword(true);
    setErrorMessage("");
    setMessage("");

    try {
      await updateMyPassword(token, passwordForm);
      setPasswordForm({ current_password: "", new_password: "" });
      setMessage("Đổi mật khẩu thành công.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoadingPassword(false);
    }
  }

  if (!user) {
    return (
      <main>
        <PageHero eyebrow="Tài khoản" title="Đang tải tài khoản..." />
        <section className="section">
          <div className="container">
            <LoadingState />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHero eyebrow="Tài khoản" title={user.full_name} description={`${user.email} • ${user.role}`} />

      <section className="section">
        <div className="container split-panels">
          <form className="card detail-card form-grid" onSubmit={handleProfileSubmit}>
            <h3>Thông tin liên hệ</h3>
            {message ? <div className="message-box">{message}</div> : null}
            {errorMessage ? <ErrorState message={errorMessage} /> : null}
            <label>
              Họ tên
              <input
                value={profileForm.full_name}
                onChange={(event) => setProfileForm((current) => ({ ...current, full_name: event.target.value }))}
              />
            </label>
            <label>
              Số điện thoại
              <input
                value={profileForm.phone}
                onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
              />
            </label>
            <button className="button button--primary" disabled={loadingProfile}>
              {loadingProfile ? "Đang lưu..." : "Lưu thông tin"}
            </button>
          </form>

          <form className="card detail-card form-grid" onSubmit={handlePasswordSubmit}>
            <h3>Đổi mật khẩu</h3>
            <label>
              Mật khẩu hiện tại
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(event) =>
                  setPasswordForm((current) => ({ ...current, current_password: event.target.value }))
                }
              />
            </label>
            <label>
              Mật khẩu mới
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(event) =>
                  setPasswordForm((current) => ({ ...current, new_password: event.target.value }))
                }
              />
            </label>
            <button className="button button--ghost" disabled={loadingPassword}>
              {loadingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default AccountPage;
