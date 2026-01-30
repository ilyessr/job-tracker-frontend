import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { JobApplication, JobApplicationStatus } from "../api/jobApplications";

type JobApplicationsSectionProps = {
  applications?: JobApplication[];
  isLoading: boolean;
  onCreate: () => void;
  onExport: () => void;
  onEdit: (application: JobApplication) => void;
  activeStatus: JobApplicationStatus;
  onStatusChange: (status: JobApplicationStatus) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

const statusStyles: Record<string, string> = {
  APPLIED: "bg-slate-900 text-white",
  INTERVIEW: "bg-amber-400/20 text-amber-800",
  REJECTED: "bg-rose-500/15 text-rose-700",
  ACCEPTED: "bg-emerald-600 text-white",
};

const statusTabs: JobApplicationStatus[] = [
  "APPLIED",
  "INTERVIEW",
  "REJECTED",
  "ACCEPTED",
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SortableJobRow({
  application,
  onEdit,
}: {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const badgeStyle = statusStyles[application.status] ?? "bg-slate-100 text-slate-700";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid cursor-grab grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm active:cursor-grabbing md:grid-cols-[1.4fr_1.2fr_0.8fr_0.8fr_0.6fr_0.4fr] ${
        isDragging ? "opacity-60" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">{application.company}</p>
        <p className="text-xs text-slate-500">{application.jobTitle}</p>
      </div>
      <div className="text-sm text-slate-700">
        {application.link ? (
          <a
            href={application.link}
            className="text-slate-900 underline decoration-slate-400 underline-offset-4 transition hover:decoration-slate-900"
            target="_blank"
            rel="noreferrer"
          >
            View posting
          </a>
        ) : (
          <span className="text-slate-400">Link unavailable</span>
        )}
      </div>
      <div className="text-sm text-slate-700">{formatDate(application.applicationDate)}</div>
      <div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}
        >
          {application.status}
        </span>
      </div>
      <div className="text-sm text-slate-700">
        {application.hadInterview ? (
          <span className="inline-flex items-center gap-2 text-emerald-700">
            <span>✅</span>
            <span>Interviewed</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-rose-600">
            <span>❌</span>
            <span>No interviews</span>
          </span>
        )}
      </div>
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => onEdit(application)}
          className="btn btn-pill btn-xs btn-outline text-slate-600"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default function JobApplicationsSection({
  applications,
  isLoading,
  onCreate,
  onExport,
  onEdit,
  activeStatus,
  onStatusChange,
  page,
  totalPages,
  total,
  onPageChange,
}: JobApplicationsSectionProps) {
  const [orderByStatus, setOrderByStatus] = useState<
    Partial<Record<JobApplicationStatus, string[]>>
  >({});
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const filteredApplications = useMemo(() => {
    if (!applications?.length) {
      return [];
    }
    return applications.filter((application) => application.status === activeStatus);
  }, [applications, activeStatus]);

  useEffect(() => {
    if (!applications?.length) {
      return;
    }

    setOrderByStatus((prev) => {
      const next = { ...prev };
      const ids = applications
        .filter((application) => application.status === activeStatus)
        .map((application) => application.id);
      if (!next[activeStatus]) {
        next[activeStatus] = ids;
        return next;
      }
      const existing = next[activeStatus] ?? [];
      const normalized = existing.filter((id) => ids.includes(id));
      const additions = ids.filter((id) => !normalized.includes(id));
      next[activeStatus] = [...normalized, ...additions];
      return next;
    });
  }, [applications, activeStatus]);

  const orderedApplications = useMemo(() => {
    if (!filteredApplications.length) {
      return [];
    }
    const order = orderByStatus[activeStatus];
    if (!order?.length) {
      return filteredApplications;
    }
    const byId = new Map(filteredApplications.map((application) => [application.id, application]));
    return order.map((id) => byId.get(id)).filter(Boolean) as JobApplication[];
  }, [filteredApplications, orderByStatus, activeStatus]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) {
      return;
    }
    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    if (activeId === overId) {
      return;
    }
    setOrderByStatus((prev) => {
      const current = prev[activeStatus] ?? orderedApplications.map((app) => app.id);
      const oldIndex = current.indexOf(activeId);
      const newIndex = current.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) {
        return prev;
      }
      return {
        ...prev,
        [activeStatus]: arrayMove(current, oldIndex, newIndex),
      };
    });
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Applications list</h2>
          <p className="text-sm text-slate-500">Review and keep your pipeline up to date.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-500">{total} applications</p>
          <button type="button" onClick={onCreate} className="btn btn-pill btn-md btn-primary">
            New application
          </button>
          <button type="button" onClick={onExport} className="btn btn-pill btn-md btn-outline">
            Export PDF
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {statusTabs.map((status) => {
          const isActive = activeStatus === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => {
                onStatusChange(status);
              }}
              className={`btn rounded-full px-4 py-2 text-xs font-semibold transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && <p className="text-sm text-slate-400">Loading applications...</p>}
        {!isLoading && orderedApplications.length ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedApplications.map((application) => application.id)}
              strategy={verticalListSortingStrategy}
            >
              {orderedApplications.map((application) => (
                <SortableJobRow
                  key={application.id}
                  application={application}
                  onEdit={onEdit}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : null}
        {!isLoading && !orderedApplications.length && (
          <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-sm text-slate-500">
            No applications in this status. Add one to get started.
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-pill btn-sm btn-outline"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-pill btn-sm btn-outline"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
