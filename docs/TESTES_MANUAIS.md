# Testes manuais

Status (2026-10-21): TM-01 a TM-11 foram **cobertos por testes automatizados Playwright** (Chromium, desktop 1280 px e mobile 390 px): 26 de 26 aprovados. Não foram executados manualmente por uma pessoa. **TM-12 não foi executado.** Detalhes em [RELATORIO_QUALIDADE.md](RELATORIO_QUALIDADE.md).

| ID | Requisito | Passos | Resultado esperado | Resultado obtido |
|---|---|---|---|---|
| TM-01 | RF-01 | Enviar o formulário com título em branco | Mensagem de erro; nenhum cartão | Aprovado (automatizado) |
| TM-02 | RF-02 | Criar "Teste" | Cartão aparece em Backlog | Aprovado (automatizado) |
| TM-03 | RF-03 | Mudar status para Em andamento | Cartão muda de coluna; contadores corretos | Aprovado (automatizado) |
| TM-04 | RF-04 | Criar Alta e Baixa; filtrar Alta | Só a Alta aparece | Aprovado (automatizado) |
| TM-05 | RF-05 | Buscar "rel" com "Relatório" existente | Cartão encontrado | Aprovado (automatizado) |
| TM-06 | RF-06 | Criar com e sem prazo | Ambos salvos | Aprovado (automatizado) |
| TM-07 | RF-07 | Recarregar (F5) | Tarefas mantidas | Aprovado (automatizado) |
| TM-08 | RF-08 | Gravar `{` na chave `pendi:v1` e recarregar | App abre vazio sem erro | Aprovado (automatizado) |
| TM-09 | RF-09 | Exportar | `.json` válido baixado | Aprovado (automatizado) |
| TM-10 | RF-10 | DevTools em 390px | Sem rolagem horizontal | Aprovado (automatizado) |
| TM-11 | RF-11 | Excluir: cancelar e depois confirmar | Só apaga ao confirmar | Aprovado (automatizado) |
| TM-12 | Acessibilidade | Navegar só com teclado | Todos os controles acessíveis, foco visível | Não executado |
