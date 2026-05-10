/* Cac request cap nhat thong tin tai khoan */
import { apiFetch } from "./api";

export function getMyProfile(token) {
  return apiFetch("/users/me", { token });
}

export function updateMyProfile(token, payload) {
  return apiFetch("/users/me", {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateMyPassword(token, payload) {
  return apiFetch("/users/me/password", {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}
