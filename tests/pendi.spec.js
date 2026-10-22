import { test, expect } from '@playwright/test';
import fs from 'node:fs';

// Todos os dados abaixo são fictícios.
const cartao = (page, titulo) => page.locator('.cartao', { hasText: titulo });
const contador = (page, status) => page.locator(`[data-status="${status}"] .contador`);

async function cadastrar(page, { title, description = '', status, priority, dueDate }) {
  await page.locator('#f-title').fill(title);
  if (description) await page.locator('#f-description').fill(description);
  if (status) await page.locator('#f-status').selectOption(status);
  if (priority) await page.locator('#f-priority').selectOption(priority);
  if (dueDate) await page.locator('#f-dueDate').fill(dueDate);
  await page.locator('#btn-salvar').click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('carrega a página com as 4 colunas e estados vazios', async ({ page }) => {
  await expect(page).toHaveTitle('Pendi Lab');
  await expect(page.getByRole('heading', { level: 1, name: 'Pendi Lab' })).toBeVisible();
  await expect(page.locator('.coluna')).toHaveCount(4);
  await expect(page.locator('.vazio:visible')).toHaveCount(4);
  await expect(page.locator('#indicadores')).toContainText('Total: 0');
});

test('exibe o texto de ajuda do formulário (Tela 31)', async ({ page }) => {
  await expect(page.locator('#ajuda-form')).toContainText('título (obrigatório)');
  await expect(page.locator('#form-pendencia')).toHaveAttribute('aria-describedby', 'ajuda-form');
});

test('TM-01: título vazio mostra erro e não cria cartão', async ({ page }) => {
  await page.locator('#btn-salvar').click();
  await expect(page.locator('#e-title')).toHaveText('Informe um título.');
  await expect(page.locator('#f-title')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.cartao')).toHaveCount(0);
});

test('TM-02 e TM-06: cadastro fictício com e sem prazo', async ({ page }) => {
  await cadastrar(page, { title: 'Revisar planilha fictícia', dueDate: '2030-01-15' });
  await cadastrar(page, { title: 'Organizar arquivo fictício' });
  await expect(contador(page, 'backlog')).toHaveText('2');
  await expect(cartao(page, 'Revisar planilha fictícia')).toContainText('Prazo: 15/01/2030');
  await expect(cartao(page, 'Organizar arquivo fictício')).toContainText('Sem prazo');
  await expect(page.locator('#mensagem-estado')).toContainText('cadastrada');
});

test('edição altera o cartão e preserva a pendência', async ({ page }) => {
  await cadastrar(page, { title: 'Titulo antigo', priority: 'baixa' });
  await page.getByRole('button', { name: 'Editar pendência: Titulo antigo' }).click();
  await expect(page.locator('#btn-salvar')).toHaveText('Salvar alterações');
  await page.locator('#f-title').fill('Titulo novo');
  await page.locator('#f-priority').selectOption('alta');
  await page.locator('#btn-salvar').click();
  await expect(page.locator('.cartao')).toHaveCount(1);
  await expect(cartao(page, 'Titulo novo')).toContainText('Prioridade: Alta');
  await expect(page.locator('#btn-salvar')).toHaveText('Cadastrar');
});

test('TM-03: mudança de status move o cartão e atualiza contadores', async ({ page }) => {
  await cadastrar(page, { title: 'Mover cartão fictício' });
  await page.getByLabel('Mudar status de: Mover cartão fictício').selectOption('andamento');
  await expect(page.locator('[data-status="andamento"] .cartao')).toHaveCount(1);
  await expect(contador(page, 'andamento')).toHaveText('1');
  await expect(contador(page, 'backlog')).toHaveText('0');
  await expect(page.locator('#indicadores')).toContainText('Em andamento: 1');
});

test('TM-04 e TM-05: filtros por prioridade e por texto', async ({ page }) => {
  await cadastrar(page, { title: 'Relatório mensal', priority: 'alta' });
  await cadastrar(page, { title: 'Ligar fornecedor', priority: 'baixa' });

  await page.locator('#filtro-prioridade').selectOption('alta');
  await expect(page.locator('.cartao')).toHaveCount(1);
  await expect(cartao(page, 'Relatório mensal')).toBeVisible();

  await page.locator('#btn-limpar-filtros').click();
  await expect(page.locator('.cartao')).toHaveCount(2);

  await page.locator('#filtro-texto').fill('rel');
  await expect(page.locator('.cartao')).toHaveCount(1);
  await expect(cartao(page, 'Relatório mensal')).toBeVisible();
  await expect(page.locator('#indicadores')).toContainText('Exibindo 1 de 2');
});

test('TM-07: recarregar mantém as pendências (persistência)', async ({ page }) => {
  await cadastrar(page, { title: 'Persistir fictício', status: 'revisao', priority: 'alta' });
  await page.reload();
  await expect(cartao(page, 'Persistir fictício')).toBeVisible();
  await expect(page.locator('[data-status="revisao"] .cartao')).toHaveCount(1);
  await expect(contador(page, 'revisao')).toHaveText('1');
});

test('TM-08: dado inválido no localStorage abre vazio sem erro', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.evaluate(() => localStorage.setItem('pendi:v1', '{'));
  await page.reload();
  await expect(page.locator('.cartao')).toHaveCount(0);
  await expect(page.locator('#indicadores')).toContainText('Total: 0');
  expect(erros).toEqual([]);
});

test('TM-11: exclusão só ocorre após confirmar', async ({ page }) => {
  await cadastrar(page, { title: 'Excluir fictício' });
  const botao = page.getByRole('button', { name: 'Excluir pendência: Excluir fictício' });

  page.once('dialog', (d) => d.dismiss());
  await botao.click();
  await expect(page.locator('.cartao')).toHaveCount(1);
  await expect(page.locator('#mensagem-estado')).toContainText('Exclusão cancelada');

  page.once('dialog', (d) => d.accept());
  await botao.click();
  await expect(page.locator('.cartao')).toHaveCount(0);
  await expect(page.locator('#mensagem-estado')).toContainText('excluída');
});

test('TM-09: exportação gera JSON válido', async ({ page }) => {
  await cadastrar(page, { title: 'Exportar fictício', priority: 'media' });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#btn-exportar').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^pendi-lab-\d{4}-\d{2}-\d{2}\.json$/);
  const dados = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
  expect(dados.app).toBe('Pendi Lab');
  expect(dados.count).toBe(1);
  expect(dados.tasks[0].title).toBe('Exportar fictício');
});

test('TM-10: sem overflow horizontal em 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await cadastrar(page, {
    title: 'Pendência com título bastante longo para testar a quebra de linha em tela estreita',
    description: 'Descrição fictícia '.repeat(10),
  });
  const medidas = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(medidas.scroll).toBeLessThanOrEqual(medidas.client);
});

test('evidência visual: screenshot do quadro preenchido', async ({ page }, testInfo) => {
  await cadastrar(page, { title: 'Pendência A', status: 'backlog', priority: 'alta' });
  await cadastrar(page, { title: 'Pendência B', status: 'andamento', priority: 'media', dueDate: '2030-02-01' });
  await cadastrar(page, { title: 'Pendência C', status: 'concluido', priority: 'baixa' });
  fs.mkdirSync('evidencias', { recursive: true });
  await page.screenshot({
    path: `evidencias/quadro-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
