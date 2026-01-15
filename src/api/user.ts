import api from "./client";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}
