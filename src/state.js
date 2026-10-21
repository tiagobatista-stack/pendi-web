import { generateId, STATUSES, validateTask } from './model.js';
import { loadTasks, saveTasks } from './storage.js';

let tasks = loadTasks();
let filters = { text: '', priority: '' };

// Gravação falha → o app continua em memória; a UI informa via `saved`.
function commit(next) {
  tasks = next;
  return saveTasks(tasks);
}

export const getTasks = () => tasks;
export const findTask = (id) => tasks.find((t) => t.id === id);

export function addTask(input) {
  const { errors, value } = validateTask(input);
  if (Object.keys(errors).length) return { ok: false, errors };
  const task = {
    id: generateId(tasks.map((t) => t.id)),
    ...value,
    createdAt: new Date().toISOString(),
  };
  const saved = commit([...tasks, task]);
  return { ok: true, task, saved };
}

export function updateTask(id, input) {
  const current = findTask(id);
  if (!current) return { ok: false, errors: { form: 'Pendência não encontrada.' } };
  const { errors, value } = validateTask(input);
  if (Object.keys(errors).length) return { ok: false, errors };
  const task = { ...current, ...value }; // id e createdAt preservados
  const saved = commit(tasks.map((t) => (t.id === id ? task : t)));
  return { ok: true, task, saved };
}

export function changeStatus(id, status) {
  const current = findTask(id);
  if (!current) return { ok: false, errors: { form: 'Pendência não encontrada.' } };
  if (!STATUSES.some((s) => s.value === status)) {
    return { ok: false, errors: { status: 'Status inválido.' } };
  }
  const task = { ...current, status };
  const saved = commit(tasks.map((t) => (t.id === id ? task : t)));
  return { ok: true, task, saved };
}

export function deleteTask(id) {
  const current = findTask(id);
  if (!current) return { ok: false, errors: { form: 'Pendência não encontrada.' } };
  const saved = commit(tasks.filter((t) => t.id !== id));
  return { ok: true, task: current, saved };
}

export function setFilters(next) {
  filters = { ...filters, ...next };
}

export const getFilters = () => filters;

export function getVisibleTasks() {
  const text = filters.text.trim().toLowerCase();
  return tasks.filter((t) => {
    if (filters.priority && t.priority !== filters.priority) return false;
    if (text && !`${t.title} ${t.description}`.toLowerCase().includes(text)) return false;
    return true;
  });
}

export function countByStatus(list) {
  const counts = Object.fromEntries(STATUSES.map((s) => [s.value, 0]));
  for (const t of list) counts[t.status] += 1;
  return counts;
}
