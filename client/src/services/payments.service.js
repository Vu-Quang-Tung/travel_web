/* Cac request tao va xem thanh toan */
import { apiFetch } from "./api";

export function createPayment(token, payload) {
  return apiFetch("/payments", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getMyPayments(token) {
  return apiFetch("/payments/me", { token });
}
