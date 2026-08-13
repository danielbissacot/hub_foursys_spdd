# Análise estrutural do `catalog/` (Skills, Playbooks, Agentes)

**Data:** 2026-08-11
**Modo:** somente análise — nenhum arquivo do catálogo foi alterado, movido ou removido.
**Método:** leitura direta dos diretórios de catálogo e do código-fonte que os consome (`catalog-loader.ts`, `sidebar-provider.ts`, `stack-registry.ts`), sem telemetria (isso não é conteúdo carregado como Skill do Claude Code — é produto do próprio Hub).

---

## Resumo em 3 frases

Existem **três cópias diferentes do catálogo** (raiz do repo, embutida no `.vsix` do motor, e uma terceira sincronizada via git para a máquina do usuário), e o botão "Atualizar Skills" só alcança a mais pobre das três. Dentro da cópia da raiz — que é a que efetivamente chega ao usuário —, cada skill de Angular e Spring Boot está **duplicada em dois lugares**, e as versões mais novas (com `httpResource()`, Signals, Design System) estão **paradas num diretório que o código nunca lê**, enquanto a UI continua servindo a versão antiga. A stack Node.js/NestJS está registrada e aparece na sidebar, mas **não tem nenhuma skill técnica** em lugar nenhum.

---

## 1. Três catálogos com papéis diferentes (e mal documentados)

| Catálogo | Caminho | Quem usa | Como chega lá |
|---|---|---|---|
| **Raiz do repo** | `catalog/` | `_syncHub()` faz `git clone`/`fetch` deste caminho | É o próprio conteúdo deste repositório, na branch `main` |
| **Embutido no motor** | `foursys-sdd-engine-hybrid-po/catalog/` | `loadPlaybookForStack()` (fallback "builtin") | Empacotado dentro do `.vsix` no build da extensão |
| **Sincronizado (usuário)** | `<globalStorage>/hub/catalog/` | `sidebar-provider.ts` (lista de skills, playbooks, injeção nas customizações do Copilot) | `git clone --sparse-checkout catalog` de `https://github.com/danielbissacot/hub_foursys_spdd.git` branch `main` (arquivo: `sidebar-provider.ts:710-714`) |

**O problema:** o botão "Atualizar Skills" (`_syncHub`) clona a pasta `catalog/` **da raiz deste repositório**, não a pasta embutida no motor (`foursys-sdd-engine-hybrid-po/catalog/`). São conteúdos diferentes. Qualquer skill ou playbook que só exista na cópia embutida no motor (ex: `catalog/instructions/angular-vertical-slice-arch/` com as regras reais de Angular v20+/Signals/`httpResource()`, ou `sdd/spring_boot`, `sdd/node`) **nunca chega** ao usuário via sincronização — só via nova versão do `.vsix`. Isso já tinha sido mapeado parcialmente em análise anterior (achado #6 da revisão Figma+Angular); esta análise confirma a causa exata no código.

---

## 2. `catalog/sdd/` na raiz está praticamente vazio

```
catalog/sdd/
└── README.md          ← só isso
```

Não existe nem `catalog/sdd/generic/`, nem pasta por stack. Comparado à cópia embutida no motor (`foursys-sdd-engine-hybrid-po/catalog/sdd/`), que tem `generic/`, `angular/`, `android/`, `cobol/`, `ios/`, `node/`, `spring_boot/` — todos com playbooks reais (`foursys-constitution.md`, `foursys-plan.md`, `foursys-tasks.md`, etc.).

Na prática isso não quebra nada hoje porque `loadPlaybookForStack()` faz fallback por arquivo (tenta o catálogo externo, se não achar cai pro embutido) — mas é enganoso: qualquer pessoa que abra `catalog/sdd/` esperando encontrar os playbooks reais do produto não vai achar nada ali, e se alguém popular esse diretório "pela metade" no futuro (só alguns arquivos), passa a mascarar silenciosamente o conteúdo embutido mais completo, arquivo por arquivo, sem aviso.

---

## 3. Duplicação sistemática em `catalog/agents_skills/`

Cada stack com estrutura de skills tem os **mesmos arquivos em dois lugares**:

```
catalog/agents_skills/angular/angular-component/SKILL_ANGULAR_COMPONENT.md
catalog/agents_skills/angular/skills/angular-component/SKILL_ANGULAR_COMPONENT.md   ← idêntico
```

Confirmado nesse padrão para: **android** (8 skills × 2), **angular** (7 skills × 2, ver seção 4), **cobol** (9 skills × 2), **ios** (9 skills × 2 + 1 caso de rename), **java-legado** (3 skills × 2), **spring_boot** (7 skills × 2, ver seção 4).

Só a pasta `skills/` é lida pelo código (`sidebar-provider.ts` aponta cada stack para `agents_skills/<stack>/skills`, ver seção 5) — então as cópias no nível de cima de cada stack (`agents_skills/angular/angular-component/...` etc.) são **arquivos mortos**: nunca aparecem na sidebar, nunca são sincronizados para o Copilot do usuário. É praticamente metade do conteúdo desse diretório sem função nenhuma hoje.

---

## 4. Achado mais sério: skills novas (versionadas) ficaram órfãs

Em `catalog/agents_skills/angular/`, direto na raiz da pasta (fora de `skills/`), existem 5 skills em formato versionado — o mesmo padrão usado na cópia embutida no motor:

```
angular-design-system/0.1.0/SKILL.md
angular-forms/0.1.0/SKILL.md
angular-httpresource/0.1.0/SKILL.md
angular-routing/0.1.0/SKILL.md
angular-signals/0.1.0/SKILL.md
```

Só que `sidebar-provider.ts` lista skills a partir de `agents_skills/angular/skills/`, e essa pasta **já tem suas próprias versões, mais antigas e sem versionamento**, cobrindo os mesmos temas:

```
skills/angular-forms/SKILL_ANGULAR_FORMS.md      ← concorre com angular-forms/0.1.0/SKILL.md
skills/angular-routing/SKILL_ANGULAR_ROUTING.md  ← concorre com angular-routing/0.1.0/SKILL.md
skills/angular-signals/SKILL_ANGULAR_SIGNALS.md  ← concorre com angular-signals/0.1.0/SKILL.md
skills/angular-http/SKILL_ANGULAR_HTTP.md        ← não existe versão nova equivalente à angular-httpresource
```

Ou seja: parece que alguém já escreveu a **próxima geração** dessas 4-5 skills (incluindo uma nova, `angular-httpresource`, que bate exatamente com a recomendação de `httpResource()` que já vimos em `angular-vertical-slice-arch.instructions.md`), mas esse trabalho nunca foi movido para dentro de `skills/`. Resultado: o usuário que sincroniza o Hub continua recebendo a skill antiga de Signals/Forms/Routing, e `angular-design-system` (que provavelmente resolveria o achado #2 da revisão anterior — DS ignorado no Figma) nunca é sequer mostrado.

**O mesmo padrão se repete em `spring_boot`:** 7 skills versionadas (`springboot-blob-storage`, `springboot-feign-client`, `springboot-kafka`, `springboot-mongodb`, `springboot-redis`, `springboot-rest-client`, `springboot-service-bus`, todas em `0.1.0/`) soltas fora de `skills/`, enquanto `skills/` tem versões próprias mais antigas dos mesmos nomes — mais uma skill, `springboot-testing`, que só existe dentro de `skills/` e não tem equivalente versionado.

---

## 5. Stack Node.js/NestJS: registrada, mas sem nenhuma skill

`stack-registry.ts` define `node` como stack completa — com `detectionKeywords` (`nestjs`, `@nestjs`, `express`, `fastify`...), `playbookFolder: 'node'` e `agentFileName: 'AGENTE_NODE_FOURSYS.md'` — e `sidebar-provider.ts` mostra "Node.js / NestJS" na lista de stacks da sidebar. Só que:

- `catalog/agents_skills/node/` **não existe** (nem na raiz, nem na cópia embutida no motor).
- `AGENTE_NODE_FOURSYS.md` **não existe** em lugar nenhum.

Um usuário cujo projeto seja detectado automaticamente como Node/NestJS (via `package.json`) cai numa stack com playbooks de SDD funcionando (esses existem em `sdd/node/` na cópia embutida), mas **catálogo de skills técnicas vazio** e sem persona de agente — a stack está "pela metade".

---

## 6. `catalog/instructions/` está desconectado do produto

Busquei em todo `src/` da extensão por qualquer referência à pasta `instructions/` (tanto a da raiz quanto a embutida no motor, incluindo o arquivo versionado `angular-vertical-slice-arch.instructions.md` com as regras reais de Angular v20+/Signals/`httpResource()`/`inject()`). **Não há nenhuma.** Nem `catalog-loader.ts`, nem `sidebar-provider.ts`, nem `extension.ts` leem essa pasta.

Isso significa que as regras de arquitetura mais bem escritas e atualizadas que encontrei no catálogo (que inclusive já resolveriam parte do achado #1 da revisão Figma+Angular, sobre o prompt hardcoded) **nunca chegam a um usuário através de nenhum comando do Hub** — existem só como documentação solta. Se a intenção era injetar isso em `.github/copilot-instructions.md` do workspace do usuário (como o nome do arquivo sugere), essa parte nunca foi implementada.

---

## 7. `catalog/backlog/` também não tem nenhuma referência no código

`catalog/backlog/input/`, `catalog/backlog/refined/` e o exemplo `EXEMPLO_HISTORIA.md` existem, mas uma busca por `backlog` em todo `src/` não retornou nenhum resultado. Parece scaffolding de uma funcionalidade (pipeline de refinamento de backlog?) que começou e não foi conectada — ou é usada por um processo manual/externo que não está documentado no código.

---

## 8. Duas definições diferentes (e divergentes) de "onde ficam as skills da stack X"

- `stack-registry.ts` → `skillsFolder: 'agents_skills/angular'` (sem sufixo `/skills` — usado só pra achar o arquivo de persona `AGENTE_*.md`).
- `sidebar-provider.ts` → array `STACKS` hardcoded com `folder: 'agents_skills/angular/skills'` (com sufixo — usado pra listar as skills na UI).

Nenhuma das duas é "errada" isoladamente (fazem coisas diferentes), mas são **duas fontes de verdade separadas para o mesmo conceito**, definidas em arquivos diferentes, com profundidades de pasta diferentes. É exatamente esse tipo de duplicação de configuração que deixou o buraco do Node.js (seção 5) passar despercebido — bastaria um dos dois lugares ter uma verificação cruzada com o outro.

---

## Tabela-resumo dos achados

| # | Achado | Impacto | Esforço estimado pra corrigir |
|---|---|---|---|
| 1 | 3 catálogos com conteúdo diferente; sync não alcança o mais completo | Usuários nunca recebem via "Atualizar Skills" o que só existe no `.vsix` | Médio — decidir fonte única e ajustar `_syncHub` |
| 2 | `catalog/sdd/` na raiz vazio (só README) | Confuso, mas hoje inofensivo por causa do fallback | Baixo — preencher ou documentar que é intencional |
| 3 | Duplicação sistemática skill × skill/ em 6 stacks | ~50% dos arquivos de `agents_skills/` são cópias mortas | Médio — escolher um layout único e apagar o outro |
| 4 | 5 skills novas de Angular + 7 de Spring Boot órfãs (nunca aparecem na UI) | Usuário recebe conteúdo desatualizado enquanto a versão nova apodrece sem uso | Baixo/Médio — mover pra dentro de `skills/` |
| 5 | Stack Node.js sem nenhuma skill nem persona | Stack "quebrada" pela metade pra quem for detectado como Node | Alto — escrever o conteúdo, ou remover a stack até existir |
| 6 | `catalog/instructions/` nunca é lido pelo código | Melhores regras de Angular do catálogo nunca chegam ao usuário | Médio — implementar a injeção ou remover a pasta |
| 7 | `catalog/backlog/` sem nenhuma referência no código | Provável feature abandonada ou processo não documentado | Baixo — decidir manter/remover |
| 8 | Duas definições divergentes de "onde ficam as skills" | Facilita bugs de stack incompleta passarem despercebidos | Médio — unificar em `stack-registry.ts` |

---

## Nada foi alterado

Este relatório é só diagnóstico, como pedido. Nenhum arquivo de `catalog/` foi movido, apagado ou reescrito. Se quiser, posso detalhar um plano de ação pra qualquer um dos 8 pontos antes de mexer em algo.
