/**
 * Express backend for To-Do List app using MongoDB
 * 
 * Endpoints:
 *   GET    /todos         - List all todos
 *   POST   /todos         - Add a new todo
 *   PATCH  /todos/:id     - Update a todo (toggle complete)
 *   DELETE /todos/:id     - Delete a todo
 */

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Mongoose model
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
})
const Todo = mongoose.model('Todo', todoSchema)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

// Routes

// Get all todos
app.get('/todos', async (req, res) => {
  const todos = await Todo.find()
  res.json(todos)
})

// Add a new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Text is required' })
  const todo = new Todo({ text })
  await todo.save()
  res.status(201).json(todo)
})

// Update a todo (toggle complete or update text)
app.patch('/todos/:id', async (req, res) => {
  const { id } = req.params
  const update = req.body
  try {
    const todo = await Todo.findByIdAndUpdate(id, update, { new: true })
    if (!todo) return res.status(404).json({ error: 'Todo not found' })
    res.json(todo)
  } catch {
    res.status(400).json({ error: 'Invalid ID' })
  }
})

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params
  try {
    const todo = await Todo.findByIdAndDelete(id)
    if (!todo) return res.status(404).json({ error: 'Todo not found' })
    res.json({ message: 'Deleted' })
  } catch {
    res.status(400).json({ error: 'Invalid ID' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})