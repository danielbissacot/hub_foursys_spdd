# 🏛️ Instrução Global: Segurança e Performance em Mainframe

*Esta instrução foca no gerenciamento de recursos críticos de hardware e software (Z/OS), garantindo a estabilidade e o baixo consumo de CPU/MIPS.*

---

## 1. Gerenciamento de Arquivos e Recursos

- **OPEN/CLOSE:** Todo arquivo aberto deve ser explicitamente fechado antes do término do programa ou em caso de erro fatal.
- **FILE-STATUS:** É obrigatório verificar o `FILE-STATUS` após cada operação de leitura (READ), escrita (WRITE) ou abertura (OPEN). Não assuma sucesso sem validação.
- **Bloqueio de Registros:** Evite manter registros travados desnecessariamente.

## 2. Otimização de Performance (MIPS Friendly)

- **Loops Eficientes:** Minimize o número de cálculos dentro de loops `PERFORM`.
- **Buscas em Tabelas:** Use `SEARCH ALL` (busca binária) sempre que a tabela estiver ordenada. O `SEARCH` linear deve ser evitado para grandes volumes de dados.
- **Níveis de Indexação:** Utilize índices (`INDEXED BY`) em vez de subscritos (`DEPENDING ON`) para melhor performance em acessos a tabelas.
- **Cálculos Numéricos:** Use campos `PACKED-DECIMAL` (COMP-3) para cálculos financeiros para garantir precisão e performance de CPU.

## 3. Segurança e Robustez

- **Validadores Numéricos:** Use o `IF NUMERIC` para validar campos de entrada antes de realizar cálculos, prevenindo o erro OC7 (Data Exception).
- **Limites de Array:** Garanta que os acessos a tabelas não ultrapassem o limite definido (`OCCURS`), prevenindo o erro OC4 (Protection Exception).
- **Tratamento de Abend:** Implemente rotinas de saída limpa (Clean Exit) para capturar erros de execução e registrar mensagens de log úteis antes do término forçado.

---
> **"Performance em Mainframe é dinheiro. Cada instrução economizada é valor para o negócio."** - Arquiteto de Performance do Hub
