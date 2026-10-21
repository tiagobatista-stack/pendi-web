# Regras de negócio

- **RN-01** O título é obrigatório (após remover espaços nas pontas).
- **RN-02** Toda pendência tem exatamente um status: Backlog, Em andamento, Em revisão ou Concluído.
- **RN-03** Prioridade: Baixa, Média ou Alta.
- **RN-04** O prazo é opcional, no formato `YYYY-MM-DD`; vazio = sem prazo.
- **RN-05** O `id` é gerado localmente (`crypto.randomUUID()`) e nunca se repete.
- **RN-06** `createdAt` é definido na criação e não muda na edição.
- **RN-07** Filtros alteram somente a visualização, nunca os dados.
- **RN-08** Dados ficam em `localStorage` na chave versionada `pendi:v1`.
- **RN-09** Dados inválidos no storage são ignorados com segurança (app abre vazio).
- **RN-10** Exclusão exige confirmação.
- **RN-11** Apenas dados fictícios; o app deve avisar que não se deve inserir dados pessoais reais.
