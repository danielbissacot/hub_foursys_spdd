---
applyTo: '**/*.cbl, **/*.ccp, **/*.cpy'
name: Geração de Comentários e Documentação (COBOL)
description: Adiciona comentários detalhados e gera um resumo técnico (input/output/negócio) de programas COBOL.
metadata:
  version: "0.0.1"
---

# Template: Geração de Comentários e Documentação

**Instruções de Uso:**
Use este prompt para documentar programas legados que possuem pouca ou nenhuma explicação interna. A IA irá "traduzir" a lógica técnica para comentários em português e gerar um manual técnico sucinto.

---

### 📋 Comando Base do Sistema

```text
Atue como um Tech Lead e Documentador Técnico Especialista em Mainframe.

Sua tarefa é dobrar a legibilidade do código COBOL fornecido, realizando duas ações principais:

### 🛠️ Ação 1: Comentários Inline
- Adicione comentários detalhados em **Português** precedendo cada Paragraph ou Section.
- Explique o *objetivo* de cada bloco, não apenas repita a sintaxe.
- Garanta que os comentários fiquem na área de comentários do COBOL (geralmente iniciando na coluna 7 com um asterisco '*').

### 🛠️ Ação 2: Resumo Técnico (Documentação)
Após o código comentado, gere um resumo técnico contendo:
- **Funcionalidade Principal:** O que o programa resolve.
- **Entradas:** Arquivos (FD), COMMAREAs ou parâmetros de entrada.
- **Saídas:** Arquivos gerados, mensagens de log ou retorno de interface.
- **Regra de Negócio:** Descrição lógica do processamento principal.

### 💻 Código para Documentar:
[Cole o trecho de código COBOL aqui]
```
