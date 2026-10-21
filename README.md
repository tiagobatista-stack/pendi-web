# Pendi Lab

MVP didático para organizar **pendências fictícias** em um Kanban visual. Público: equipes administrativas em treinamento.

## Problema
Pendências controladas em planilhas, e-mails ou memória não têm visão por estágio, priorização nem prazos.

## Funcionalidades (marco 1)
- Kanban com 4 status: Backlog, Em andamento, Em revisão, Concluído.
- Pendência com título, descrição, prioridade (Baixa/Média/Alta) e prazo opcional.
- Filtros por prioridade e texto.
- Persistência local (`localStorage`).
- Exportação JSON.
- Layout responsivo (390px sem overflow horizontal).

## Fora do escopo
Login, dados reais, APIs externas, backend, multiusuário, notificações.

## Stack
Vite + HTML + CSS + JavaScript (sem frameworks). Publicação estática na Vercel.

## Como rodar (após o marco M1)
```
npm install
npm run dev
npm run build
```

## Documentação
- [docs/REQUISITOS.md](docs/REQUISITOS.md)
- [docs/REGRAS.md](docs/REGRAS.md)
- [docs/ARQUITETURA.md](docs/ARQUITETURA.md)
- [docs/TESTES_MANUAIS.md](docs/TESTES_MANUAIS.md)
- [docs/BACKLOG.md](docs/BACKLOG.md)

## Estado atual
Apenas documentação. **Nenhum código de aplicação existe ainda e nada foi testado.**

## Limitações conhecidas
Dados ficam só no navegador (~5 MB, sem criptografia, por origem, podem ser apagados pelo usuário).
