// App.jsx
import { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api/todos';
import './todo.css';

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
});

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const status = filter === 'all' ? undefined : filter;

    setLoading(true);
    fetchTodos(status)
      .then(data => { setTodos(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [filter]);

  const handleAdd = async (title) => {
    const newTodo = await createTodo(title);
    setTodos([newTodo, ...todos]);
  };

  const handleToggle = async (id, done) => {
    const updated = await updateTodo(id, { done: !done });
    setTodos(todos.map(t => t._id === id ? updated : t));
  };

  const handleRename = async (id, title) => {
    const updated = await updateTodo(id, { title });
    setTodos(todos.map(t => t._id === id ? updated : t));
  };

  const handleRemove = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div className="receipt-page">
      <div className="receipt">
        <header className="receipt-header">
          <span className="stamp">Tasks</span>
          <p className="receipt-date">{today}</p>
        </header>

        <div style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
          {['all', 'active', 'done'].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                border: filter === option ? '1px solid #2d2d2d' : '1px solid #d9d9d9',
                background: filter === option ? '#2d2d2d' : '#ffffff',
                color: filter === option ? '#ffffff' : '#2d2d2d',
                cursor: 'pointer'
              }}
            >
              {option === 'all' ? 'All' : option === 'active' ? 'Active' : 'Done'}
            </button>
          ))}
        </div>

        <TodoForm onAdd={handleAdd} />
        <TodoList
          todos={todos}
          loading={loading}
          onToggle={handleToggle}
          onRename={handleRename}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}
