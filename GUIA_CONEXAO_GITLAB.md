# 🚀 Guia Rápido: Conectar Microserviço ao Hub de IA

Siga estes **3 passos diretos** para que a Inteligência Artificial do seu microserviço passe a usar as regras, personas e templates do Hub Central de forma rápida e simples.

---

### ⚡ Instalação Rápida (Um Clique - Modo Ultra Simples)
Copie e cole este comando (Windows) no terminal do seu microserviço. Ele baixa os prompts e coloca **todos na raiz** da pasta `ai-rules`, facilitando a busca no chat (removido o ponto inicial para melhor busca na IDE):

```powershell
Remove-Item -Path ai-rules -Recurse -Force -ErrorAction SilentlyContinue; mkdir -p ai-rules; git clone --branch hub-ia-arquitetura --depth 1 https://oauth2:Z5H2fDfprUFTJKyriWzy@gitlab.fourcamp.com/daniel.bissacot/ai-governance-hub.git .temp; Get-ChildItem -Path .temp -Filter *.md -Recurse | Copy-Item -Destination ai-rules/; Remove-Item -Path .temp -Recurse -Force; Add-Content -Path .gitignore -Value "`nai-rules/" -ErrorAction SilentlyContinue; echo "✅ Hub Simplificado: Prompts prontos na raiz de ai-rules!"
```

---

### Passo 1: Salvar a Chave no GitLab (Cofre)
No repositório do seu **Microserviço**:
1. Vá em **Settings** -> **CI/CD** -> **Variables**.
2. Clique em **Add variable**.
3. **Key:** `HUB_TOKEN`
4. **Value:** `Z5H2fDfprUFTJKyriWzy`
5. Marque a opção **"Mask variable"** (para esconder a senha nos logs).
6. Clique em **Add variable**.

> [!IMPORTANT]
> **TOKEN:** Use a Role **`Reporter`** e o escopo **`read_repository`**.

---

### Passo 2: Configurar o Robô (.gitlab-ci.yml)
Cole o código abaixo no arquivo **`.gitlab-ci.yml`** na pasta raiz do seu Microserviço. Ele automatiza a simplificação das pastas no servidor:

```yaml
# Tarefa que busca as leis do Hub de forma simplificada
sincronizar-ia-hub:
  stage: build
  script:
    - echo "Sincronizando com o AI Governance Hub (Modo Simplificado)..."
    - mkdir -p ai-rules
    - git clone --branch hub-ia-arquitetura --depth 1 https://oauth2:Z5H2fDfprUFTJKyriWzy@gitlab.fourcamp.com/daniel.bissacot/ai-governance-hub.git .temp
    # Comando para trazer todos os .md para a raiz e limpar subpastas
    - find .temp -name "*.md" -exec cp {} ai-rules/ \;
    - rm -rf .temp
  artifacts:
    paths:
      - ai-rules/
```

#### 🪄 Atalho da IA (O Prompt de Ouro):
Copie o texto abaixo e cole no chat da sua IA (Antigravity/Cursor) para configurar **TUDO** em uma única vez:

> **"Antigravity, configure este microserviço para usar o AI Governance Hub com estes 3 passos técnicos:**
> 
> **1. SETUP LOCAL:** No terminal, execute: `mkdir -p ai-rules; git clone --branch hub-ia-arquitetura --depth 1 https://oauth2:Z5H2fDfprUFTJKyriWzy@gitlab.fourcamp.com/daniel.bissacot/ai-governance-hub.git .temp; Get-ChildItem -Path .temp -Filter *.md -Recurse | Copy-Item -Destination ai-rules/; Remove-Item -Path .temp -Recurse -Force; Add-Content -Path .gitignore -Value 'ai-rules/'`
> 
> **2. ROBÔ GITLAB:** Crie o arquivo `.gitlab-ci.yml` na raiz com este conteúdo:
> ```yaml
> sincronizar-ia-hub:
>   stage: build
>   script:
>     - mkdir -p ai-rules
>     - git clone --branch hub-ia-arquitetura --depth 1 https://oauth2:Z5H2fDfprUFTJKyriWzy@gitlab.fourcamp.com/daniel.bissacot/ai-governance-hub.git .temp
>     - find .temp -name '*.md' -exec cp {} ai-rules/ \;
>     - rm -rf .temp
>   artifacts:
>     paths:
>       - ai-rules/
> ```
> 
> **3. CONFIRMAÇÃO:** Me avise quando terminar para eu testar a chamada dos prompts com o `@`."**

---

### Passo 3: Como usar no dia a dia da IDE (Exemplo Rápido)
Com a estrutura simplificada, todos os prompts aparecem direto ao digitar:
1. Digite o símbolo **`#`** (ou **`@`**).
2. Escreva apenas o nome do arquivo (ex: `validacao`).
3. Selecione o arquivo e pronto! (O nome da pasta agora é `ai-rules`, permitindo que a busca da IDE encontre tudo).

---

### 🛡️ Nota de Segurança
Este guia usa o token `Z5H2...` para seu uso pessoal. No GitLab Real, use a variável `${HUB_TOKEN}`.
