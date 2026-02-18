import { useState, useMemo } from 'react';
import { useCollection } from './hooks/useCollection';
import Header from './components/Header';
import TodoInput from './components/TodoInput';
import Filters from './components/Filters';
import TodoList from './components/TodoList';

export default function App() {
  const { items: todos, loading, create, update, remove } = useCollection('todos');
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const stats = useMemo(() => ({
    total: todos.length,
    done: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  }), [todos]);

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (filter === 'active') result = result.filter((t) => !t.completed);
    if (filter === 'completed') result = result.filter((t) => t.completed);
    if (priorityFilter !== 'all') result = result.filter((t) => t.priority === priorityFilter);

    // Sort: uncompleted first, then by priority (high > medium > low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
    });

    return result;
  }, [todos, filter, priorityFilter]);

  const handleToggle = async (id, completed) => {
    await update(id, { completed });
  };

  const handleDelete = async (id) => {
    await remove(id);
  };

  const handleCreate = async (data) => {
    await create(data);
  };

  return (
    <>
      <div className="noise-overlay" />
      <div className="min-h-screen px-4 py-12 flex justify-center">
        <div className="w-full max-w-xl">
          <Header stats={stats} />
          <TodoInput onCreate={handleCreate} />
          <Filters
            filter={filter}
            setFilter={setFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />
          {loading ? (
            <div className="text-center py-16">
              <div className="font-mono text-sm text-[var(--text-muted)] animate-pulse">
                loading::tasks...
              </div>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
          <footer className="mt-12 text-center">
            <p className="font-mono text-xs text-[var(--text-muted)]">
              todo::app v1.0 — built with react + tailwind
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
