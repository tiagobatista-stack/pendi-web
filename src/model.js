export const STATUSES = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'andamento', label: 'Em andamento' },
  { value: 'revisao', label: 'Em revisão' },
  { value: 'concluido', label: 'Concluído' },
];

export const PRIORITIES = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
];

const isValid = (list, value) => list.some((item) => item.value === value);

export function generateId(existingIds = []) {
  const taken = new Set(existingIds);
  let id;
  do {
    id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  } while (taken.has(id));
  return id;
}

// Retorna { errors, value }. `errors` é um objeto campo -> mensagem.
export function validateTask(input) {
  const errors = {};
  const title = (input.title ?? '').trim();
  if (!title) errors.title = 'Informe um título.';

  const status = input.status || 'backlog';
  if (!isValid(STATUSES, status)) errors.status = 'Status inválido.';

  const priority = input.priority || 'media';
  if (!isValid(PRIORITIES, priority)) errors.priority = 'Prioridade inválida.';

  const dueDate = input.dueDate ? input.dueDate : null;
  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) errors.dueDate = 'Prazo inválido.';

  return {
    errors,
    value: { title, description: (input.description ?? '').trim(), status, priority, dueDate },
  };
}
