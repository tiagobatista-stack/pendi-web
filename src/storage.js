import { validateTask } from './model.js';

// Versão na chave: mudanças futuras de formato usam pendi:v2 sem corromper v1.
export const STORAGE_KEY = 'pendi:v1';

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // acesso bloqueado (modo privado, política do navegador)
  }
}

// Aceita só itens bem formados; descarta o resto sem lançar erro.
function sanitize(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const tasks = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    if (typeof item.id !== 'string' || !item.id || seen.has(item.id)) continue;
    if (typeof item.createdAt !== 'string' || Number.isNaN(Date.parse(item.createdAt))) continue;
    const { errors, value } = validateTask({
      title: typeof item.title === 'string' ? item.title : '',
      description: typeof item.description === 'string' ? item.description : '',
      status: item.status,
      priority: item.priority,
      dueDate: typeof item.dueDate === 'string' ? item.dueDate : null,
    });
    if (Object.keys(errors).length) continue;
    seen.add(item.id);
    tasks.push({ id: item.id, ...value, createdAt: item.createdAt });
  }
  return tasks;
}

export function loadTasks() {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const text = storage.getItem(STORAGE_KEY);
    return text ? sanitize(JSON.parse(text)) : [];
  } catch {
    return []; // JSON inválido ou erro de leitura: começa vazio
  }
}

// Retorna false se não conseguiu gravar (cota cheia, bloqueio).
export function saveTasks(tasks) {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
