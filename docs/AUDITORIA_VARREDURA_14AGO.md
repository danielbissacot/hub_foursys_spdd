# 🔍 Auditoria de Varredura — Ajustes do 1.2.6 (14/08/2026)

**Escopo:** as 18 correções aplicadas entre 13 e 14/08 (numeradas 11–27 + port do `@pendente-po`),
código do engine (`prompt-context.ts`, `extension.ts`, `catalog-loader.ts`) e os 38 playbooks.
**Método:** leitura de código + reprodução em harness Node com dados sintéticos (nenhum arquivo
do Hub ou do Kit foi alterado). Cada bug marcado como **[REPRODUZIDO]** foi executado de verdade,
não deduzido.

**Nada foi alterado nesta auditoria. Este documento só aponta.**

---

## 🔴 Bugs confirmados

### B1 — `parseSonarExclusions` ignora exclusão com `*` no meio do caminho **[REPRODUZIDO]**

**Arquivo:** `foursys-sdd-engine-hybrid-po/src/engine/prompt-context.ts` (função `parseSonarExclusions`)

O tradutor converte `src/main/java/**/adapter/output/*/dto/*.java` em
`pkgSuffix = "adapter.output.*.dto"` — com **asterisco literal**. O casamento usa
`c[1].endsWith(r.pkgSuffix)`, e nenhum pacote real termina com `*`, então **a exclusão nunca
aplica**.

Reprodução: pom sintético com essa exclusão + csv com `com.x.adapter.output.pix.dto.PixDto`
(10 linhas descobertas). Resultado: `PixDto: faltam 10 de 10` apareceu na lista de "classes que
CONTAM" e derrubou o total para 66,7% — quando o Sonar oficial a excluiria.

**Impacto:** o pom do Kit tem 3 padrões nesse formato (`adapter/input/*/dto/*DTO.java`,
`adapter/input/*/dto/mapper/*Mapper.java`, `adapter/output/*/dto/*.java`). O número que o Hub
reporta fica **menor** que o do Sonar, e a lista de "onde falta teste" pode apontar DTO/mapper
que o gate oficial ignora — exatamente a armadilha que a correção 19 quis evitar.

**Ajuste sugerido:** converter cada segmento `*` em `[^.]+` e casar o pacote com regex completa
em vez de `endsWith`.

---

### B2 — `detectarPlaceholders` acusa falso positivo em todo documento do Specify **[REPRODUZIDO]**

**Arquivo:** `prompt-context.ts` (função `detectarPlaceholders`, padrão "texto de template não
substituído")

O padrão `\[[A-ZÀ-Úa-zà-ú][^\]\n]{4,60}\](?!\()` casa com marcadores **legítimos e obrigatórios**
que a correção 9 manda escrever em toda user story:

```
texto de template não substituído: [SUPOSIÇÃO S1]      ← correção 9 exige isso
texto de template não substituído: [RN01 — Atualização por operação elegível]
texto de template não substituído: [AJUSTADA]           ← status INVEST padrão
```

**Impacto:** todo Specify (e QA que cite as suposições) dispara o aviso ⚠️. O aviso vira ruído,
o usuário aprende a ignorá-lo, e quando um placeholder REAL sobrar (`[Como verificar que está
done]`), ninguém olha. Fadiga de alerta anula a proteção.

**Ajuste sugerido:** allowlist dos padrões legítimos do próprio Hub
(`[SUPOSIÇÃO S\d]`, `[RN\d...]`, `[AJUSTADA]`, `[APROVADA]`, status INVEST) antes de acusar —
ou restringir o padrão de colchetes a frases-template conhecidas dos playbooks
(`[O que...]`, `[Como...]`, `[Título...]`, `[Cobertura...]`).

---

### B3 — Caminho IntelliJ/CLI (`assembleFinalPrompt`) ficou para trás

**Arquivo:** `prompt-context.ts` linha ~653

```ts
const storyDocPath = docPath; // scaffold: sem gestao de subpasta por historia
```

O `assembleFinalPrompt` (usado pelo plugin IntelliJ/CLI) recebeu o `readCoverageReport`
(correção 19 ✅), mas **não** recebeu o `readStoryFolderInfo` (correção 24) — e o scaffold
aponta `storyDocPath` para a raiz de `doc_projeto/`, então as fases de QA leriam/escreveriam
no lugar errado num workspace com subpasta por história.

**Impacto:** hoje é baixo (o caminho IntelliJ é scaffold), mas é exatamente o tipo de
divergência silenciosa que o comentário do próprio arquivo diz querer evitar ("centralizado
aqui pra extension.ts e assembleFinalPrompt nunca divergirem").

---

## 🟡 Regras que não chegam onde deveriam

### I1 — `FORMATO DE SAÍDA` só existe em 2 dos 5 `qa-test-plan`

```
generic      1   spring_boot  1
angular      0   cobol        0   node  0
```

O port do `@pendente-po` levou a **Etapa 2** para angular/cobol/node, mas não o **contrato de
saída**. Se a hipótese "etapa sem contrato pode ser pulada" tiver alguma verdade (não foi
testada de forma limpa — a falha anterior era arquivo errado), essas 3 stacks estão na mesma
situação que motivou a correção 21.

### I2 — "Java 21" cravado em 15 pontos dos playbooks spring_boot

```
foursys-constitution.md   5 ocorrências (name, título, item 2, "Linguagem: Java 21")
foursys-qa-test-plan.md   4
foursys-plan.md           3
foursys-specify-tech.md   3
```

A correção 18 injeta a versão real e **na prática o modelo tem conciliado** (a constituição
gerada saiu "Java 17"). Mas o playbook continua afirmando o contrário do bloco STACK REAL — é
um cabo de guerra que hoje o lado certo vence por sorte de interpretação. Título e frontmatter
deveriam ser neutros ("Java + Spring Boot"), deixando a versão vir só da injeção.

### I3 — `Tarefa ZZ` sem instrução de numeração

`generic/foursys-tasks.md:105` usa o placeholder `ZZ` mas nunca diz *"substitua ZZ pelo próximo
número da sequência"*. Em uma rodada real saiu "Tarefa ZZ" literal no documento. O
`detectarPlaceholders` avisa **depois** de salvo; falta a prevenção no template.

### I4 — Regras 8►/11 e BIBLIOTECAS só na constituição do spring_boot

As correções 25 (não apagar entregável), 26 (bibliotecas ausentes) e 27 (Parada Honesta)
existem **apenas** em `spring_boot/foursys-constitution.md`. As outras 6 constituições
(angular, cobol, ios, android, node, generic) não têm nenhuma das três. O teste do Angular
vai rodar sem a proteção que acabou de ser criada — inclusive contra apagamento de teste
`.spec.ts`, que é o mesmo risco.

### I5 — `readCoverageReport` e `readMavenStackInfo` são só Java

`stackId !== 'spring_boot'` retorna vazio. Angular tem equivalentes óbvios
(`coverage-summary.json` do Karma/Vitest; `package.json` já é lido pelo
`readProjectStackInfo`, mas sem detecção de libs ausentes). O QA de Angular vai voltar a
"cobertura declarada, não medida".

### I6 — Detecções do pom têm limites não documentados

- **Multi-módulo:** só `rootPath/pom.xml` é lido. Num reactor Maven (pai + módulos), a versão
  do Java e as libs podem estar no pai ou num módulo — o Hub veria só um deles.
- **Detecção de lib por `<artifactId>`:** um pom que menciona lombok apenas dentro de
  `<exclusions>` contaria como "tem Lombok".

### I7 — `jacoco.csv` pode ser de rodada anterior (stale)

`readCoverageReport` lê o csv sem checar idade. Se o dev rodar o QA sem ter rodado
`mvn -o clean test` de novo, o Hub injeta com autoridade ("Use ELE") um número **da entrega
anterior**. Sugestão: comparar mtime do csv com o `.java` mais novo de `src/` e avisar
"medição desatualizada — rode a suíte de novo" quando o código for mais novo que o relatório.

### I8 — Correção 22 (Relatório de Implementação) segue não comprovada

Na última rodada o `relatorio_implementacao.md` **não foi gerado** (a sessão travou nos testes
e parou antes). O aviso "gere mesmo com tarefa aberta" foi adicionado depois disso e ainda não
foi exercitado. Status real da 22: entregue, nunca validada ponta a ponta.

---

## 🟠 Aberto por design (não é bug de código do Hub, mas segue sem solução)

| Item | Situação |
|---|---|
| Sessão 1 executa tarefas da Sessão 2 | Intermitente (2 de 4 rodadas). Instrução é explícita e é ignorada — família A5/A6 |
| Implement escreve teste insuficiente | 66,9% na feature da última rodada. Nenhuma correção força cobertura na escrita; o Hub agora **denuncia** (19), mas não **previne** |
| `/implement` pelo chat | `throw Error("Playbook para 'implement' não encontrado")` — teste F3, decisão pendente (criar playbook, remover subcomando ou redirecionar pro `chat.open`) |
| A1 (PII em record), A5/A6 (obedece o usuário contra a arquitetura) | Sem correção candidata |
| Candidata 24 na prática | Código entregue, mas a rodada que a exercitaria ainda não aconteceu |

---

## ✅ O que a varredura confirmou como correto

- `readStoryFolderInfo`, `PHASE_WORKSPACE_MAX_FILES/LINES`, aviso `[truncado]`, ordenação
  produção-antes-de-teste: corretos e com teste manual reproduzido.
- Instruction da raiz e do hybrid-po: **idênticas** (sem divergência entre as duas gavetas).
- Detecção de Lombok: correta nos dois sentidos (pom com e sem a lib).
- Teste de invariante de playbooks: pegou na primeira execução um erro real do próprio teste
  (generic acusado como órfão) e foi corrigido — está válido e rodando (53 testes).
- As 16 demais correções auditadas contra o arquivo que **de fato vence** por fase: no lugar certo.

---

## 📌 Prioridade sugerida (sem executar nada agora)

| # | Item | Por quê primeiro |
|---|---|---|
| 1 | **B2** (falso positivo do placeholder) | Dispara em TODO Specify a partir da próxima rodada — mata a credibilidade do aviso novo |
| 2 | **B1** (exclusão com `*`) | O número da correção 19 está errado pra baixo no próprio Kit |
| 3 | **I4** (portar Regras 8►/11/26 pras outras constituições) | O teste do Angular é o próximo passo do projeto |
| 4 | **I7** (csv stale) | Barato e evita o Hub afirmar número velho com autoridade |
| 5 | I1, I3, I2 | Consistência de playbook |
| 6 | B3, I5, I6 | Quando IntelliJ/Angular entrarem de verdade |
