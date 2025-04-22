import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch todos from backend
  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/todos`)
      .then(res => res.json())
      .then(data => {
        setTodos(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch todos')
        setLoading(false)
      })
  }, [])

  // Add a new todo
  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo })
      })
      const todo = await res.json()
      setTodos([...todos, todo])
      setNewTodo('')
      setLoading(false)
    } catch {
      setError('Failed to add todo')
      setLoading(false)
    }
  }

  // Toggle complete
  const handleToggle = async (id) => {
    const todo = todos.find(t => t.id === id)
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      })
      const updated = await res.json()
      setTodos(todos.map(t => t.id === id ? updated : t))
      setLoading(false)
    } catch {
      setError('Failed to update todo')
      setLoading(false)
    }
  }

  // Delete todo
  const handleDelete = async (id) => {
    try {
      setLoading(true)
      await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' })
      setTodos(todos.filter(t => t.id !== id))
      setLoading(false)
    } catch {
      setError('Failed to delete todo')
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new to-do"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !newTodo.trim()}>Add</button>
      </form>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span
              onClick={() => handleToggle(todo.id)}
              style={{ cursor: 'pointer', textDecoration: todo.completed ? 'line-through' : 'none' }}
            >
              {todo.text}
            </span>
            <button onClick={() => handleDelete(todo.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
