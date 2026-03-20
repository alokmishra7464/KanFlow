# KanFlow 🗂️

A real-time Kanban board application built with the MERN stack and Socket.io. Create boards, manage tasks across columns, assign team members, and see changes instantly across all connected users — no refresh needed.

---

## Features

- 🔐 **JWT Authentication** — register, login, protected routes
- 📋 **Board Management** — create, delete boards; invite members by email
- 🗂️ **Columns** — add and delete columns per board
- ✅ **Tasks** — create tasks with title, description, and assignee
- 🖱️ **Drag & Drop** — move tasks between columns with HTML5 drag and drop
- ⚡ **Real-time Sync** — all changes (create, delete, move) broadcast live via Socket.io to everyone on the same board
- 👤 **Member Avatars** — see who's on the board at a glance

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Socket.io
- bcrypt

**Frontend**
- React 18 + Vite
- React Router v6
- Socket.io-client
- CSS (custom, no UI framework)

---

## Project Structure

```
KanFlow/
├── backend/
│   ├── controllers/
│   │   ├── Auth.controllers.js
│   │   ├── Board.controllers.js
│   │   ├── Column.controllers.js
│   │   └── Task.controllers.js
│   ├── middlewares/
│   │   └── Auth.middlewares.js
│   ├── models/
│   │   ├── User.models.js
│   │   ├── Board.models.js
│   │   ├── Column.models.js
│   │   └── Task.models.js
│   ├── routes/
│   │   ├── Auth.routes.js
│   │   ├── Board.routes.js
│   │   ├── Column.routes.js
│   │   └── Task.routes.js
│   ├── socket.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── index.js
    │   ├── components/
    │   │   ├── KanbanColumn.jsx
    │   │   └── TaskCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── AuthPage.jsx
    │   │   ├── BoardsPage.jsx
    │   │   └── BoardPage.jsx
    │   ├── socket.js
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/alokmishra7464/KanFlow.git
cd kanflow
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173` and connects to the backend at `http://localhost:5000`.

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | Get all boards for logged-in user |
| POST | `/api/boards` | Create a new board |
| GET | `/api/boards/:id` | Get a single board |
| POST | `/api/boards/:id/members` | Add a member by email |
| DELETE | `/api/boards/:id` | Delete a board (creator only) |

### Columns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/column/:boardId` | Get all columns for a board |
| POST | `/api/column/:boardId` | Create a new column |
| DELETE | `/api/column/:columnId` | Delete a column (must be empty) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/:columnId` | Get all tasks in a column |
| POST | `/api/tasks/column/:columnId/task` | Create a task |
| DELETE | `/api/tasks/:taskId` | Delete a task |
| PUT | `/api/tasks/:taskId/move` | Move a task to a new column/position |

---

## Real-time Events (Socket.io)

All connected users on the same board receive these events instantly:

| Event | Payload | Trigger |
|-------|---------|---------|
| `task-created` | `{ columnId, task }` | New task added |
| `task-deleted` | `{ taskId, columnId }` | Task removed |
| `task-moved` | `{ taskId, srcColId, destColId, newIndex }` | Task dragged to new position |

Clients join a board-specific room (`join-board` event) so events are scoped per board.

---

## Known Limitations

- Columns cannot be deleted if they contain tasks
- Only the board creator can add/remove members or delete the board
- No file attachments or rich text in task descriptions

---

## License

MIT
