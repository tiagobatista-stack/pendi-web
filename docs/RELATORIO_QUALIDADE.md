# Relatório de qualidade — Pendi web

Data da execução: 2026-10-21. Ambiente: Windows 11, Node 22.17.1, npm 10.9.2, Vite 5.4.21, `@playwright/test` 1.64.1, Chromium (revisão 1248). Dados exclusivamente fictícios.

Este relatório só cita resultados efetivamente obtidos nesta máquina. Itens não verificados estão listados em **Limitações**.

## 1. Build

Comando: `npm run build`

```
vite v5.4.21 building for production...
✓ 9 modules transformed.
dist/index.html                 5.39 kB │ gzip: 1.44 kB
dist/assets/index-DSau539n.css  3.48 kB │ gzip: 1.12 kB
dist/assets/index-DbMw1raw.js   9.56 kB │ gzip: 3.61 kB
✓ built in 165ms
```

Resultado: **aprovado** (código de saída 0).

## 2. Testes automatizados (Playwright)

Comando: `npm run test:e2e` (configuração em `playwright.config.js`, testes em `tests/pendi.spec.js`).

| Execução | Testes | Aprovados | Reprovados | Duração |
|---|---|---|---|---|
| 1ª tentativa | 26 | 0 | 26 | — |
| Execução válida (`npm run test:e2e`) | 26 | **26** | **0** | 6,8 s |
| Demonstração com vídeo (`npm run test:e2e:demo`) | 26 | **26** | **0** | 7,2 s |

A 1ª tentativa falhou **antes de abrir o app**: o Chromium instalado era a revisão 1243 e o Playwright 1.64.1 exige a 1248 (`Executable doesn't exist ... chromium_headless_shell-1248`). Não foi falha do Pendi web. Depois da instalação da revisão correta, as duas execuções passaram.

São 13 casos executados em 2 projetos (`desktop` 1280×720 e `mobile` 390×844), totalizando 26.

| Caso | Teste manual relacionado | Resultado (desktop / mobile) |
|---|---|---|
| Carrega a página com 4 colunas e estados vazios | — | aprovado / aprovado |
| Exibe o texto de ajuda do formulário | Tela 31 | aprovado / aprovado |
| Título vazio mostra erro e não cria cartão | TM-01 | aprovado / aprovado |
| Cadastro com e sem prazo | TM-02, TM-06 | aprovado / aprovado |
| Edição preserva a pendência | — | aprovado / aprovado |
| Mudança de status e contadores | TM-03 | aprovado / aprovado |
| Filtros por prioridade e por texto | TM-04, TM-05 | aprovado / aprovado |
| Recarga mantém as pendências | TM-07 | aprovado / aprovado |
| Dado inválido no `localStorage` abre vazio sem erro | TM-08 | aprovado / aprovado |
| Exclusão só após confirmar | TM-11 | aprovado / aprovado |
| Exportação gera JSON válido | TM-09 | aprovado / aprovado |
| Sem overflow horizontal em 390 px | TM-10 | aprovado / aprovado |
| Screenshot do quadro preenchido | evidência | aprovado / aprovado |

## 3. Evidências (arquivos existentes)

Caminhos relativos à raiz do projeto.

| Evidência | Caminho | No git? |
|---|---|---|
| Screenshot desktop | `evidencias/quadro-desktop.png` | sim |
| Screenshot mobile (390 px) | `evidencias/quadro-mobile.png` | sim |
| Relatório HTML do Playwright | `playwright-report/index.html` | não (ignorado) |
| Vídeos da execução de demonstração (26 arquivos `.webm`) | `test-results/<caso>-<projeto>/video.webm` | não (ignorado) |

Não há screenshots de falha porque nenhum teste falhou na execução válida. Para regenerar: `npm run test:e2e`, `npm run test:e2e:demo` e `npm run test:e2e:report`.

## 4. Segurança de dependências

Comando: `npm audit`

- 2 vulnerabilidades (1 moderada, 1 alta), nas dependências **`vite` (<=6.4.3) e `esbuild` (<=0.24.2)**, já existentes antes do Playwright.
- Advisory citado: GHSA-67mh-4wv8-2f99 (um site pode enviar requisições ao servidor de desenvolvimento e ler a resposta).
- Afeta o servidor de desenvolvimento (`npm run dev`), não o `dist/` estático.
- A correção sugerida (`npm audit fix --force`) instala `vite@8.3.5`, mudança incompatível. **Não foi aplicada.**

## 5. Limitações

- Somente **Chromium**; Firefox e WebKit não foram testados.
- O projeto `mobile` usa viewport de 390×844; não emula dispositivo real nem toque.
- **TM-12 (navegação só por teclado, foco visível)** não é automatizado e **não foi executado**.
- Contraste de cores não foi medido.
- O `window.confirm` é tratado pelo teste; não foi verificado em outros navegadores.
- Os testes cobrem fluxos felizes e alguns erros; não há teste de cota cheia do `localStorage`.
- O app **não está publicado na Vercel**; nada foi testado em produção.
- O relatório HTML e os vídeos não são versionados e existem apenas na máquina onde a suíte rodou.
