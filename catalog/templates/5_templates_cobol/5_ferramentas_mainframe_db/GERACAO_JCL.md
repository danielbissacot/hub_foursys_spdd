---
applyTo: '**/*.jcl, **/*.txt'
name: Geração de JCL (Job Control Language)
description: Cria scripts JCL completos para compilação, link-edit e execução de programas COBOL no z/OS.
metadata:
  version: "0.0.1"
---

# Template: Geração de JCL

**Instruções de Uso:**
Use este prompt para criar o arquivo de controle de execução (Job) do seu programa. Forneça o nome do programa e a classe de execução.

---

### 📋 Comando Base do Sistema

```text
Atue como um Analista de Suporte e Operações de Mainframe (Sysprog).

Sua tarefa é gerar um JCL completo e funcional para o cenário abaixo:

### ⚙️ Especificações do JOB:
- **Nome do Job:** [JOBNAME, ex: JOBPROG1].
- **Programa:** [NOME-PROG, ex: PROG001].
- **Arquivos:** Entrada (DDNAME=[INPUTDD]) e Saída (DDNAME=[OUTPUTDD]).
- **Parâmetros:** Classe de execução [A/B/C], Limite de Tempo [MM minutos].

### 🛠️ Etapas Necessárias:
1. **Etapa de Compilação:** Incluir bibliotecas padrão de sistema.
2. **Etapa de Link-edit:** Gerar o módulo executável no LOADLIB.
3. **Etapa de Execução:** Alocação correta de datasets (DISP=SHR, DISP=CATLG, etc).

### ✅ O código gerado deve:
- Seguir a sintaxe rigorosa do JCL do z/OS.
- Incluir comentários explicativos sobre cada etapa.
```
