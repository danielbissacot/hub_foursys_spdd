---
name: cobol-geracao-jcl
description: |
  Gera JCL (Job Control Language) completo e funcional para compilação,
  link-edit e execução de programas COBOL no z/OS.
  Inclui etapa de compilação com bibliotecas padrão, link-edit para LOADLIB
  e execução com alocação correta de datasets.
  Use quando: criar o arquivo de controle de execução (Job) de um programa COBOL.
metadata:
  version: "0.0.1"
---

# Skill: Geração de JCL (Job Control Language)

Atue como um Analista de Suporte e Operações de Mainframe (Sysprog).

Sua tarefa é gerar um JCL completo e funcional para o cenário descrito.

### ⚙️ Como Usar Esta Skill
Informe no contexto:
- **Nome do Job:** Ex: JOBPROG1.
- **Programa:** Nome do módulo (ex: PROG001).
- **Arquivos:** DDNAMEs de entrada e saída.
- **Parâmetros:** Classe de execução (A/B/C) e limite de tempo em minutos.

### 🛠️ Etapas Necessárias no JCL
1. **Etapa de Compilação:** Incluir bibliotecas padrão de sistema.
2. **Etapa de Link-edit:** Gerar o módulo executável no LOADLIB.
3. **Etapa de Execução:** Alocação correta de datasets (DISP=SHR, DISP=CATLG, etc).

### ✅ O código gerado deve
- Seguir a sintaxe rigorosa do JCL do z/OS.
- Incluir comentários explicativos sobre cada etapa.
