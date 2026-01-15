import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/user";
import { getAccessToken } from "../lib/auth";

export function useCurrentUser() {
  const token = getAccessToken();

  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: Boolean(token),
    retry: false,
  });
}
