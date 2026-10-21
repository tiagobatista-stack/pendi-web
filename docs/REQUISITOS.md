# Requisitos

## Casos de uso
UC1 cadastrar · UC2 editar · UC3 mover de status · UC4 filtrar · UC5 excluir · UC6 exportar JSON.

## Requisitos funcionais
| ID | Entrada | Ação | Saída esperada |
|---|---|---|---|
| RF-01 | Título vazio ou só espaços | Salvar | Erro "Informe um título"; nada é criado |
| RF-02 | Título válido | Salvar | Cartão criado no status escolhido (padrão Backlog) |
| RF-03 | Novo status | Alterar no cartão | Cartão muda de coluna; contadores atualizam |
| RF-04 | Prioridade | Filtrar | Só cartões dessa prioridade |
| RF-05 | Texto | Buscar | Cartões cujo título/descrição contém o texto (sem diferenciar maiúsculas) |
| RF-06 | Prazo vazio ou data | Salvar | Ambos aceitos |
| RF-07 | Qualquer alteração | Recarregar a página | Dados mantidos em `localStorage` (chave versionada) |
| RF-08 | Dado inválido no storage | Abrir o app | App abre vazio sem quebrar |
| RF-09 | Clique em Exportar | Exportar | Download de `.json` válido |
| RF-10 | Largura 390px | Navegar | Sem rolagem horizontal |
| RF-11 | Clique em Excluir | Excluir | Pede confirmação antes de apagar |

## Requisitos não funcionais
Acessibilidade (rótulos, foco visível, teclado, contraste), dados exclusivamente fictícios, sem segredos.

## Opcionais (fora do escopo até aprovação)
Importar JSON, arrastar e soltar, destaque de atrasadas.

## Decisões pendentes
1. Escala de prioridade (proposta: Baixa/Média/Alta).
2. Mover por botão/seletor, com ou sem arrastar.
3. Destaque de tarefas atrasadas.
4. Importação do JSON exportado.
5. Idioma e identidade visual.
