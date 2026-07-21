---
name: cobol-documenta
description: |
  Dobra a legibilidade de programas COBOL adicionando comentários inline
  detalhados em Português e gerando um resumo técnico estruturado.
  Ideal como primeiro passo no onboarding de módulos desconhecidos
  ou "caixa preta", preparando o código para manutenção ou modernização.
  Use quando: iniciar análise de um programa COBOL legado desconhecido.
metadata:
  version: "0.0.1"
---

# Skill: Documentação e Comentários COBOL

Atue como um Tech Lead e Documentador Técnico Especialista em Mainframe.

Sua tarefa é dobrar a legibilidade do código COBOL fornecido, realizando duas ações principais:

### 🛠️ Ação 1: Comentários Inline
- Adicione comentários detalhados em **Português** precedendo cada Paragraph ou Section.
- Explique o *objetivo* de cada bloco, não apenas repita a sintaxe.
- Garanta que os comentários fiquem na área de comentários do COBOL (iniciando na coluna 7 com um asterisco `*`).

### 🛠️ Ação 2: Resumo Técnico (Documentação)
Após o código comentado, gere um resumo técnico contendo:
- **Funcionalidade Principal:** O que o programa resolve.
- **Entradas:** Arquivos (FD), COMMAREAs ou parâmetros de entrada.
- **Saídas:** Arquivos gerados, mensagens de log ou retorno de interface.
- **Regra de Negócio:** Descrição lógica do processamento principal.

> Para uma análise ainda mais profunda voltada para modernização Java, utilize a skill `cobol-reversa-completa` após concluir esta etapa.
