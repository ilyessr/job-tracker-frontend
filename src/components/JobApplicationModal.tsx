import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FiX } from "react-icons/fi";
import type {
  CreateJobApplicationPayload,
  JobApplication,
  JobApplicationStatus,
} from "../api/jobApplications";

type JobApplicationModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  editingApplication: JobApplication | null;
  formErrorMessages: string[];
  errors: FieldErrors<CreateJobApplicationPayload>;
  register: UseFormRegister<CreateJobApplicationPayload>;
  statusOptions: JobApplicationStatus[];
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function JobApplicationModal({
  isOpen,
  isSubmitting,
  editingApplication,
  formErrorMessages,
  errors,
  register,
  statusOptions,
  onClose,
  onSubmit,
}: JobApplicationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingApplication ? "Edit application" : "Add application"}
            </h2>
            <p className="text-sm text-slate-500">
              Fill in the key details.
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {formErrorMessages.length > 0 && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <ul className="list-disc space-y-1 pl-4">
              {formErrorMessages.map((message, index) => (
                <li key={`${message}-${index}`}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Company
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Meta"
              {...register("company", { required: "Company is required" })}
              disabled={isSubmitting}
            />
            {errors.company && (
              <p className="mt-2 text-xs text-red-500">{errors.company.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Role
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Frontend Engineer"
              {...register("jobTitle", { required: "Role is required" })}
              disabled={isSubmitting}
            />
            {errors.jobTitle && (
              <p className="mt-2 text-xs text-red-500">{errors.jobTitle.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Link
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="https://example.com"
              {...register("link")}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Date
            </label>
            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              {...register("applicationDate", { required: "Date is required" })}
              disabled={isSubmitting}
            />
            {errors.applicationDate && (
              <p className="mt-2 text-xs text-red-500">{errors.applicationDate.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Status
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              {...register("status", { required: "Status is required" })}
              disabled={isSubmitting}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col-reverse items-stretch justify-end gap-3 md:col-span-2 md:flex-row md:items-center">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-rect btn-lg btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-rect btn-lg btn-primary btn-block md:w-auto"
            >
              {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </span>
                ) : editingApplication ? (
                "Update application"
              ) : (
                "Create application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
