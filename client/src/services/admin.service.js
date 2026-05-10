/* Cac request danh cho dashboard admin */
import { apiFetch } from "./api";

export function getAdminTours(token) {
  return apiFetch("/admin/tour", { token });
}

export function getAdminTourById(token, id) {
  return apiFetch(`/admin/tour/${id}`, { token });
}

export function createAdminTour(token, payload) {
  return apiFetch("/admin/tour", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateAdminTour(token, id, payload) {
  return apiFetch(`/admin/tour/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteAdminTour(token, id) {
  return apiFetch(`/admin/tour/${id}`, {
    method: "DELETE",
    token,
  });
}

export function createAdminSchedule(token, tourId, payload) {
  return apiFetch(`/admin/tour/${tourId}/schedules`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateAdminSchedule(token, tourId, scheduleId, payload) {
  return apiFetch(`/admin/tour/${tourId}/schedules/${scheduleId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteAdminSchedule(token, tourId, scheduleId) {
  return apiFetch(`/admin/tour/${tourId}/schedules/${scheduleId}`, {
    method: "DELETE",
    token,
  });
}

export function createAdminItinerary(token, tourId, payload) {
  return apiFetch(`/admin/tour/${tourId}/itinerary`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateAdminItinerary(token, tourId, itineraryId, payload) {
  return apiFetch(`/admin/tour/${tourId}/itinerary/${itineraryId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteAdminItinerary(token, tourId, itineraryId) {
  return apiFetch(`/admin/tour/${tourId}/itinerary/${itineraryId}`, {
    method: "DELETE",
    token,
  });
}

export function createAdminImage(token, tourId, payload) {
  return apiFetch(`/admin/tour/${tourId}/images`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateAdminImage(token, tourId, imageId, payload) {
  return apiFetch(`/admin/tour/${tourId}/images/${imageId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteAdminImage(token, tourId, imageId) {
  return apiFetch(`/admin/tour/${tourId}/images/${imageId}`, {
    method: "DELETE",
    token,
  });
}

export function getAdminDestinations(token) {
  return apiFetch("/admin/destination", { token });
}

export function createAdminDestination(token, payload) {
  return apiFetch("/admin/destination", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateAdminDestination(token, id, payload) {
  return apiFetch(`/admin/destination/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteAdminDestination(token, id) {
  return apiFetch(`/admin/destination/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getAdminCategories(token) {
  return apiFetch("/admin/categories", { token });
}

export function createAdminCategory(token, payload) {
  return apiFetch("/admin/categories", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateAdminCategory(token, id, payload) {
  return apiFetch(`/admin/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteAdminCategory(token, id) {
  return apiFetch(`/admin/categories/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getAdminReviews(token) {
  return apiFetch("/admin/reviews", { token });
}

export function publishAdminReview(token, id) {
  return apiFetch(`/admin/reviews/${id}/publish`, {
    method: "PUT",
    token,
  });
}

export function hideAdminReview(token, id) {
  return apiFetch(`/admin/reviews/${id}/hide`, {
    method: "PUT",
    token,
  });
}

export function deleteAdminReview(token, id) {
  return apiFetch(`/admin/reviews/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getAdminPayments(token) {
  return apiFetch("/admin/payments", { token });
}

export function confirmAdminPayment(token, id) {
  return apiFetch(`/admin/payments/${id}/confirm`, {
    method: "PUT",
    token,
  });
}

export function failAdminPayment(token, id) {
  return apiFetch(`/admin/payments/${id}/fail`, {
    method: "PUT",
    token,
  });
}
