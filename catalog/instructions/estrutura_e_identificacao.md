# 🏛️ Instrução Global: Estrutura e Identificação COBOL

*Esta instrução define o esqueleto obrigatório e a organização das divisões para garantir que todos os programas sigam a mesma taxonomia.*

---

## 1. IDENTIFICATION DIVISION

Todo programa deve conter o cabeçalho padronizado abaixo:

```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID.       NOMEDOPROG.
       AUTHOR.           [NOME DO DESENVOLVEDOR].
       INSTALLATION.     [NOME DA EMPRESA].
       DATE-WRITTEN.     DD/MM/AAAA.
      *---------------------------------------------------------------*
      * OBJETIVO: [DESCRICAO CURTA DA FUNCIONALIDADE]                 *
      *---------------------------------------------------------------*
      * HISTORICO DE ALTERACOES:                                      *
      * DATA       AUTOR           DESCRICAO                          *
      * ---------- --------------- ---------------------------------- *
      * DD/MM/AAAA [NOME]          [JUSTIFICATIVA DA ALTERACAO]       *
      *---------------------------------------------------------------*
```

## 2. ENVIRONMENT DIVISION

- **CONFIGURARIION SECTION:** Sempre definir `SOURCE-COMPUTER` e `OBJECT-COMPUTER`.
- **INPUT-OUTPUT SECTION:** Mapear `SELECT` de arquivos de forma organizada, agrupando por tipo (entrada, saída, temporários).

## 3. DATA DIVISION

- **FILE SECTION:** Nomes de FD devem ser claros.
- **WORKING-STORAGE SECTION:**
    - Nível **01** para agrupadores lógicos.
    - Nível **05** a **49** para campos individuais.
    - Nível **77** para variáveis independentes (usar com moderação).
    - Nível **88** para indicadores de condição.
- **LINKAGE SECTION:** Deve mapear fielmente os contratos de chamada (Commareas ou Parâmetros).

## 4. PROCEDURE DIVISION

- **Seção de Entrada:** Início do programa com abertura de recursos.
- **Seção de Processamento:** Loop principal e lógica de negócio.
- **Seção de Saída:** Finalização do programa, fechamento de arquivos e definição do `RETURN-CODE`.
- **Uso de `GOBACK`:** Prefira `GOBACK` em vez de `STOP RUN` para garantir o retorno correto do controle ao sistema operacional ou programa chamador.

---
> **"A estrutura é o mapa que guia o próximo desenvolvedor pelo seu código."** - Mentor do Hub
