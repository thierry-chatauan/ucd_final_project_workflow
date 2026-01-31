const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");


export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "API request failed");
  }

  // ✅ HANDLE NO CONTENT (DELETE, etc.)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
