/* Cac request lien quan den booking cua user */
import { apiFetch } from "./api";

export function createBooking(token, payload) {
  return apiFetch("/bookings", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getMyBookings(token) {
  return apiFetch("/bookings/me", { token });
}

export function getBookingByCode(token, bookingCode) {
  return apiFetch(`/bookings/${bookingCode}`, { token });
}
