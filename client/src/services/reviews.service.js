/* Cac request lay va tao review tour */
import { apiFetch } from "./api";

export function getReviewsByTour(token, tourId) {
  return apiFetch(`/reviews/tour/${tourId}`, { token });
}

export function createReview(token, payload) {
  return apiFetch("/reviews", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}
