# Privacidade — Telemetria de Uso

A extensão **Foursys SDD Hybrid PO** coleta um conjunto mínimo de dados de uso, com consentimento explícito, para medir adoção e priorizar manutenção por stack (Angular, Spring Boot, COBOL, Node...).

## O que é coletado

- **E-mail**: pedido uma única vez, na primeira ação executada na extensão. Usado como identificador de quem está usando a ferramenta.
- **Ação realizada**: qual comando/fase SDD (constitution, specify, plan, tasks, qa-*, po-*), skill ou playbook foi executado, ou qual stack foi selecionada.
- **Stack ativa**: qual tecnologia (Angular, Spring Boot, COBOL, Node, Generic) estava selecionada no momento da ação.
- **Consumo de tokens** (estimativa): quantidade de tokens usados na geração daquela fase/skill/playbook. É uma estimativa feita localmente pelo VS Code (`model.countTokens`), não o valor oficial de cobrança do provedor de IA.
- **Créditos** (estimativa): calculados a partir da tabela pública de preços do GitHub Copilot ([docs.github.com/pt/copilot/reference/copilot-billing/models-and-pricing](https://docs.github.com/pt/copilot/reference/copilot-billing/models-and-pricing)), aplicada sobre a estimativa de tokens acima. **Não é o valor exato cobrado da sua conta** — depende da contagem de tokens já ser aproximada e do modelo realmente usado estar na nossa tabela de preços (quando não está, o valor de créditos fica zerado em vez de arriscar um número errado). Essa mesma ressalva ("estimado") aparece na mensagem que a extensão mostra após cada geração.
- **Versão da extensão** e **data/hora** do evento.

Não coletamos conteúdo de código, arquivos do projeto, ou qualquer dado além do listado acima.

## Onde fica armazenado

Os eventos são enviados para um serviço intermediário (Cloudflare Worker) que grava cada evento como uma linha em um arquivo, num repositório GitHub **privado**, dedicado exclusivamente a esses dados. Nenhuma credencial de escrita fica no código da extensão — o Worker é o único lugar que guarda essa credencial.

## Como desativar

- Comando **"Foursys: Desativar Telemetria"** — desliga o envio de eventos, a qualquer momento. Um único evento final (`telemetry_opted_out`, sem detalhes de uso) é registrado para indicar que você desativou — depois dele, nada mais é enviado.
- Se a telemetria geral do VS Code estiver desligada (`telemetry.telemetryLevel: "off"`), a extensão **não envia nenhum evento**, mesmo que o e-mail já tenha sido informado antes.

## Como corrigir o e-mail informado

Comando **"Foursys: Definir/Atualizar E-mail de Telemetria"**.
