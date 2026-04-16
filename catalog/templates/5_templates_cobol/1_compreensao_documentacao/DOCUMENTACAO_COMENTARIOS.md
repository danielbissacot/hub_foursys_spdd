---
applyTo: '**/*.cbl, **/*.ccp, **/*.cpy'
name: Geração de Comentários e Documentação (COBOL)
description: Adiciona comentários detalhados e gera um resumo técnico (input/output/negócio) de programas COBOL.
metadata:
  version: "0.0.1"
---

# 📖 Template: Documentação e Comentários

> [!NOTE]
> **Propósito:** Utilize este template como o **primeiro passo** na análise de programas COBOL legados ou "caixa preta". Ele foca em aumentar a legibilidade imediata sem alterar a lógica.

---

### 🗺️ Contexto de Uso
Este template faz parte da fase de **Compreensão e Documentação**. Ele é ideal para:
- Realizar o "onboarding" técnico em um módulo desconhecido.
- Preparar o código para futuras manutenções ou modernizações.
- Gerar documentação técnica rápida para auditorias ou novos membros da equipe.

---

### 🚀 Instruções de Uso

1.  **Copie** o [Comando Base](#-comando-base-do-sistema) abaixo.
2.  **Cole** o comando na sua ferramenta de IA de preferência.
3.  **Anexe** o código COBOL (CBL, CCP ou CPY) que deseja documentar.
4.  **Revise** os comentários inline gerados e o resumo de negócio ao final.

---

### 📋 Comando Base do Sistema

```text
Atue como um Tech Lead e Documentador Técnico Especialista em Mainframe.

Sua tarefa é dobrar a legibilidade do código COBOL fornecido, realizando duas ações principais:

### 🛠️ Ação 1: Comentários Inline
- Adicione comentários detalhados em **Português** precedendo cada Paragraph ou Section.
- Explique o *objetivo* de cada bloco, não apenas repita a sintaxe.
- Garanta que os comentários fiquem na área de comentários do COBOL (gerualmente iniciando na coluna 7 com um asterisco '*').

### 🛠️ Ação 2: Resumo Técnico (Documentação)
Após o código comentado, gere um resumo técnico contendo:
- **Funcionalidade Principal:** O que o programa resolve.
- **Entradas:** Arquivos (FD), COMMAREAs ou parâmetros de entrada.
- **Saídas:** Arquivos gerados, mensagens de log ou retorno de interface.
- **Regra de Negócio:** Descrição lógica do processamento principal.

### 💻 Código para Documentar:
[Cole o trecho de código COBOL aqui]
```

---

> [!TIP]
> Para uma análise ainda mais profunda voltada para modernização Java, considere utilizar o template de `ENGENHARIA_REVERSA_COMPLETA.md` após concluir esta etapa.

