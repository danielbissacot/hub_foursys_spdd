# Foursys SDD Engine Hybrid PO

Motor de **Spec-Driven Development (SDD)** com **Product Owner Agent** integrado — leva a demanda do
levantamento de negócio até o código implementado, dentro do VS Code, usando o GitHub Copilot.

## O que a extensão faz

### 🎯 Product Owner Agent
Painel próprio para estruturar o negócio **antes** de codar:
- **Discovery** conversacional — inclusive anexando um documento existente (`.md`/`.txt`/`.csv`/`.json`) como contexto.
- **PRD** gerado a partir do Discovery aprovado.
- **User Stories** geradas a partir do PRD, prontas para entrar direto no fluxo técnico — sem copiar e colar entre documentos.
- 12 skills de apoio (Business Reviewer, BPMN Generator, Mermaid Generator, APF Rules, export para Jira/Confluence, entre outras).

### 🔄 Fluxo SDD (Constitution → Specify → Plan → Tasks → Implement)
As 5 fases do desenvolvimento guiado por especificação, disponíveis tanto no chat (`@foursys_sdd_po`)
quanto no menu de comandos (`Ctrl+Shift+P` → "Foursys: ..."):

| Fase | O que faz |
|---|---|
| **Constitution** | Gera os princípios e padrões de governança do projeto para a stack ativa |
| **Specify** | Define a especificação de negócio (User Story) |
| **Plan** | Gera o plano de implementação técnica |
| **Tasks** | Quebra o plano em tarefas granulares |
| **Implement** | Executa a codificação com base nas tarefas e nas skills da stack ativa |

### 📚 Catálogo de Skills por Stack
Padrões técnicos prontos para Angular, Java 21 + Spring Boot, Node.js/NestJS, COBOL, iOS, Android e
sistemas Java Legado — navegável pela aba **Catalog** na sidebar ou via `/skill <nome>` no chat.

### ✅ QA Automatizado
Plano de Testes → Casos de Teste (BDD/Gherkin) → Scripts de Automação → Review de Cobertura →
Relatório de Qualidade, com exportação direta para **Xray/Jira**.

### 🛡️ Segurança
Integração com **Mend Advise** — análise de vulnerabilidades (CVEs) direto no painel Problems do VS Code.

### 🎨 Figma MCP
Importação de mockups de tela direto do Figma como referência visual para as User Stories.

### 📊 Telemetria de uso (opt-in)
Coleta mínima (e-mail, fase/skill executada, stack ativa, estimativa de tokens/créditos) para medir
adoção e priorizar manutenção — nunca coleta código ou conteúdo dos projetos. Desative a qualquer
momento com `Foursys: Desativar Telemetria`. Detalhes completos em `PRIVACY.md`.

## Como usar

1. Abra a extensão pelo ícone na Activity Bar (**Foursys SDD Hybrid**).
2. Clique em **Atualizar Skills** para sincronizar o catálogo mais recente do Hub.
3. Selecione a stack do projeto (ou deixe a detecção automática).
4. Use o painel **Dev** para seguir o fluxo SDD passo a passo, ou abra o **Product Owner Agent** para
   começar pelo negócio.
5. Explore a aba **Catalog** para acionar qualquer skill ou playbook diretamente.

## Configurações

| Setting | Descrição |
|---|---|
| `foursys.modelOverride` | Força um modelo específico (vazio = modelo otimizado por fase) |
| `foursys.tokenBudget` | Limite de tokens de entrada por chamada (padrão: 4500) |
| `foursys.xrayJiraUrl` | URL base do Jira com Xray instalado |
| `foursys.xrayProjectKey` | Chave do projeto Jira onde os testes serão criados |
