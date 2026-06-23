# Critérios de revisão — Planos de implementação

Passe estes critérios ao `document-reviewer` como contexto adicional ao revisar planos.

## Categorias de verificação

| Categoria | O que verificar |
|-----------|----------------|
| **Completude** | TODOs, placeholders, tasks incompletas, steps faltando código |
| **Alinhamento com spec** | O plano cobre os requisitos e critérios de aceite da US/RFC? Há scope creep? |
| **Decomposição de tasks** | Tasks têm boundaries claros? Steps são acionáveis (2-5 min cada)? |
| **Buildability** | Um agente conseguiria seguir este plano sem travar? Paths existem? Tipos são consistentes? |

## Calibração

Só flagueie problemas que **causariam falha real durante a implementação**.

Exemplos de problemas reais:
- Requisito da spec sem task correspondente
- Steps contraditórios entre tasks
- Placeholder ou "TBD" no lugar de código
- Task tão vaga que não pode ser executada
- Tipo/método referenciado mas nunca definido

Exemplos que **NÃO** devem bloquear aprovação:
- Preferências de wording ou estilo
- Sugestões "nice to have"
- Ordem alternativa de tasks (se ambas funcionam)

**Aprove a menos que haja gaps sérios.** Recomendações advisory podem ser listadas separadamente.

## Formato de saída esperado

```markdown
## Revisão do Plano

**Status:** Aprovado | Problemas Encontrados

**Problemas (se houver):**
- [Task X, Step Y]: [problema específico] — [por que impacta a implementação]

**Recomendações (advisory, não bloqueiam aprovação):**
- [sugestões de melhoria]
```
