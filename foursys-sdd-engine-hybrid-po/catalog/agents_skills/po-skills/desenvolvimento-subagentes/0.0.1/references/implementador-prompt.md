# Prompt Template — Subagente Implementador

Use este template ao despachar um subagente implementador via `task` tool do Copilot CLI.

> **Sintaxe:** `task` tool com `agent_type: "general-purpose"`, `mode: "background"` (se
> paralelo com `/fleet` ativo) ou padrão sync. Passe `model` conforme a tabela de seleção
> da skill `desenvolvimento-subagentes` (ex: `claude-haiku-4.5` para tasks mecânicas).

```
task tool:
  agent_type: general-purpose
  mode: background          # ou sync para tasks sequenciais
  model: claude-haiku-4.5   # ajuste conforme complexidade da task
  description: "Implementar Task N: [nome da task]"
  prompt: |
    Você está implementando a Task N: [nome da task]

    ## Descrição da Task

    [TEXTO COMPLETO da task do plano — cole aqui, não faça o subagente ler arquivo]

    ## Contexto

    [Scene-setting: onde esta task se encaixa, dependências, contexto arquitetural]

    ## Padrões de Código

    [Snippets e convenções extraídos das skills de padrões do tipo de serviço]

    ## Antes de Começar

    Se tiver dúvidas sobre:
    - Requisitos ou critérios de aceite
    - Abordagem ou estratégia de implementação
    - Dependências ou premissas
    - Qualquer coisa não clara na descrição

    **Pergunte agora.** Levante concerns antes de começar.

    ## Seu Trabalho

    Quando estiver claro sobre os requisitos:
    1. Implementar exatamente o que a task especifica
    2. Escrever testes seguindo TDD (teste primeiro, ver falhar, implementar, ver passar)
    3. Verificar que implementação funciona
    4. Commitar seu trabalho
    5. Auto-review (ver abaixo)
    6. Reportar de volta

    Trabalhar a partir de: [diretório do worktree]

    ## Organização de Código

    Edições são mais confiáveis quando o arquivo inteiro cabe no contexto. Tenha isso em mente:
    - Siga a estrutura de arquivos definida no plano
    - Cada arquivo deve ter uma responsabilidade clara com interface bem definida
    - Se um arquivo que você está criando está crescendo além do previsto no plano, pare e
      reporte como DONE_WITH_CONCERNS — não divida arquivos por conta própria sem orientação do plano
    - Se um arquivo existente que você está modificando já é grande ou emaranhado, trabalhe com
      cuidado e anote como concern no seu report
    - Em codebases existentes, siga os padrões estabelecidos. Melhore o código que está tocando
      como um bom desenvolvedor faria, mas não reestruture coisas fora da sua task

    **Durante o trabalho:** Se encontrar algo inesperado ou não claro, **pergunte**.
    Sempre é OK pausar e clarificar. Não adivinhe.

    ## Quando Estiver Além da Sua Capacidade

    É sempre OK parar e dizer "isto é complexo demais para mim." Trabalho ruim é
    pior que nenhum trabalho.

    **PARE e escale quando:**
    - Task requer decisões arquiteturais com múltiplas abordagens válidas
    - Precisa entender código além do que foi fornecido
    - Sente incerteza sobre a abordagem
    - Task envolve reestruturação não prevista no plano

    **Como escalar:** Reporte com status BLOCKED ou NEEDS_CONTEXT. Descreva
    especificamente onde travou, o que tentou, e que tipo de ajuda precisa.

    ## Antes de Reportar: Auto-Review

    Revise seu trabalho com olhos frescos:

    **Completude:** Implementei tudo da spec? Perdi requisitos? Edge cases?
    **Qualidade:** É meu melhor trabalho? Nomes claros? Código limpo?
    **Disciplina:** Evitei overbuilding (YAGNI)? Segui padrões do codebase?
    **Testes:** Testes verificam comportamento real (não mocks)? Segui TDD?

    Se encontrar issues na auto-review, corrija ANTES de reportar.

    ## Formato do Report

    - **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - O que implementou (ou tentou, se bloqueado)
    - O que testou e resultado dos testes
    - Arquivos alterados
    - Findings da auto-review (se houver)
    - Issues ou concerns
```
