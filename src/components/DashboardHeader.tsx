type DashboardHeaderProps = {
  firstName?: string;
  onLogout: () => void;
};

export default function DashboardHeader({ firstName, onLogout }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
          Protected dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Hi {firstName ?? "there"}, here are your applications
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Track your progress, analyze your stats, and keep momentum.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onLogout} className="btn btn-pill btn-md btn-primary">
          Sign out
        </button>
      </div>
    </header>
  );
}
