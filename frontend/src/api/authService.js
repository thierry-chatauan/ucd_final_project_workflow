import { apiClient } from "./apiClient";

export async function login(username, password) {
  // clear old tokens first
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  const data = await apiClient("/api/token/", {
    method: "POST",
    headers: { Authorization: undefined }, // no token here
    body: JSON.stringify({ username, password }),
  });

  // ✅ save tokens
  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);

  return data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function refreshToken() {
  const refresh = localStorage.getItem("refreshToken");

  const data = await apiClient("/api/token/refresh/", {
    method: "POST",
    headers: { Authorization: undefined },
    body: JSON.stringify({ refresh }),
  });

  // ✅ refresh endpoint returns a new access token
  localStorage.setItem("accessToken", data.access);

  return data;
}

export function getMe() {
  return apiClient("/api/me/");
}

export async function signup({ username, email, password }) {
  return apiClient("/api/signup/", {
    method: "POST",
    headers: { Authorization: undefined },
    body: JSON.stringify({ username, email, password }),
  });
}
