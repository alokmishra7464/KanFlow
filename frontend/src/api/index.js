const BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// Auth
export const register = (name, email, password) =>
  fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then(handle);

export const login = (email, password) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handle);

// Boards
export const getBoards = () =>
  fetch(`${BASE}/boards`, { headers: headers() }).then(handle);

export const createBoard = (title) =>
  fetch(`${BASE}/boards`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ title }),
  }).then(handle);

export const getBoardById = (id) =>
  fetch(`${BASE}/boards/${id}`, { headers: headers() }).then(handle);

export const addMember = (boardId, email) =>
  fetch(`${BASE}/boards/${boardId}/members`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email }),
  }).then(handle);

export const deleteBoard = (id) =>
  fetch(`${BASE}/boards/${id}`, {
    method: "DELETE",
    headers: headers(),
  }).then(handle);

// Columns
export const getColumns = (boardId) =>
  fetch(`${BASE}/column/${boardId}`, { headers: headers() }).then(handle);

export const createColumn = (boardId, name) =>
  fetch(`${BASE}/column/${boardId}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name }),
  }).then(handle);

export const deleteColumn = (columnId) =>
  fetch(`${BASE}/column/${columnId}`, {
    method: "DELETE",
    headers: headers(),
  }).then(handle);

// Tasks
export const getTasksByColumn = (columnId) =>
  fetch(`${BASE}/tasks/${columnId}`, { headers: headers() }).then(handle);

export const createTask = (columnId, title, description, assignedTo) =>
  fetch(`${BASE}/tasks/column/${columnId}/task`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ title, description, assignedTo }),
  }).then(handle);

export const deleteTask = (taskId) =>
  fetch(`${BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers: headers(),
  }).then(handle);

export const moveTask = (taskId, destColId, newIndex) =>
  fetch(`${BASE}/tasks/${taskId}/move`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ destColId, newIndex }),
  }).then(handle);