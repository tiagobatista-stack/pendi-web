import './style.css';
import {
  addTask,
  changeStatus,
  deleteTask,
  findTask,
  getFilters,
  getTasks,
  getVisibleTasks,
  setFilters,
  updateTask,
} from './state.js';
import { renderBoard, showErrors } from './render.js';
import { downloadExport } from './export.js';

const form = document.getElementById('form-pendencia');
const formTitle = document.getElementById('form-titulo');
const submitBtn = document.getElementById('btn-salvar');
const cancelBtn = document.getElementById('btn-cancelar');
const statusMsg = document.getElementById('mensagem-estado');
const searchInput = document.getElementById('filtro-texto');
const priorityFilter = document.getElementById('filtro-prioridade');
const clearFiltersBtn = document.getElementById('btn-limpar-filtros');
const exportBtn = document.getElementById('btn-exportar');

let editingId = null;

const filtersActive = () => Boolean(getFilters().text.trim() || getFilters().priority);

function refresh() {
  renderBoard(getTasks(), getVisibleTasks(), filtersActive());
}

const saveNote = (saved) =>
  saved ? '' : ' Atenção: não foi possível salvar no navegador; os dados valem só nesta sessão.';

function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

function resetForm() {
  editingId = null;
  form.reset();
  showErrors(form, {});
  formTitle.textContent = 'Nova pendência';
  submitBtn.textContent = 'Cadastrar';
  cancelBtn.hidden = true;
}

function startEdit(id) {
  const task = findTask(id);
  if (!task) return;
  editingId = id;
  form.elements.title.value = task.title;
  form.elements.description.value = task.description;
  form.elements.status.value = task.status;
  form.elements.priority.value = task.priority;
  form.elements.dueDate.value = task.dueDate ?? '';
  showErrors(form, {});
  formTitle.textContent = 'Editar pendência';
  submitBtn.textContent = 'Salvar alterações';
  cancelBtn.hidden = false;
  statusMsg.textContent = `Editando: ${task.title}`;
  form.elements.title.focus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = readForm();
  const result = editingId ? updateTask(editingId, input) : addTask(input);

  if (!result.ok) {
    showErrors(form, result.errors);
    statusMsg.textContent = 'Corrija os campos indicados.';
    const first = ['title', 'status', 'priority', 'dueDate'].find((f) => result.errors[f]);
    if (first) form.elements[first].focus();
    return;
  }

  const wasEditing = Boolean(editingId);
  resetForm();
  refresh();
  statusMsg.textContent =
    (wasEditing
      ? `Pendência "${result.task.title}" atualizada.`
      : `Pendência "${result.task.title}" cadastrada.`) + saveNote(result.saved);
  form.elements.title.focus();
});

cancelBtn.addEventListener('click', () => {
  resetForm();
  statusMsg.textContent = 'Edição cancelada.';
});

const board = document.querySelector('.kanban');

board.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-edit-id]');
  if (btn) {
    startEdit(btn.dataset.editId);
    return;
  }
  const del = event.target.closest('[data-delete-id]');
  if (del) removeTask(del.dataset.deleteId);
});

function removeTask(id) {
  const task = findTask(id);
  if (!task) return;
  if (!window.confirm(`Excluir a pendência "${task.title}"? Esta ação não pode ser desfeita.`)) {
    statusMsg.textContent = 'Exclusão cancelada.';
    return;
  }
  const result = deleteTask(id);
  if (!result.ok) {
    statusMsg.textContent = 'Não foi possível excluir.';
    return;
  }
  if (editingId === id) resetForm();
  refresh();
  statusMsg.textContent = `Pendência "${task.title}" excluída.` + saveNote(result.saved);
  form.elements.title.focus(); // o cartão sumiu; leva o foco a um ponto estável
}

exportBtn.addEventListener('click', () => {
  const all = getTasks();
  if (!all.length) {
    statusMsg.textContent = 'Não há pendências para exportar.';
    return;
  }
  const name = downloadExport(all);
  statusMsg.textContent = `Exportadas ${all.length} pendências em ${name}.`;
});

// Mudança de status por <select>: acessível por teclado e leitor de tela.
board.addEventListener('change', (event) => {
  const select = event.target.closest('[data-status-id]');
  if (!select) return;
  const id = select.dataset.statusId;
  const result = changeStatus(id, select.value);
  if (!result.ok) {
    statusMsg.textContent = 'Não foi possível mudar o status.';
    refresh();
    return;
  }
  refresh();
  statusMsg.textContent = `"${result.task.title}" movida.` + saveNote(result.saved);
  // O cartão foi redesenhado em outra coluna: devolve o foco ao mesmo controle.
  document.querySelector(`[data-status-id="${CSS.escape(id)}"]`)?.focus();
});

searchInput.addEventListener('input', () => {
  setFilters({ text: searchInput.value });
  refresh();
});

priorityFilter.addEventListener('change', () => {
  setFilters({ priority: priorityFilter.value });
  refresh();
});

clearFiltersBtn.addEventListener('click', () => {
  searchInput.value = '';
  priorityFilter.value = '';
  setFilters({ text: '', priority: '' });
  refresh();
  statusMsg.textContent = 'Filtros limpos.';
});

refresh();
