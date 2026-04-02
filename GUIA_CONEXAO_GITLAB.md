# 🚀 Guia de Conexão: AI Governance Hub

Escolha **UMA** das opções abaixo para conectar este Microserviço ao Hub de Governança em segundos.

---

### 🪄 Opção A: Pela Inteligência Artificial (Recomendado)
Copie o texto abaixo e cole no Chat da sua IDE (Antigravity ou Cursor). Ela fará toda a configuração, download e limpeza sozinha:

> **"Olá, Assistente de IA! Por favor, configure este microserviço para usar o AI Governance Hub com estes 3 passos: 1. No terminal, execute: `mkdir -p ai-rules; git clone --branch hub-ia-arquitetura --depth 1 https://oauth2:Z5H2fDfprUFTJKyriWzy@gitlab.fourcamp.com/daniel.bissacot/ai-governance-hub.git .temp; Get-ChildItem -Path .temp -Filter *.md -Recurse | Copy-Item -Destination ai-rules/; Remove-Item -Path .temp -Recurse -Force; Add-Content -Path .gitignore -Value 'ai-rules/'`. 2. Crie o arquivo `.gitlab-ci.yml` na raiz com a lógica de sincronização flat para o GitLab. 3. Me avise quando terminar para eu usar o `@`."**

---

### ⚡ Opção B: Pelo Terminal (Um Clique)
Se você prefere o terminal, copie e cole este comando (Windows) na raiz do seu projeto:

```powershell
Remove-Item -Path ai-rules -Recurse -Force -ErrorAction SilentlyContinue; mkdir -p ai-rules; git clone --branch hub-ia-arquitetura --depth 1 https://oauth2:Z5H2fDfprUFTJKyriWzy@gitlab.fourcamp.com/daniel.bissacot/ai-governance-hub.git .temp; Get-ChildItem -Path .temp -Filter *.md -Recurse | Copy-Item -Destination ai-rules/; Remove-Item -Path .temp -Recurse -Force; Add-Content -Path .gitignore -Value "`nai-rules/" -ErrorAction SilentlyContinue; echo "✅ Hub Conectado com Sucesso!"
```

---

### 🛠️ O que foi configurado?
*   **Pasta `ai-rules/`**: Contém todos os prompts (leis da arquitetura, templates e personas).
*   **Uso no Chat**: Agora você pode usar **`@`** ou **`#`** e começar a digitar o nome de qualquer prompt (ex: `@hexagonal`).
*   **Gitlab CI**: O arquivo `.gitlab-ci.yml` garante que o servidor do GitLab também use essas regras para validar o código automaticamente.

---

### 🛡️ Nota para Gestores
Este processo utiliza um Token de Acesso Seguro com nível **Reporter** (apenas leitura). As regras do Hub são centralizadas e imutáveis por este microserviço, garantindo a governança global.
