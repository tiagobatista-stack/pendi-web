# Pendi Lab — instruções para o Claude

- Ambiente de treinamento com **dados exclusivamente fictícios**.
- Leia `README.md` e `docs/*.md` antes de implementar; o escopo é o definido ali.
- **Alterações incrementais:** um marco (M1–M4) por vez, sem ampliar escopo sem aprovação.
- **Revisão de diff:** mostre o diff antes de concluir cada alteração.
- **Teste antes de commit:** rode `npm run build` e os testes pertinentes; relate resultados reais, inclusive falhas. Nunca afirme que testou o que não executou.
- **Menor privilégio:** acesse apenas os arquivos e comandos necessários à tarefa.
- **Sem segredos:** não crie, leia nem registre senhas, tokens, `.env` ou dados pessoais reais.
- **Aprovação obrigatória** antes de: instalar dependências, criar commits, `git push`, deploy, ou alterar permissões/configurações.
- `.gitignore` deve excluir `node_modules`, `dist`, `.env` e evidências privadas.
- Sem backend, login ou APIs externas neste marco.
