# 🏛️ Instrução Global: Clean Code em COBOL

*Esta instrução define os padrões de legibilidade e manutenabilidade para o código Mainframe. A IA deve aplicar estas regras em qualquer refatoração ou geração de novos programas.*

---

## 1. Regras de Ouro (Golden Rules)

1.  **Eliminação de `GO TO`:** O uso de `GO TO` é proibido, exceto em rotinas de tratamento de erro críticas no fim da `PROCEDURE DIVISION`. Use `PERFORM` e `EVALUATE` para controle de fluxo.
2.  **Modularização:** Divida a lógica em `SECTIONS` ou `PARAGRAPHS` pequenos e com responsabilidade única.
3.  **Identação:** Use identação consistente (4 espaços) para blocos dentro de `IF`, `EVALUATE` e `PERFORM`.

## 2. Nomenclatura Descritiva (Naming Standards)

- **Variáveis de Trabalho (Working-Storage):** Devem começar com o prefixo `WS-` (ex: `WS-VALOR-TOTAL`).
- **Variáveis de Linkage:** Devem começar com `LS-` (ex: `LS-COD-RETORNO`).
- **Nomes de Parágrafos:** Devem ser verbos indicando a ação (ex: `P100-PROCESSAR-CALCULO`).
- **Nomes de Arquivos:** Devem seguir o padrão exigido pelo JCL (ex: `FILE-CLIENTES` associado ao `DD-CLIENTE`).

## 3. Lógica e Decisão

- **Prefira `EVALUATE`:** Sempre que houver mais de duas condições, substitua `IF` aninhados por um bloco `EVALUATE` para melhor legibilidade.
- **Booleanos (Level 88):** Use itens de nível 88 para representar estados de variáveis (ex: `88 STATUS-ATIVO VALUE 'A'`). Evite comparar strings mágicas diretamente na Procedure Division.

## 4. Comentários de Qualidade

- **Propósito:** Comente o "Porquê" da lógica, não o "O quê". O código deve ser o mais autoexplicativo possível.
- **Colunas:** Mantenha os comentários na coluna 7 (marcador `*`) seguindo o padrão padrão de 72 colunas.

---
> **"Código COBOL limpo é a base para uma modernização sem traumas."** - Arquiteto de Governança
