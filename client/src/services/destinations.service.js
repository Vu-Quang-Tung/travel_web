/* Request lay danh sach va chi tiet diem den */
import { apiFetch } from "./api";

export function getDestinations() {
  return apiFetch("/destinations");
}

export function getDestinationBySlug(slug) {
  return apiFetch(`/destinations/${slug}`);
}
