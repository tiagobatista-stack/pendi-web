import { PRIORITIES, STATUSES } from './model.js';
import { countByStatus } from './state.js';

const labelOf = (list, value) => list.find((i) => i.value === value)?.label ?? value;

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function buildStatusSelect(task) {
  const wrap = document.createElement('div');
  wrap.className = 'mover';

  const label = document.createElement('label');
  const selectId = `st-${task.id}`;
  label.htmlFor = selectId;
  label.textContent = 'Status';

  const select = document.createElement('select');
  select.id = selectId;
  select.dataset.statusId = task.id;
  select.setAttribute('aria-label', `Mudar status de: ${task.title}`);
  for (const s of STATUSES) {
    const opt = document.createElement('option');
    opt.value = s.value;
    opt.textContent = s.label;
    opt.selected = s.value === task.status;
    select.append(opt);
  }

  wrap.append(label, select);
  return wrap;
}

// Usa textContent (nunca innerHTML) para evitar injeção de HTML.
function buildCard(task) {
  const li = document.createElement('li');
  li.className = 'cartao';

  const title = document.createElement('h3');
  title.textContent = task.title;
  li.append(title);

  if (task.description) {
    const p = document.createElement('p');
    p.className = 'descricao';
    p.textContent = task.description;
    li.append(p);
  }

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent =
    `Prioridade: ${labelOf(PRIORITIES, task.priority)} · ` +
    (task.dueDate ? `Prazo: ${formatDate(task.dueDate)}` : 'Sem prazo');
  li.append(meta);

  li.append(buildStatusSelect(task));

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-editar';
  btn.dataset.editId = task.id;
  btn.textContent = 'Editar';
  btn.setAttribute('aria-label', `Editar pendência: ${task.title}`);
  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'btn-excluir';
  del.dataset.deleteId = task.id;
  del.textContent = 'Excluir';
  del.setAttribute('aria-label', `Excluir pendência: ${task.title}`);

  const actions = document.createElement('div');
  actions.className = 'acoes';
  actions.append(btn, del);
  li.append(actions);

  li.dataset.priority = task.priority;
  return li;
}

// `all` = todas as tarefas; `visible` = após filtros.
export function renderBoard(all, visible, filtersActive = false) {
  for (const { value } of STATUSES) {
    const col = document.querySelector(`[data-status="${value}"]`);
    const list = col.querySelector('.cartoes');
    const empty = col.querySelector('.vazio');
    const counter = col.querySelector('.contador');
    const items = visible.filter((t) => t.status === value);

    list.replaceChildren(...items.map(buildCard));
    empty.hidden = items.length > 0;
    empty.textContent = filtersActive
      ? 'Nenhuma pendência corresponde aos filtros.'
      : 'Nenhuma pendência neste status.';
    counter.textContent = String(items.length);
    counter.setAttribute('aria-label', `${items.length} pendências`);
  }

  const totals = countByStatus(all);
  const summary = document.getElementById('indicadores');
  const parts = STATUSES.map((s) => `${s.label}: ${totals[s.value]}`);
  summary.textContent =
    `Total: ${all.length} · ${parts.join(' · ')} · Exibindo ${visible.length} de ${all.length}`;
}

export function showErrors(form, errors) {
  for (const field of ['title', 'status', 'priority', 'dueDate']) {
    const input = form.elements[field];
    const msg = form.querySelector(`[data-error-for="${field}"]`);
    const text = errors[field] ?? '';
    msg.textContent = text;
    if (text) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }
}
