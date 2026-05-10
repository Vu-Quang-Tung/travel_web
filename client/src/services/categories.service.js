/* Request lay danh muc tour public */
import { apiFetch } from "./api";

export function getCategories() {
  return apiFetch("/categories");
}
