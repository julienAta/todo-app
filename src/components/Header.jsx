export default function Header({ stats }) {
  return (
    <header className="mb-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-3 h-3 rounded-full bg-[var(--accent)] animate-pulse" />
        <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-[0.3em]">
          system active
        </span>
      </div>
      <h1 className="font-mono text-4xl font-bold tracking-tight mb-1">
        todo<span className="text-[var(--accent)]">::</span>app
      </h1>
      <p className="font-mono text-sm text-[var(--text-muted)]">
        // manage your tasks with precision
      </p>

      <div className="flex gap-4 mt-6">
        <div className="stat-box px-4 py-3 rounded-lg flex-1">
          <div className="font-mono text-2xl font-bold text-[var(--accent)]">{stats.total}</div>
          <div className="font-mono text-xs text-[var(--text-muted)] uppercase">total</div>
        </div>
        <div className="stat-box px-4 py-3 rounded-lg flex-1">
          <div className="font-mono text-2xl font-bold text-[var(--priority-low)]">{stats.done}</div>
          <div className="font-mono text-xs text-[var(--text-muted)] uppercase">done</div>
        </div>
        <div className="stat-box px-4 py-3 rounded-lg flex-1">
          <div className="font-mono text-2xl font-bold text-[var(--priority-high)]">{stats.pending}</div>
          <div className="font-mono text-xs text-[var(--text-muted)] uppercase">pending</div>
        </div>
      </div>
    </header>
  );
}
