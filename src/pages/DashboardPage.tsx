import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  getJobApplications,
  type JobApplication,
  type JobApplicationStatus,
  type PaginatedJobApplications,
  exportJobApplicationsPdf,
} from "../api/jobApplications";
import {
  createJobApplication,
  type CreateJobApplicationPayload,
  updateJobApplication,
} from "../api/jobApplications";
import { getStats } from "../api/stats";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { clearAccessToken } from "../lib/auth";
import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import JobApplicationsSection from "../components/JobApplicationsSection";
import JobApplicationModal from "../components/JobApplicationModal";
import ExportPdfModal from "../components/ExportPdfModal";

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [activeStatus, setActiveStatus] = useState<JobApplicationStatus>("APPLIED");
  const [formErrorMessages, setFormErrorMessages] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateJobApplicationPayload>({
    defaultValues: {
      status: "APPLIED",
      applicationDate: new Date().toISOString().slice(0, 10),
      hadInterview: false,
    },
  });
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });
  const {
    data: applicationsResponse,
    isLoading: isApplicationsLoading,
  } = useQuery<PaginatedJobApplications>({
    queryKey: ["job-applications", page, limit, activeStatus],
    queryFn: () => getJobApplications(page, limit, activeStatus),
    placeholderData: (previous) => previous,
  });

  const { mutateAsync: createApplication } = useMutation({
    mutationFn: createJobApplication,
  });
  const { mutateAsync: updateApplication } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateJobApplicationPayload }) =>
      updateJobApplication(id, payload),
  });

  const onSubmitApplication = async (payload: CreateJobApplicationPayload) => {
    setFormErrorMessages([]);
    try {
      if (editingApplication) {
        await updateApplication({ id: editingApplication.id, payload });
      } else {
        await createApplication(payload);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string[] | string;
      }>;
      const message = axiosError.response?.data?.message;
      if (Array.isArray(message)) {
        setFormErrorMessages(message);
      } else if (typeof message === "string") {
        setFormErrorMessages([message]);
      } else {
        setFormErrorMessages(["Something went wrong."]);
      }
      return;
    }
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["job-applications"] }),
      queryClient.invalidateQueries({ queryKey: ["stats"] }),
    ]);
    if (page !== 1) {
      setPage(1);
    }
    reset({
      status: "APPLIED",
      applicationDate: new Date().toISOString().slice(0, 10),
      company: "",
      jobTitle: "",
      link: "",
      hadInterview: false,
    });
    setEditingApplication(null);
    setIsFormOpen(false);
  };

  const openCreateModal = () => {
    setEditingApplication(null);
    setFormErrorMessages([]);
    reset({
      status: "APPLIED",
      applicationDate: new Date().toISOString().slice(0, 10),
      company: "",
      jobTitle: "",
      link: "",
      hadInterview: false,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (application: JobApplication) => {
    setEditingApplication(application);
    setFormErrorMessages([]);
    reset({
      company: application.company,
      jobTitle: application.jobTitle,
      link: application.link ?? "",
      applicationDate: application.applicationDate.slice(0, 10),
      status: application.status,
      hadInterview: application.hadInterview ?? false,
    });
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingApplication(null);
    setFormErrorMessages([]);
  };

  const openExportModal = () => {
    setExportError(null);
    setIsExportOpen(true);
  };

  const closeExportModal = () => {
    if (isExporting) {
      return;
    }
    setIsExportOpen(false);
  };

  const handleExportPdf = async ({ from, to }: { from?: string; to?: string }) => {
    setExportError(null);
    setIsExporting(true);
    try {
      const { blob, filename } = await exportJobApplicationsPdf({ from, to });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setIsExportOpen(false);
    } catch {
      setExportError("Unable to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const applications = applicationsResponse?.items ?? [];

  return (
    <div className="min-h-screen bg-[#f6f4ef] px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <DashboardHeader
          firstName={user?.firstName}
          onLogout={() => {
            clearAccessToken();
            queryClient.removeQueries({ queryKey: ["me"] });
            navigate("/login", { replace: true });
          }}
        />

        <JobApplicationModal
          isOpen={isFormOpen}
          isSubmitting={isSubmitting}
          editingApplication={editingApplication}
          formErrorMessages={formErrorMessages}
          errors={errors}
          register={register}
          statusOptions={["APPLIED", "INTERVIEW", "REJECTED", "ACCEPTED"]}
          onClose={closeModal}
          onSubmit={handleSubmit(onSubmitApplication)}
        />

        <ExportPdfModal
          isOpen={isExportOpen}
          isExporting={isExporting}
          formError={exportError}
          onClose={closeExportModal}
          onExport={handleExportPdf}
        />

        <DashboardStats stats={stats} isLoading={isStatsLoading} />

        <JobApplicationsSection
          applications={applications}
          isLoading={isApplicationsLoading}
          onCreate={openCreateModal}
          onExport={openExportModal}
          onEdit={openEditModal}
          activeStatus={activeStatus}
          onStatusChange={(status) => {
            setActiveStatus(status);
            setPage(1);
          }}
          page={applicationsResponse?.page ?? page}
          totalPages={applicationsResponse?.totalPages ?? 1}
          total={stats?.totalApplications ?? 0}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
