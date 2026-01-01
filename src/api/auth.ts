import api from "./client";

export type LoginFormValues = {
  email: string;
  password: string;
};

export async function login(data: LoginFormValues) {
  const response = await api.post("/auth/login", data);
  return response.data;
}
