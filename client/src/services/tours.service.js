/* Request lay danh sach va chi tiet tour */
import { apiFetch } from "./api";

export function getTours() {
  return apiFetch("/tours");
}

export function getTourBySlug(slug) {
  return apiFetch(`/tours/${slug}`);
}
