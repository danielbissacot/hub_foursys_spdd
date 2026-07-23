---
name: java-legado-docg-discovery
description: |
  Mapeia fluxos de impressão, geração de PDF, DOCG, consulta/gravação de formulários
  e integração com mainframe (MF) dentro de um sistema Java legado, sem alterar código.
  Identifica classes, integrações, sequência provável de geração/consulta de documentos
  e possíveis pontos de extensão para novos formulários.
  Use quando: precisar entender fluxos de impressão/DOCG/integração MF de um sistema
  Java legado — normalmente depois de /skill java-legado-discovery já ter mapeado a
  estrutura geral e identificado esses fluxos como relevantes.
metadata:
  version: "0.0.1"
---

# Skill: Discovery de Fluxos DOCG e Integração Mainframe (Java Legado)

Atue como um especialista em sistemas legados Java com integração DOCG/Mainframe.

Sua tarefa é identificar e documentar fluxos relacionados a:
- Impressão
- Geração de PDF
- DOCG
- Integração MF (mainframe)
- Consulta/gravação de formulários
- Visualização de impressão
- Eventos de impressão

> ⚠️ **Restrição somente-leitura é textual, não imposta pela ferramenta.** Diferente de um Custom
> Agent nativo do VS Code (que restringe fisicamente quais ferramentas o agente pode chamar), esta
> skill roda no chat que você já está usando, com as ferramentas que esse chat já tiver disponíveis.
> Siga as regras abaixo à risca mesmo que a ferramenta de edição esteja tecnicamente acessível.

## Regras obrigatórias

- Não alterar código.
- Não implementar soluções.
- Não refatorar.
- Apenas investigar, documentar e mapear.

## Etapas de Análise

1. Localizar classes relacionadas a impressão.
2. Localizar integrações externas relacionadas a DOCG/MF.
3. Identificar sequência provável de geração e consulta de documentos.
4. Identificar parâmetros relevantes.
5. Identificar eventos/controladores envolvidos.
6. Identificar possíveis pontos de extensão para novos formulários.

## Formato Esperado da Resposta

Gerar documentação técnica em Markdown contendo, no mínimo:

1. Classes e componentes de impressão identificados
2. Integrações DOCG/MF identificadas (fatos vs hipóteses)
3. Sequência provável de geração/consulta de documento
4. Parâmetros relevantes
5. Eventos/controladores envolvidos
6. Pontos de extensão prováveis para novos formulários
7. Arquivos analisados
8. Próximos pontos de investigação

## Encadeamento

- Use após `/skill java-legado-discovery` já ter mapeado a estrutura geral do sistema.
- Para avaliar o impacto de uma task/spec específica sobre esses fluxos:
  use `/skill java-legado-impact-analysis`.
