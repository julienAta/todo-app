import { useState } from 'react';

export default function TodoInput({ onCreate }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onCreate({ text: text.trim(), completed: false, priority });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="> add a new task..."
          className="input-field flex-1 px-4 py-3 rounded-lg text-sm"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="input-field px-3 py-3 rounded-lg text-sm cursor-pointer"
        >
          <option value="high">🔴 high</option>
          <option value="medium">🟡 med</option>
          <option value="low">🟢 low</option>
        </select>
        <button type="submit" className="btn-primary px-6 py-3 rounded-lg text-sm">
          ADD
        </button>
      </div>
    </form>
  );
}
