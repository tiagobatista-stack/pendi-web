# Arquitetura

## Estrutura proposta
```
pendi-u07/
├─ index.html
├─ package.json        (única dependência: vite, em devDependencies)
├─ src/
│  ├─ main.js          inicialização e eventos
│  ├─ model.js         Task, validação, geração de id
│  ├─ storage.js       leitura/gravação em localStorage ("pendi:v1")
│  ├─ state.js         tarefas, filtros e operações
│  ├─ render.js        colunas, cartões e contadores
│  ├─ export.js        exportação JSON
│  └─ style.css
├─ docs/
├─ README.md
└─ CLAUDE.md
```

## Modelo Task
| Campo | Tipo | Observação |
|---|---|---|
| id | string | `crypto.randomUUID()` |
| title | string | obrigatório |
| description | string | opcional |
| status | enum | backlog / andamento / revisao / concluido |
| priority | enum | baixa / media / alta |
| dueDate | string \| null | `YYYY-MM-DD` |
| createdAt | string | ISO 8601 |

## Fluxo
Formulário → validar → `state` → `storage` → `render`. Filtros só afetam o `render`.

## Acessibilidade
Rótulos em todos os campos, `aria-live` para mensagens, mudança de status por `<select>`, foco visível, contraste adequado.

## Limites do localStorage
~5 MB; apenas texto; por navegador e origem; sem criptografia; o usuário pode apagar.

## Build e publicação
`npm run build` gera `dist/`. Na Vercel: framework Vite, saída `dist`, site estático. Sem backend nem autenticação neste marco.

## Marcos
M1 base Vite · M2 cadastro/edição · M3 Kanban, filtros e persistência · M4 visual, acessibilidade e exportação.
