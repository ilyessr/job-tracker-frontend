import api from "./client";

export type JobApplicationStatus =
  | "APPLIED"
  | "INTERVIEW"
  | "REJECTED"
  | "ACCEPTED";

export type JobApplication = {
  id: string;
  company: string;
  jobTitle: string;
  link?: string | null;
  applicationDate: string;
  status: JobApplicationStatus;
  hadInterview: boolean;
};

export type PaginatedJobApplications = {
  items: JobApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateJobApplicationPayload = {
  company: string;
  jobTitle: string;
  link?: string;
  applicationDate: string;
  status: JobApplicationStatus;
  hadInterview: boolean;
};

export type UpdateJobApplicationPayload = Partial<CreateJobApplicationPayload>;

export type ExportJobApplicationsParams = {
  from?: string;
  to?: string;
  status?: JobApplicationStatus;
};

export async function getJobApplications(
  page = 1,
  limit = 20,
  status?: JobApplicationStatus,
): Promise<PaginatedJobApplications> {
  const response = await api.get<PaginatedJobApplications>("/job-applications", {
    params: { page, limit, status },
  });
  return response.data;
}

export async function createJobApplication(
  payload: CreateJobApplicationPayload,
): Promise<JobApplication> {
  const response = await api.post<JobApplication>("/job-applications", payload);
  return response.data;
}

export async function updateJobApplication(
  id: string,
  payload: UpdateJobApplicationPayload,
): Promise<JobApplication> {
  const response = await api.put<JobApplication>(
    `/job-applications/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteJobApplication(id: string): Promise<void> {
  await api.delete(`/job-applications/${id}`);
}

export async function exportJobApplicationsPdf(
  params: ExportJobApplicationsParams,
): Promise<{ blob: Blob; filename: string }> {
  const response = await api.get("/job-applications/export/pdf", {
    params,
    responseType: "blob",
  });

  const contentDisposition = response.headers["content-disposition"] as string | undefined;
  const filenameMatch = contentDisposition?.match(/filename=\"?([^\";]+)\"?/i);
  const filename = filenameMatch?.[1] ?? "job-applications.pdf";

  return { blob: response.data, filename };
}
