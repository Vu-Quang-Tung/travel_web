/* Trang tao thanh toan va xem lich su thanh toan */
import { useEffect, useState } from "react";
import PageHero from "../components/common/PageHero";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { useAuth } from "../context/auth-context";
import { getMyPayments } from "../services/payments.service";
import { formatCurrency } from "../services/api";

function PaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPayments() {
      try {
        const data = await getMyPayments(token);
        setPayments(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, [token]);

  return (
    <main>
      <PageHero
        eyebrow="Thanh toán"
        title="Theo dõi các khoản thanh toán liên quan đến chuyến đi của bạn."
        description="Trang này giúp bạn xem lại những giao dịch đã gửi, trạng thái hiện tại và cách thanh toán đã chọn."
      />

      <section className="section">
        <div className="container">
          {errorMessage ? (
            <ErrorState message={errorMessage} />
          ) : loading ? (
            <LoadingState message="Đang tải lịch sử thanh toán..." />
          ) : !payments.length ? (
            <div className="message-box">Chưa có thông tin thanh toán nào được tạo.</div>
          ) : (
            <div className="data-list">
              {payments.map((payment) => (
                <article key={payment.id} className="card data-row">
                  <div>
                    <p className="card-meta">{payment.transaction_code || "Chưa có mã giao dịch"}</p>
                    <h3>{payment.payment_method}</h3>
                    <p>{formatCurrency(payment.amount)}</p>
                  </div>
                  <div className="data-row__meta">
                    <strong>{payment.status}</strong>
                    <small>{payment.paid_at || "Đang chờ xác nhận"}</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default PaymentsPage;
