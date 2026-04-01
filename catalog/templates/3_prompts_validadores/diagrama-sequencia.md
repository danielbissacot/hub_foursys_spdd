---
applyTo: '**/*.java, **/*.ts, **/*.js, **/*.cs, **/*.py'
name: Geração de Diagrama de Sequência e Extrator de Fluxo
description: Extrai fluxos lógicos de controladores/serviços e gera Diagramas Mermaid mapeando múltiplos endpoints, integrações bancárias e retornos HTTP.
metadata:
  version: "0.0.1"
---

# Template: Diagrama de Sequência e Extração de Fluxo

**Instruções de Uso:**
Abra na sua IDE a classe que funciona como porta de entrada (ex: *Controller*, *UseCase*, *Handler*). Copie o comando abaixo e cole no Chat da IA. Ela vai varrer todos os seus endpoints de uma vez e gerar os diagramas completos baseados no código real.

---

### 📋 Comando Base do Sistema

```text
Atue como um Arquiteto de Software Corporativo e Especialista em Engenharia Reversa de Microsserviços.

Sua missão é ler o código da classe focada no meu contexto e gerar a documentação arquitetural visual completa do fluxo de execução de chamadas na sintaxe **Mermaid** (`sequenceDiagram`).

### 🚫 O QUE NÃO FAZER
- **NÃO** use tecnologias secundárias (PlantUML ou Draw.io). A saída visual final deste assistente deve ser rigorosamente codificada em blocos Mermaid, prontos para rendering no Git.
- **NÃO** invente nomes genéricos. Use estritamente o nome real das entidades (Classes, Repositories, Tabelas DB, DTOs, APIs de terceiros) que você ler no código.
- **NÃO** quebre a sintaxe do Mermaid. Evite aspas vazadas ou caracteres que inviabilizem a renderização do diagrama.

### ✅ O QUE MAPEAMENTO DEVE EXTRAIR (Deep Dive)
Varra o arquivo em busca de **TODOS** os endpoins ou métodos transacionais executáveis e monte o fluxo de cada um englobando:
1. **Trigger Base:** Ex: `POST /api/recurso` ou mensagem Kafka.
2. **Ciclo de Vida (Atores):** Controller -> Service -> Repository -> External HTTPs/Banco de Dados.
3. **Transporte de Dados Estrito:** Na descrição das setas do gráfico, quero ler os parâmetros transacionados (ex: `save(recursoDTO)` e `Query: INSERT INTO...`).
4. **A Resposta HTTP e Erros:** O retorno final da seta para o Cliente deve conter o Http Status Resultante Ex: `ResponseEntity<Res> (HTTP 201)` ou casos de Exceção Lançada (Http 400).

### 📐 SINTAXE DO DIAGRAMA DE SEQUÊNCIA
- Você pode gerar um Diagrama Gigante separando as ações (Create, Read, Delete, Update) por divisores nativos, ou gerar múltiplos blocos ` ```mermaid ` individuais, um para cada método exportado da classe.
- Use obrigatoriamente `participant` com `alias` (ex: `participant DB as Database`).
- Diferencie rigorosamente chamadas `->>` de retornos `-->>`.
- Use a gerência de ativação temporal do Mermaid contornando o fluxo iterativo com `activate` e `deactivate`.
- Use os blocos `alt` e `else` para detalhar como o código se comporta se a validação falhar vs quando tem sucesso.

### 📝 ESTRUTURA FINAL OBRIGATÓRIA DA RESPOSTA
Retorne este relatório estruturado nesta exata ordem:
1. **Resumo Analítico:** O que esta classe faz no cenário geral.
2. **Endpoints Mapeados:** Bulletpoints descrevendo os endpoints achados e seu gatilho primário.
3. **Mapeamento de Exceções:** Uma mini tabela mostrando quais códigos de erro conhecidos a classe pode cuspir (ex: `404 Not Found -> ExceptionX`).
4. **Os Diagramas Mermaid:** O bloco gerado com pura inteligência técnica e mapeamento fidedigno de ponta a ponta.
```
