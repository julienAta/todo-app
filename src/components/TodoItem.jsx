export default function TodoItem({ todo, onToggle, onDelete, index }) {
  const priorityClass = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  }[todo.priority] || 'priority-medium';

  return (
    <div
      className="todo-card rounded-lg px-4 py-3 flex items-center gap-4 animate-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        className="todo-checkbox"
      />

      <div className={`priority-dot ${priorityClass}`} />

      <span
        className={`font-mono text-sm flex-1 transition-all duration-200 ${
          todo.completed
            ? 'line-through text-[var(--text-muted)]'
            : 'text-[var(--text-primary)]'
        }`}
      >
        {todo.text}
      </span>

      <span className="font-mono text-xs text-[var(--text-muted)]">
        {todo.priority}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="btn-danger px-2 py-1 rounded text-sm font-mono"
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}
