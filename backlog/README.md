# 📋 Gestão de Backlog Local

Bem-vindo à área de gestão de demandas do projeto. Esta pasta serve como o ponto de entrada para novas histórias de usuário e requisitos que precisam de refinamento.

## 📂 Estrutura de Pastas

*   **`input/`**: Coloque aqui seus rascunhos de histórias em formato `.md`. 
    *   *Exemplo:* `JIRA-123-criar-tela-login.md`
*   **`refined/`**: Onde o Agente de Refinamento salvará a versão final da história após o processamento.

## 🤖 Como usar o Agente de Refinamento

Sempre que você colocar uma nova história na pasta `input/`, abra o arquivo no VS Code e siga estes passos:

1.  Chame o Agente: Digite `#AGENTE_REFINAMENTO.md` no chat.
2.  Dê o comando: *"Refine este rascunho de acordo com o padrão do Hub."*
3.  O Agente processará o arquivo e sugerirá a versão final para ser movida para a pasta `refined/`.

---
> **Dica:** Use o template `catalog/templates/1_prompts_historias/REFINAMENTO_AGIL.md` como base para criar seus rascunhos iniciais.
