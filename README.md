# 🏗️ AI Governance Hub

<p align="center">
  <img src="./docs/assets/hub_ia_infographic.png" width="800" alt="AI Governance Hub - Arquitetura">
</p>

Bem-vindo ao **Cérebro Operacional** do nosso time. Este repositório é o centro de referência técnica para o uso estratégico de Inteligência Artificial no desenvolvimento de software de alta performance.

---

## 🎯 Nossa Missão

Capacitar desenvolvedores através de **Engenharia de Prompt**, facilitando a adoção de padrões modernos e garantindo a qualidade técnica em toda a nossa stack.

---

## 🛠️ Pilares Tecnológicos

Nossas diretrizes de IA estão otimizadas para:

- **Java 21**: Uso de Records, Virtual Threads e sintaxe moderna.
- **Arquitetura Hexagonal**: Separação clara entre Domínio, Aplicação e Adaptadores.
- **Angular v18+**: Componentização reativa com **Signals** e Standalone Components.

---

## 🚀 Início Rápido (Quick Start)

Para conectar um Microserviço a este Hub em **2 segundos**, siga o passo abaixo:

### 1. Instalação Rápida (Terminal)
No terminal do seu projeto, cole este comando (Windows):
```powershell
Remove-Item -Path ai-rules -Recurse -Force -ErrorAction SilentlyContinue; mkdir -p ai-rules; git clone --branch hub-ia-arquitetura --depth 1 https://oauth2:Z5H2fDfprUFTJKyriWzy@gitlab.fourcamp.com/daniel.bissacot/ai-governance-hub.git .temp; Get-ChildItem -Path .temp -Filter *.md -Recurse | Copy-Item -Destination ai-rules/; Remove-Item -Path .temp -Recurse -Force; Add-Content -Path .gitignore -Value "`nai-rules/" -ErrorAction SilentlyContinue; echo "✅ Hub Conectado com Sucesso!"
```

### 2. O Prompt de Ouro (AI Chat)
No chat da sua IA (Antigravity/Cursor), cole este comando para configurar tudo (Local + Gitlab CI):
> **"Antigravity, configure este microserviço para usar o AI Governance Hub. 1. Sincronize os arquivos locais na pasta ai-rules de forma simplificada. 2. Crie o arquivo .gitlab-ci.yml com a lógica de sincronização flat. 3. Configure o .gitignore."**

---

## 📂 Arquitetura do Repositório

O conteúdo está organizado dentro da pasta `/catalog`:

- [**`/agents_skills`**](./catalog/agents_skills): **System Prompts** configurados para transformar LLMs em personas especialistas.
- [**`/instructions`**](./catalog/instructions): **Regras Globais** ("Constituição") que definem nossos padrões técnicos.
- [**`/templates`**](./catalog/templates): Nossa esteira de desenvolvimento em 4 fases.

---

## 🛠️ Como Utilizar no Dia a Dia

1. **Chame a Regra**: Digite `#` ou `@` e comece a digitar o nome da regra (ex: `#validacao`).
2. **Execute a IA**: Peça para ela ler o prompt e aplicar no seu código atual.

---

## 👥 Governança e Apoio

Este hub é mantido pela equipe para garantir a evolução contínua das nossas práticas.

- **Focal Point Técnico:** Daniel
- **Time Principal:** Regiane

---
> [!TIP]
> *Um bom prompt economiza 80% do trabalho de refatoração. Use os templates!*
