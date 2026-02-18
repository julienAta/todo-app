const FILTERS = [
  { key: 'all', label: 'all' },
  { key: 'active', label: 'active' },
  { key: 'completed', label: 'done' },
];

const PRIORITIES = [
  { key: 'all', label: 'any' },
  { key: 'high', label: '🔴' },
  { key: 'medium', label: '🟡' },
  { key: 'low', label: '🟢' },
];

export default function Filters({ filter, setFilter, priorityFilter, setPriorityFilter }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`filter-btn text-xs uppercase tracking-wider ${
              filter === f.key ? 'active' : ''
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {PRIORITIES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPriorityFilter(p.key)}
            className={`text-sm px-2 py-1 rounded transition-all ${
              priorityFilter === p.key
                ? 'bg-[var(--bg-input)] border border-[var(--border-hover)]'
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
