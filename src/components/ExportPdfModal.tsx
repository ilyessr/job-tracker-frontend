import { FiX } from "react-icons/fi";

type ExportPdfModalProps = {
  isOpen: boolean;
  isExporting: boolean;
  formError?: string | null;
  onClose: () => void;
  onExport: (params: { from?: string; to?: string }) => void;
};

export default function ExportPdfModal({
  isOpen,
  isExporting,
  formError,
  onClose,
  onExport,
}: ExportPdfModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Export PDF</h2>
            <p className="text-sm text-slate-500">
              Select a period to export your applications.
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {formError ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        ) : null}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);
            const from = (formData.get("from") as string) || undefined;
            const to = (formData.get("to") as string) || undefined;
            onExport({ from, to });
          }}
          className="mt-6 grid grid-cols-1 gap-4"
        >
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              From
            </label>
            <input
              name="from"
              type="date"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              disabled={isExporting}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              To
            </label>
            <input
              name="to"
              type="date"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              disabled={isExporting}
            />
          </div>

          <div className="flex flex-col-reverse items-stretch justify-end gap-3 md:flex-row md:items-center">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-rect btn-lg btn-outline"
              disabled={isExporting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isExporting}
              className="btn btn-rect btn-lg btn-primary btn-block md:w-auto"
            >
              {isExporting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Exporting...
                </span>
              ) : (
                "Export PDF"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
