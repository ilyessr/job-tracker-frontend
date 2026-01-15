import api from "./client";

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export async function login(data: LoginFormValues): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}
