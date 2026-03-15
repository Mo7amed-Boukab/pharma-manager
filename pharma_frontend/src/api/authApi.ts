import axiosInstance from "./axiosConfig";

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  password: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

interface AuthTokensResponse {
  access: string;
  refresh: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export async function login(payload: LoginPayload) {
  const response = await axiosInstance.post<AuthTokensResponse>(
    "/auth/token/",
    payload,
  );
  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await axiosInstance.post<AuthTokensResponse>(
    "/auth/register/",
    payload,
  );
  return response.data;
}

export async function fetchMe() {
  const response = await axiosInstance.get<AuthUser>("/auth/me/");
  return response.data;
}
