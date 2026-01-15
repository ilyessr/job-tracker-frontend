import { useMemo } from "react";
import type { StatsResponse } from "../api/stats";

type DashboardStatsProps = {
  stats?: StatsResponse;
  isLoading: boolean;
};

export default function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const maxMonthly = useMemo(() => {
    if (!stats?.byMonth.length) {
      return 0;
    }
    return Math.max(...stats.byMonth.map((entry) => entry.count));
  }, [stats]);

  const totalApplications = useMemo(() => {
    if (!stats?.byMonth.length) {
      return 0;
    }
    return stats.byMonth.reduce((total, entry) => total + entry.count, 0);
  }, [stats]);

  const statusEntries = useMemo(() => {
    if (!stats?.byStatus) {
      return [];
    }
    return Object.entries(stats.byStatus).sort((a, b) => b[1] - a[1]);
  }, [stats]);

  const linePath = useMemo(() => {
    if (!stats?.byMonth?.length || maxMonthly === 0) {
      return "";
    }
    const points = stats.byMonth.map((entry, index) => {
      const x = stats.byMonth.length === 1 ? 50 : (index / (stats.byMonth.length - 1)) * 100;
      const y = 36 - (entry.count / maxMonthly) * 30;
      return { x, y };
    });
    return points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
  }, [stats, maxMonthly]);

  const areaPath = useMemo(() => {
    if (!linePath || !stats?.byMonth?.length) {
      return "";
    }
    const firstX = stats.byMonth.length === 1 ? 50 : 0;
    const lastX = stats.byMonth.length === 1 ? 50 : 100;
    return `${linePath} L ${lastX} 40 L ${firstX} 40 Z`;
  }, [linePath, stats]);

  const interviewLinePath = useMemo(() => {
    if (!stats?.interviewByMonth?.length || maxMonthly === 0) {
      return "";
    }
    const points = stats.interviewByMonth.map((entry, index) => {
      const x =
        stats.interviewByMonth.length === 1
          ? 50
          : (index / (stats.interviewByMonth.length - 1)) * 100;
      const y = 36 - (entry.count / maxMonthly) * 30;
      return { x, y };
    });
    return points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
  }, [stats, maxMonthly]);

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {totalApplications}
          </p>
          <p className="mt-2 text-sm text-slate-500">Applications sent</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Average</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {stats?.averagePerMonth ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-500">Per month</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Interview rate
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {stats?.interviewRate ?? 0}%
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {stats?.interviewTotal ?? 0} interviews total
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Monthly activity</h2>
              <p className="text-sm text-slate-500">Applications vs interviews</p>
            </div>
          </div>

          <div className="mt-6">
            {isLoading && <p className="text-sm text-slate-400">Loading stats...</p>}
            {!isLoading && stats?.byMonth?.length ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <svg viewBox="0 0 100 40" className="h-40 w-full">
                  <defs>
                    <linearGradient id="monthlyArea" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#0f172a" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#monthlyArea)" />
                  <path d={linePath} fill="none" stroke="#0f172a" strokeWidth="1.5" />
                  {interviewLinePath && (
                    <path
                      d={interviewLinePath}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                  )}
                  {stats.byMonth.map((entry, index) => {
                    const x = stats.byMonth.length === 1 ? 50 : (index / (stats.byMonth.length - 1)) * 100;
                    const y = 36 - (entry.count / maxMonthly) * 30;
                    return (
                      <circle
                        key={entry.month}
                        cx={x}
                        cy={y}
                        r="1.6"
                        fill="#0f172a"
                      />
                    );
                  })}
                  {stats.interviewByMonth?.map((entry, index) => {
                    const x =
                      stats.interviewByMonth.length === 1
                        ? 50
                        : (index / (stats.interviewByMonth.length - 1)) * 100;
                    const y = 36 - (entry.count / maxMonthly) * 30;
                    return (
                      <circle
                        key={`${entry.month}-interview`}
                        cx={x}
                        cy={y}
                        r="1.4"
                        fill="#f59e0b"
                      />
                    );
                  })}
                </svg>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                  {stats.byMonth.map((entry) => (
                    <div key={entry.month} className="flex items-center gap-2">
                      <span>{entry.month}</span>
                      <span className="text-slate-700">{entry.count}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-900" />
                    Applications
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Interviews
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Status breakdown</h2>
          <p className="text-sm text-slate-500">Where your applications stand</p>
          <div className="mt-6 space-y-3">
            {statusEntries.length
              ? statusEntries.map(([status, count]) => {
                  const width = totalApplications
                    ? Math.round((count / totalApplications) * 100)
                    : 0;
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>{status}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-slate-900 transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              : (
                  <p className="text-sm text-slate-400">No stats available yet.</p>
                )}
          </div>
        </div>
      </div>
    </section>
  );
}
