# 🚀 Guia de Conexão: AI Governance Hub

Escolha **UMA** das opções abaixo para conectar este Microserviço ao Hub de Governança em segundos.

---

### 🪄 Opção A: Pela Inteligência Artificial (Recomendado)

Copie o texto abaixo e cole no Chat da sua IDE (Antigravity ou Cursor). Ela fará toda a configuração, download e limpeza sozinha:

> **"Olá, Assistente de IA! Por favor, configure este microserviço para usar o AI Governance Hub com estes 3 passos: 1. No terminal, execute: `Remove-Item -Path ai-rules, .temp -Recurse -Force -ErrorAction SilentlyContinue; mkdir ai-rules; git clone --branch hub-ia-arquitetura --depth 1 https://oauth2:Z5H2fDfprUFTJKyriWzy@gitlab.fourcamp.com/daniel.bissacot/ai-governance-hub.git .temp; Copy-Item -Path .temp/catalog/* -Destination ai-rules/ -Recurse -Force; git rm -r --cached ai-rules -ErrorAction SilentlyContinue; Remove-Item -Path .temp -Recurse -Force; $m=@('======================================================================','                MAPA DE ATIVOS: AI GOVERNANCE HUB','======================================================================','','Este arquivo ajuda voce a encontrar os prompts e agentes certos.','DICA: Use o gatilho # no chat da sua IDE para chamar os arquivos.','','[!] CATEGORIAS DE ACESSO RAPIDO:','','1. REFINAMENTO (User Stories e Requisitos)','------------------------------------------','- #ESTORIA_USUARIO.md','- #REQUISITOS_ESTRUTURADOS.md','','2. REGRAS TECNICAS (Implementacao)','----------------------------------','- #REGRAS_NEGOCIO_DOMAIN.md','','3. VALIDACAO (Qualidade e Compliance)','-------------------------------------','- #VALIDACAO_HEXAGONAL.md','- #CODE_REVIEW_SPRING.md | #CODE_REVIEW_ANGULAR.md','- #TESTES_UNITARIOS_SPRING.md | #TESTES_UNITARIOS_ANGULAR.md','','4. ENTREGA (Finalizacao e MR)','-----------------------------','- #RELEASE_NOTES.md','- #GIT_COMMIT_PATTERN.md','','5. LEGADO (Mainframe COBOL)','---------------------------','- #AGENTE_REVERSA_COBOL.md','- #ENGENHARIA_REVERSA_COMPLETA.md','','[+] AGENTES ESPECIALISTAS (MENTORES):','-------------------------------------','- #MENTOR_ARCHITECT_SPRING_HEXAGONAL.md','- #MENTOR_ARCHITECT_ANGULAR.md','','======================================================================','  Governança IA Bradesco - Hub v1.0.0','======================================================================') -join [Environment]::NewLine; $m | Out-File -FilePath MAPA_DO_HUB.txt -Encoding utf8; code MAPA_DO_HUB.txt`. 2. ROBÔ GITLAB: Crie o arquivo `.gitlab-ci.yml` na raiz com o conteúdo oficial do Hub. 3. Me avise quando terminar para eu usar o `#`."**
>
> ```yaml
> stages:
>   - validate
>   - build
> 
> # TRAVA DE SEGURANÇA: Bloqueia se alguém commitar as regras indevidamente
> validar-limpeza-hub:
>   stage: validate
>   script:
>     - if [ -d "ai-rules" ]; then echo "🛑 ERRO CRÍTICO! A pasta 'ai-rules' foi commitada no projeto. Remova-a e use o .gitignore corretamente."; exit 1; fi
>   rules:
>     - if: $CI_PIPELINE_SOURCE == "push"
> 
> # TAREFA DE SINCRONIZAÇÃO: Puxa as regras para uso em tempo de build
> sincronizar-ia-hub:
>   stage: build
>   script:
>     - mkdir ai-rules
>     - git clone --branch hub-ia-arquitetura --depth 1 https://oauth2:Z5H2fDfprUFTJKyriWzy@gitlab.fourcamp.com/daniel.bissacot/ai-governance-hub.git .temp
>     - cp -r .temp/catalog/* ai-rules/
>     - rm -rf .temp
>   artifacts:
>     paths:
>       - ai-rules/
> ```
>
> 1. Me avise quando terminar para eu usar o `#`."**

---

### ⚡ Opção B: Pelo Terminal (Um Clique)

Se você prefere o terminal, copie e cole este comando (Windows) na raiz do seu projeto:

```powershell
Remove-Item -Path ai-rules, .temp -Recurse -Force -ErrorAction SilentlyContinue; mkdir ai-rules; git clone --branch hub-ia-arquitetura --depth 1 https://oauth2:Z5H2fDfprUFTJKyriWzy@gitlab.fourcamp.com/daniel.bissacot/ai-governance-hub.git .temp; Copy-Item -Path .temp/catalog/* -Destination ai-rules/ -Recurse -Force; git rm -r --cached ai-rules -ErrorAction SilentlyContinue; Remove-Item -Path .temp -Recurse -Force; $m=@('======================================================================','                MAPA DE ATIVOS: AI GOVERNANCE HUB','======================================================================','','Este arquivo ajuda voce a encontrar os prompts e agentes certos.','DICA: Use o gatilho # no chat da sua IDE para chamar os arquivos.','','[!] CATEGORIAS DE ACESSO RAPIDO:','','1. REFINAMENTO (User Stories e Requisitos)','------------------------------------------','- #ESTORIA_USUARIO.md','- #REQUISITOS_ESTRUTURADOS.md','','2. REGRAS TECNICAS (Implementacao)','----------------------------------','- #REGRAS_NEGOCIO_DOMAIN.md','','3. VALIDACAO (Qualidade e Compliance)','-------------------------------------','- #VALIDACAO_HEXAGONAL.md','- #CODE_REVIEW_SPRING.md | #CODE_REVIEW_ANGULAR.md','- #TESTES_UNITARIOS_SPRING.md | #TESTES_UNITARIOS_ANGULAR.md','','4. ENTREGA (Finalizacao e MR)','-----------------------------','- #RELEASE_NOTES.md','- #GIT_COMMIT_PATTERN.md','','5. LEGADO (Mainframe COBOL)','---------------------------','- #AGENTE_REVERSA_COBOL.md','- #ENGENHARIA_REVERSA_COMPLETA.md','','[+] AGENTES ESPECIALISTAS (MENTORES):','-------------------------------------','- #MENTOR_ARCHITECT_SPRING_HEXAGONAL.md','- #MENTOR_ARCHITECT_ANGULAR.md','','======================================================================','  Governança IA Bradesco - Hub v1.0.0','======================================================================') -join [Environment]::NewLine; $m | Out-File -FilePath MAPA_DO_HUB.txt -Encoding utf8; code MAPA_DO_HUB.txt; echo "✅ Hub Conectado com Sucesso! (Mapa Gerado e Aberto)"
```

---

### 🛠️ O que foi configurado?

* **Pasta `ai-rules/`**: Contém todos os prompts. A pasta deve estar **COLORIDA** (não ignorada) para que a IA do VS Code possa indexar os arquivos e o `#` funcione.
* **Uso no Chat**: Agora você pode usar o **`#`** e começar a digitar o nome de qualquer prompt (ex: `#HEXAGONAL-JAVA`).
* **Mapa de Ativos (`MAPA_DO_HUB.txt`)**: Um arquivo gerado automaticamente com o índice de todos os prompts disponíveis para facilitar a sua navegação.
* **Segurança**: A trava de segurança contra commits da `ai-rules` é garantida automaticamente pelo GitLab CI.

---

### 🛡️ Nota para Gestores

Este processo utiliza um Token de Acesso Seguro com nível **Reporter** (apenas leitura). As regras do Hub são centralizadas e imutáveis por este microserviço, garantindo a governança global.

