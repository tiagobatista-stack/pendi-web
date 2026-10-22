# Pendi Lab (Pendi web)

MVP didático para organizar **pendências fictícias** em um Kanban visual. Público: equipes administrativas em treinamento.

## Problema
Pendências controladas em planilhas, e-mails ou memória não têm visão por estágio, priorização nem prazos.

## Funcionalidades
- Kanban com 4 status: Backlog, Em andamento, Em revisão, Concluído.
- Cadastro e edição de pendência com título (obrigatório), descrição, prioridade (Baixa/Média/Alta) e prazo opcional.
- Mudança de status por `<select>` no cartão (acessível por teclado).
- Filtros por prioridade e por texto, com indicadores por status.
- Exclusão com confirmação.
- Persistência local (`localStorage`, chave `pendi:v1`), com tratamento de dados inválidos.
- Exportação JSON.
- Layout responsivo (390 px sem overflow horizontal, verificado por teste automatizado).

## Fora do escopo
Login, dados reais, APIs externas, backend, multiusuário, notificações.

## Arquitetura
Vite + HTML + CSS + JavaScript, sem frameworks. Fluxo: formulário → validação (`model.js`) → estado (`state.js`) → armazenamento (`storage.js`) → renderização (`render.js`).

```
index.html
src/  main.js · model.js · storage.js · state.js · render.js · export.js · style.css
tests/pendi.spec.js        testes Playwright
playwright.config.js
evidencias/                screenshots de evidência
docs/                      requisitos, regras, arquitetura, testes e relatório
```

Detalhes em [docs/ARQUITETURA.md](docs/ARQUITETURA.md).

## Como rodar
```
npm install
npm run dev       # servidor de desenvolvimento
npm run build     # gera dist/
npm run preview   # serve o dist/ localmente
```

## Testes
Testes de navegador com Microsoft Playwright (Chromium), em desktop (1280 px) e mobile (390 px).

```
npm install
npx playwright install chromium     # uma vez, baixa o navegador (fora do projeto)
npm run test:e2e                    # suíte completa
npm run test:e2e:demo               # mesma suíte, com vídeo
npm run test:e2e:report             # abre o relatório HTML
```

Último resultado registrado: **26 de 26 testes aprovados** e build aprovado em 2026-10-21. Saídas, evidências e limitações em [docs/RELATORIO_QUALIDADE.md](docs/RELATORIO_QUALIDADE.md). Os testes manuais estão em [docs/TESTES_MANUAIS.md](docs/TESTES_MANUAIS.md).

## GitHub
Repositório privado: https://github.com/tiagobatista-stack/pendi-web

## Publicação (Vercel)
**Ainda não publicado.** Não há URL de produção. Quando houver, a configuração prevista é framework Vite, build `npm run build` e saída `dist`.

## Documentação
- [docs/REQUISITOS.md](docs/REQUISITOS.md)
- [docs/REGRAS.md](docs/REGRAS.md)
- [docs/ARQUITETURA.md](docs/ARQUITETURA.md)
- [docs/TESTES_MANUAIS.md](docs/TESTES_MANUAIS.md)
- [docs/BACKLOG.md](docs/BACKLOG.md)
- [docs/RELATORIO_QUALIDADE.md](docs/RELATORIO_QUALIDADE.md)

## Limitações conhecidas
- Dados ficam só no navegador (~5 MB, sem criptografia, por origem, podem ser apagados pelo usuário).
- Testes automatizados só em Chromium; a navegação por teclado (TM-12) continua manual e não foi executada.
- `npm audit` aponta 2 vulnerabilidades (moderada e alta) em `vite`/`esbuild`, que afetam o servidor de desenvolvimento; a correção exigiria atualização incompatível do Vite e não foi aplicada.
