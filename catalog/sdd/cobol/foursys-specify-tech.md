---
name: Especificação Técnica Etapa 3 — COBOL
description: Injeção da Etapa 3 do Specify para projetos COBOL com WORKING-STORAGE, PERFORM, CALL e copybooks.
metadata:
  version: "1.0.0"
---

### 3. Derivação da História Técnica — COBOL Mainframe
- Mapeie os componentes técnicos impactados: Programas COBOL (batch ou CICS online), Paragraphs (PERFORM), Copybooks (COPY), Subprogramas (CALL), Arquivos VSAM ou datasets sequenciais (SELECT/ASSIGN/FD), JCL Steps (EXEC PGM=), acessos DB2 (EXEC SQL ... END-EXEC).
- Indique os Critérios de Aceite Técnicos: validação de campos na WORKING-STORAGE (PIC clause correta), tratamento de FILE STATUS (88-levels para condições), códigos de retorno (RETURN-CODE) em todos os CALLs, cobertura de paragraphs >= 95%, JCL de teste aprovado pelo time de operações.
- ⚠️ NÃO USE padrões Java, Angular, Node.js ou linguagens modernas. Este é um projeto COBOL Mainframe.

Item 5 da saída: ⚙️ **Especificação Técnica COBOL:** Programas afetados, copybooks necessários, JCL de execução, paragraphs críticas a implementar, checklist técnico do desenvolvedor COBOL/Mainframe.
