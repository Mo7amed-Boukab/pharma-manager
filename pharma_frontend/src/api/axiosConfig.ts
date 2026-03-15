import axios, { AxiosError } from "axios";
import { clearTokens, getAccessToken } from "../auth/tokenStorage";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((request) => {
  const token = getAccessToken();

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearTokens();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(
  error: unknown,
  fallback = "Une erreur est survenue.",
) {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    const data = axiosError.response?.data;

    if (data && typeof data === "object") {
      if (typeof data.error === "string") {
        return data.error;
      }

      const firstValue = Object.values(data)[0];
      if (typeof firstValue === "string") {
        return firstValue;
      }
      if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
        return firstValue[0];
      }
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  return fallback;
}

export default axiosInstance;
