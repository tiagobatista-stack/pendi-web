export function buildExport(tasks, now = new Date()) {
  return {
    app: 'Pendi Lab',
    version: 1,
    exportedAt: now.toISOString(),
    count: tasks.length,
    tasks,
  };
}

export function exportFileName(now = new Date()) {
  return `pendi-lab-${now.toISOString().slice(0, 10)}.json`;
}

// Gera o download no próprio navegador; nada é enviado a servidores.
export function downloadExport(tasks) {
  const now = new Date();
  const blob = new Blob([JSON.stringify(buildExport(tasks, now), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = exportFileName(now);
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return a.download;
}
