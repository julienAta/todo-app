import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="font-mono text-6xl mb-4 opacity-20">∅</div>
        <p className="font-mono text-sm text-[var(--text-muted)]">
          // no tasks found
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {todos.map((todo, i) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          index={i}
        />
      ))}
    </div>
  );
}
