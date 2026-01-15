import api from "./client";

export type StatsResponse = {
  byMonth: Array<{ month: string; count: number }>;
  byStatus: Record<string, number>;
  interviewTotal: number;
  interviewByMonth: Array<{ month: string; count: number }>;
  interviewRate: number;
  averagePerMonth: number;
};

export async function getStats(): Promise<StatsResponse> {
  const response = await api.get<StatsResponse>("/stats");
  return response.data;
}
