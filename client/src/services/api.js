/* Cau hinh base URL va helper fetch dung chung */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL || "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const { token, headers, ...restOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    ...restOptions,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.message || "Không thể tải dữ liệu");
  }

  return response.json();
}

/* Chuyen duong dan upload tu backend thanh URL day du */
export function toAbsoluteAssetUrl(path) {
  if (!path) {
    return "https://placehold.co/900x600/e7e1d7/2b2b2b?text=Travel";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${ASSET_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/* Dinh dang tien te theo kieu Viet Nam */
export function formatCurrency(value) {
  if (value === null || value === undefined) {
    return "Liên hệ";
  }

  return Number(value).toLocaleString("vi-VN") + " VND";
}
