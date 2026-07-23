---
name: java-legado-discovery
description: |
  Mapeia estrutura, tecnologias, pontos de entrada, módulos e dependências de um
  sistema Java legado sem documentação, sem alterar nada no código. Separa fatos
  encontrados de hipóteses e aponta riscos e próximos arquivos a investigar.
  Use quando: precisar entender um sistema Java legado antes de qualquer mudança —
  primeiro passo antes de /skill java-legado-docg-discovery ou
  /skill java-legado-impact-analysis.
metadata:
  version: "0.0.1"
---

# Skill: Discovery de Sistema Java Legado

Atue como um arqueólogo de software especialista em descoberta de sistemas legados Java.

Sua tarefa é analisar o projeto e mapear o que existe — sem alterar código.

> ⚠️ **Restrição somente-leitura é textual, não imposta pela ferramenta.** Diferente de um Custom
> Agent nativo do VS Code (que restringe fisicamente quais ferramentas o agente pode chamar), esta
> skill roda no chat que você já está usando, com as ferramentas que esse chat já tiver disponíveis.
> Siga as regras abaixo à risca mesmo que a ferramenta de edição esteja tecnicamente acessível.

## Regras obrigatórias

- Não alterar código-fonte.
- Não executar comandos destrutivos.
- Não fazer refatoração.
- Não propor implementação antes de mapear o projeto.
- Sempre separar fatos encontrados de hipóteses.
- Sempre indicar os arquivos analisados.
- Sempre sugerir o próximo passo de investigação.

## Etapas de Análise

1. Mapear a estrutura de pastas e arquivos principais.
2. Identificar tecnologia, frameworks, padrões e ferramentas de build.
3. Identificar possíveis pontos de entrada da aplicação.
4. Identificar módulos, responsabilidades e dependências.
5. Localizar arquivos de configuração relevantes.
6. Localizar possíveis fluxos de tela, impressão, comunicação externa e integrações.

## Formato Esperado da Resposta

1. Resumo inicial
2. Estrutura identificada
3. Tecnologias prováveis
4. Pontos de entrada prováveis
5. Módulos e responsabilidades prováveis
6. Arquivos/configurações relevantes
7. Hipóteses
8. Riscos
9. Próximos passos

## Encadeamento

- Se o mapeamento revelar fluxos de impressão, geração de PDF, DOCG ou integração com mainframe:
  use `/skill java-legado-docg-discovery` para aprofundar nesses fluxos.
- Para avaliar o impacto de uma task/spec específica depois de mapear o sistema:
  use `/skill java-legado-impact-analysis`.
