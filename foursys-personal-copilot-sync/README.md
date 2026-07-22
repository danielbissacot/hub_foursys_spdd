# Foursys Personal Copilot Sync

Guia rápido para instalar e usar as Skills, Agents e Instructions da Foursys direto no GitHub Copilot — no VS Code, no IntelliJ, ou em qualquer editor que suporte Copilot. Sem instalar extensão nenhuma, sem poluir o repositório do projeto onde você está trabalhando.

## O que é isso?

Todo o conhecimento do Hub Foursys (o processo SDD — constitution, specify, plan, tasks — e as skills técnicas de cada stack) agora também está disponível de forma **nativa** dentro do próprio Copilot, como Skills e Agents que você chama direto no chat, igual chamaria qualquer recurso do Copilot.

Isso é uma via **paralela** ao Hub que já existe (`@foursys_sdd_po`) — não substitui nada, é uma alternativa pra quem quer usar via VS Code puro, IntelliJ, ou o Copilot CLI no terminal, sem precisar da extensão instalada.

## Instalação (1 comando, leva alguns segundos)

Abra um terminal PowerShell (pode ser o terminal integrado do VS Code ou do IntelliJ, ou o PowerShell do Windows normal) e cole:

```powershell
irm https://raw.githubusercontent.com/danielbissacot/hub_foursys_spdd/main/foursys-personal-copilot-sync/install.ps1 | iex
```

Aperte Enter e espere terminar. Pronto — instalado.

**Pré-requisitos**: ter Git e Node.js instalados (a maioria das máquinas de desenvolvimento já tem os dois).

Depois de instalar, **recarregue a janela** do seu editor pra ele reconhecer as novidades:
- VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
- IntelliJ: feche e abra o programa de novo

## Como usar

### Chamar uma Skill

No chat do Copilot, digite `/` seguido do nome da skill. Exemplos:

```
/foursys-specify-angular
/foursys-constitution-spring_boot
/foursys-tasks-cobol
```

Cada fase do SDD (`constitution`, `specify`, `plan`, `tasks`) existe pra cada stack (Angular, Spring Boot, Node, COBOL, iOS, Android) — o Copilot autocompleta o nome conforme você digita `/foursys-`.

Além dos playbooks do SDD, também tem dezenas de skills técnicas específicas (Kafka, MongoDB, Redis, testes, etc.) — digite `/` e o nome da tecnologia pra encontrar.

### Deixar o Copilot descobrir a fase sozinho

Em vez de chamar cada fase manualmente, selecione o Agent **`foursys-sdd-orchestrator`** (no seletor de "Agent" do chat) e simplesmente pergunte algo como:

> "qual a próxima fase do SDD pra esse projeto?"

Ele detecta a stack do projeto sozinho, verifica o que já foi feito, e te diz (ou já executa) a próxima fase.

### Usar uma persona especialista

Também dá pra selecionar direto o Agent do especialista da sua stack (`agente-spring_boot-foursys`, `agente-angular-foursys`, `agente-cobol-foursys`, `agente-ios-foursys`, `agente-android-foursys`, ou `agente-negocio-foursys` pra refinamento de negócio), pra ter uma conversa guiada por aquela persona.

## Atualizando

O catálogo de skills muda com o tempo. Pra atualizar, rode o **mesmo comando da instalação** de novo — ele baixa a versão mais recente e sincroniza tudo automaticamente. Não precisa desinstalar nada antes.

## Perguntas frequentes

**Preciso instalar alguma extensão?**
Não. Isso usa só os recursos nativos do próprio GitHub Copilot.

**Funciona no IntelliJ?**
Sim, automaticamente — é a mesma instalação, sem passo extra. Só confirme que "Enable Skills" e "Enable Custom Agent" estão marcados em Settings → Tools → GitHub Copilot → Chat (já vem ligado por padrão na maioria dos casos).

**Não aparece nada depois de instalar.**
Recarregue a janela do editor (veja a seção de Instalação acima) — as vezes a lista de skills só atualiza depois disso.

**Funciona no Copilot CLI (terminal)?**
Em princípio sim (mesmo mecanismo), mas hoje o Copilot CLI standalone ainda depende de uma política da organização que precisa ser habilitada pelo time de TI/admin do GitHub. Use pelo chat do VS Code ou IntelliJ normalmente enquanto isso.

**Isso substitui o Hub (`@foursys_sdd_po`)?**
Não. São duas formas paralelas de acessar o mesmo conhecimento — use a que preferir.
