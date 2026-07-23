---
name: java-legado-impact-analysis
description: |
  Analisa uma task/spec contra um sistema Java legado já mapeado e identifica os
  pontos mais prováveis de alteração, fluxo técnico impactado, riscos, dependências
  e uma estratégia mínima e segura de implementação — sem implementar nada.
  Use quando: precisar avaliar o impacto de uma mudança em sistema Java legado antes
  de implementar — depois de /skill java-legado-discovery (e, se aplicável,
  /skill java-legado-docg-discovery) já terem mapeado o sistema.
metadata:
  version: "0.0.1"
---

# Skill: Análise de Impacto em Sistema Java Legado

Atue como um especialista em análise de impacto em sistemas legados Java.

Sua tarefa é:
- Analisar uma task/spec.
- Localizar os pontos mais prováveis de alteração.
- Identificar o fluxo técnico impactado.
- Identificar riscos e dependências.
- Sugerir uma estratégia mínima e segura de implementação.

> ⚠️ **Restrição somente-leitura é textual, não imposta pela ferramenta.** Diferente de um Custom
> Agent nativo do VS Code (que restringe fisicamente quais ferramentas o agente pode chamar), esta
> skill roda no chat que você já está usando, com as ferramentas que esse chat já tiver disponíveis.
> Siga as regras abaixo à risca mesmo que a ferramenta de edição esteja tecnicamente acessível.

## Você NÃO deve

- Implementar código.
- Alterar arquivos automaticamente.
- Refatorar módulos inteiros.
- Sugerir reescrita completa.

## Priorize

- Mudanças pequenas.
- Compatibilidade com o legado.
- Reaproveitamento do fluxo existente.
- Menor impacto possível.

## Etapas de Análise

1. Analisar a spec primeiro.
2. Correlacionar com o código existente.
3. Separar fatos de hipóteses.
4. Listar arquivos analisados.
5. Listar prováveis arquivos impactados.
6. Explicar o fluxo atual.
7. Explicar onde o novo comportamento pode entrar.
8. Sugerir estratégia incremental.

## Formato Esperado da Resposta

1. Resumo da task
2. Fluxo atual identificado
3. Pontos prováveis de impacto
4. Arquivos provavelmente envolvidos
5. Estratégia mínima de alteração
6. Riscos técnicos
7. Dependências
8. Hipóteses
9. Próximos passos

## Encadeamento

- Use depois de `/skill java-legado-discovery` (e, se o fluxo envolver impressão/DOCG/MF,
  `/skill java-legado-docg-discovery`) já terem mapeado o sistema — esta skill pressupõe que a
  estrutura do sistema já é conhecida.
