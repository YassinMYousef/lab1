# Todo App with Status Filtering

This project is a small full-stack Todo application with a Node/Express backend and a React frontend.

## Overview

The app lets users:
- create todos
- toggle todos as done or active
- rename todos
- delete todos
- filter the list by status

## Backend

The backend is located in the `backend` folder and uses Express with Mongoose to talk to MongoDB.

### Status filtering

The `getTodos` controller reads the `status` query parameter from `req.query`.

Example requests:
- `/api/todos` -> returns all todos
- `/api/todos?status=active` -> returns only active todos
- `/api/todos?status=done` -> returns only completed todos

The logic uses a filter object:

```js
const { status } = req.query;
const filter = {};

if (status !== undefined) {
  filter.done = status === 'done';
}

const todos = await Todo.find(filter).sort({ createdAt: -1 });
```

This keeps the filter empty when no status is provided so all items are returned.

## Frontend

The frontend is in the `frontend` folder and uses React + Vite.

### API layer

The `fetchTodos` function accepts an optional filter argument and sends it as a query string when present.

Examples:
- `fetchTodos()` -> `/api/todos`
- `fetchTodos('active')` -> `/api/todos?status=active`
- `fetchTodos('done')` -> `/api/todos?status=done`

### Filter UI

In `App.jsx`, we added a small filter state with the default value of `all`.

The app now includes three simple buttons:
- All
- Active
- Done

When a user clicks a filter button, the app updates the state and reloads the todo list using the selected status.

## Files changed

### Backend
- `backend/controllers/todoController.js`
  - Added query-based filtering in `getTodos`

### Frontend
- `frontend/src/api/todos.js`
  - Updated `fetchTodos()` to accept an optional filter
- `frontend/src/App.jsx`
  - Added filter state and refresh logic
  - Added filter buttons to the UI

## How it works together

1. The user clicks a filter button.
2. The React app updates its current filter state.
3. The app calls `fetchTodos(filter)`.
4. The frontend sends a query like `?status=done`.
5. The backend reads `req.query.status` and filters MongoDB results.
6. The matching todos are returned to the UI.

## Running the app

Start the backend:

```bash
cd backend
node server.js
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Then open the frontend in the browser and use the filter buttons to view all, active, or done tasks.
