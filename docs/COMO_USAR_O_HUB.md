# Como usar o Foursys SDD Hub

> Guia prático para **PO** e **Desenvolvedor**. Versão 1.2.6 · Atualizado em 18/08/2026
>
> Tudo aqui foi medido rodando de verdade, não é teoria.

---

## Em uma frase

O Hub transforma uma história de usuário em código, passando por **6 etapas de construção** e
**4 de qualidade**. Cada etapa gera um documento em `doc_projeto/`, e a etapa seguinte lê o que
a anterior escreveu.

```
Constitution → Specify → Plan → Tasks → Implement S1 → Implement S2
                                                            ↓
        Plano de Testes → Casos de Teste → Review de Entrega → Relatório de Qualidade
```

**A regra de ouro:** cada etapa só é boa se a anterior foi. Documento ruim no meio contamina
tudo que vem depois. Vale mais gastar 5 minutos revisando o Plan do que 2 horas consertando
código.

---

# Parte 1 — Para todos

## Onde as coisas ficam

```
doc_projeto/
├── constitution.md                    ← regras do projeto (uma vez só)
└── historia-<id>/
    ├── user_story.md                  ← a história (Specify escreve aqui)
    ├── technical_spec.md              ← ✍️ VOCÊ escreve aqui
    ├── implementation_plan.md          ← Plan
    ├── task_list.md                   ← Tasks
    ├── relatorio_implementacao.md      ← Implement
    └── qa/
        ├── plano_testes.md
        ├── casos_teste.md
        ├── review_cobertura.md
        └── relatorio_qualidade.md
```

## 🔑 O `technical_spec.md` — a coisa mais útil do Hub

**É o único arquivo que você escreve e o Hub nunca sobrescreve.** Plan e Tasks leem ele toda vez.

Abra o arquivo e escreva **depois da linha `RESPOSTA:`**:

```
RESPOSTA:
Auditoria é obrigatória nesta história.

O projeto já tem o adapter de log em:
adapter/output/contacorrente/log/LogContaCorrente.java

Criar o equivalente para boleto, no mesmo padrão.
Esse adapter é código de produção e precisa de teste próprio.
```

Use quando a IA esquecer algo, quando houver decisão já tomada, ou quando algo **não pode ser
mexido**.

> **Caso real (17/08):** o Specify e o Plan esqueceram o adapter de auditoria. Três linhas nesse
> arquivo fizeram o componente nascer no Tasks **com teste próprio** e chegar até o código. Sem
> isso, a classe ficaria sem cobertura e derrubaria a entrega inteira.

⛔ **Não cole resultado de skill aqui.** Skill traz exemplos genéricos, e a IA copia os exemplos
como se fossem o seu sistema.

## Se não tiver nada a dizer, deixe em branco

Em branco é melhor que preenchido com exemplo. O Hub lê o projeto sozinho e descobre a estrutura
real.

---

# Parte 2 — Para o PO

## Seu trabalho começa antes do Hub

A qualidade da história define tudo. O Hub avalia ela e dá uma nota (INVEST). Abaixo de 60 ele
reprova.

**O que faz a história render:**

| Escreva | Em vez de |
|---|---|
| "Como área de recebíveis, quero…" | "Como área de tecnologia, quero…" |
| "atualizar com data/hora atual" | "atualizar com a data atual" *(dia? hora?)* |
| "se status = LIQUIDADO, bloquear" | "tratar casos inválidos" |

Ator de negócio, não técnico. Sem ambiguidade de tempo. Erro descrito, não implícito.

## As duas coisas que você PRECISA revisar

### 1. As suposições, no `user_story.md`

Quando falta informação, a IA **decide e avisa**. Ela nunca resolve em silêncio. Procure a tabela:

```
| # | Lacuna | Suposição adotada | Impacto se estiver errada |
```

**Cada linha ali é uma decisão que você deveria ter tomado.** Leia a coluna "impacto" — é ela
que diz o tamanho do estrago se a IA chutou errado.

### 2. A tag `@pendente-po`, no `plano_testes.md`

Cenário de teste que depende de uma suposição não confirmada leva essa tag. Ele **nunca** pode
ser `@critical` enquanto você não confirmar — cenário que bloqueia release não se apoia em
palpite.

`@pendente-po` = **está esperando você**.

## ⚠️ A armadilha que a gente descobriu

O **Plan pode cortar escopo** que o Specify criou — e quando isso acontece, **ninguém volta pra
ajustar os critérios de aceite**.

> **Caso real:** o Specify criou o critério "retentativa não atualiza duas vezes". O Plan cortou,
> com justificativa boa. Ninguém tirou o critério. No fim, a QA **reprovou a entrega** por não
> ter feito algo que tinha sido cortado de propósito.

**O que fazer:** depois do Plan, compare a tabela de decisões dele com os critérios de aceite da
história. Se ele cortou algo, **tire o critério correspondente** antes de seguir.

## Como ler o Relatório de Qualidade

Vá direto em duas coisas:

1. **O número da cobertura** — tem que ser um número medido (ex.: "96,0%"), com a fonte. Se
   estiver escrito só "≥ 95%", **isso é a meta repetida, não uma medição**.
2. **A seção de pendências** — relatório sem pendências e com cobertura baixa é contraditório.

Um `✅ pronto para produção` que não se sustenta nos números das duas seções custa mais caro que
não ter relatório nenhum.

---

# Parte 3 — Para o Desenvolvedor

## A ordem dos botões

| | Botão | O que gera | Quanto tempo |
|:---:|---|---|---|
| 0 | **Constitution** | as regras do projeto | 1 min · uma vez só |
| 1 | **Specify** | história refinada + suposições | 2 min |
| 2 | **Plan** | especificação técnica + diagrama | 3 min |
| 3 | **Tasks** | checklist de tarefas e testes | 3 min |
| 4 | **Implement Sessão 1** | domínio: models, ports, services | 10–20 min |
| 4 | **Implement Sessão 2** | infra: controller, adapters, testes | 20–40 min |

Depois, na aba **QA Auto**: Plano de Testes → Casos de Teste → Review de Entrega → Relatório.

## Antes de apertar o Implement, revise o Tasks

É a última chance barata. Três coisas:

**1. Toda classe criada tem uma tarefa de teste?**
Percorra as tarefas de implementação e procure o teste de cada classe. **Adapter de log é o mais
esquecido.** Uma classe sem teste derruba a entrega inteira.

**2. Projeto sem Lombok? As classes de dados têm teste de contrato?**
Sem gerador de boilerplate, `equals`/`hashCode`/getters são escritos à mão e entram na cobertura
como código normal. Um `equals` manual tem uma dúzia de ramos.

**3. Os caminhos são reais?**
Se aparecer um pacote que não existe no projeto, corrija no `technical_spec.md` antes de seguir.

## Os gates

```
cobertura de linha  ≥ 95%
cobertura de branch ≥ 90%
```

Medidos pelo Hub a partir do `jacoco.csv`, aplicando as exclusões do `pom.xml`.

⚠️ **Se o `pom.xml` tiver `<exclude>${sonar.coverage.exclusions}</exclude>`, o número local está
errado** e conta o projeto inteiro, legado incluso.

O Maven **expande** a variável normalmente — o problema é o formato do que sai dela: uma única
string com todos os caminhos separados por vírgula, apontando para arquivos **`.java`**. O JaCoCo
espera **um padrão por tag**, apontando para **`.class`**. Uma tag com vírgulas e caminhos `.java`
casa com zero classes, então nenhuma exclusão é aplicada.

O conserto é traduzir a lista para uma tag `<exclude>` por padrão, com extensão `.class`.

## Skills — três formas de usar

```
1. Aba Catálogo da sidebar                    → clica e lê
2. @foursys_sdd_po /skill springboot-testing  → dentro do chat participant
3. /springboot-testing                        → Copilot nativo, funciona no IntelliJ e na CLI
```

⚠️ **A forma 3 só funciona no INÍCIO da mensagem.** Slash no meio do texto é ignorado.

---

## 🔴 Pedido livre no chat — e por que chamar a Skill importa

Fora do fluxo SDD, você pode abrir um `.java` e simplesmente pedir o que quer no Copilot Chat. O
Hub instala uma **instruction** em `.github/instructions/` que se aplica automaticamente a
`.java`, `pom.xml` e `application.yml`.

**Ela ajuda bastante — mas não garante.** Medimos três pedidos livres em 18/08, com o arquivo
certo aberto. Dois saíram bem; **um falhou, e falhou justamente na regra mais crítica**:

| Pedido | Resultado |
|---|---|
| “Adicione um método para cancelar o boleto” | ✅ Seguiu o padrão do projeto, não criou `@Bean` indevido e escreveu os testes. Usou `BusinessException` para “não encontrado” tendo `NaoEncontradoException` ao lado — questão de preferência, não defeito |
| “Crie um record ClienteBoleto com nome, cpf e email” | ❌ Escreveu `toString()` **imprimindo o CPF**, sem uma palavra de aviso |
| “Minha feature deu 96,9% e o global 74,5%, por quê?” | ⚠️ Explicou a diferença de escopo e acertou 6 das 9 classes que apontou. Mas **não achou a causa** — o `<exclude>` quebrado — e 3 das classes sugeridas o Sonar já ignora |

### Sintoma × causa

Mesma pergunta do terceiro caso, mesmo modelo, mesmo projeto:

```
pedido livre (instruction)   →  descreveu o sintoma              (escopos diferentes)
/springboot-testing          →  achou a causa                    (o <exclude> quebrado)
```

Os dois estavam certos. Só um resolvia.

### A regra prática

> **Pedido livre serve para trabalho de rotina** — e vai bem nisso. Quando a regra importa de
> verdade — PII, cobertura, contrato de API —, **chame a Skill explicitamente**: ela vai à causa,
> o pedido livre costuma parar no sintoma.

E **nunca confie na instruction para PII**. Toda vez que criar classe com CPF, CNPJ, conta,
cartão, senha ou token, escreva o `toString()` você mesmo, ou peça com a regra explícita:

```
Crie um record ClienteBoleto com nome, cpf e email.
O toString() NÃO pode expor o CPF.
```

---

# Parte 4 — Avisos que economizam tempo

Coisas que parecem defeito e não são. Todas medidas rodando.

| O que você vê | O que é |
|---|---|
| **`FILEPATH:` com nome estranho** no topo dos documentos | Nome inventado pela IA. Quem decide onde salvar é o Hub — ignore a linha. |
| **Aviso "placeholder não resolvido: `<mensagem>`"** no `casos_teste.md` | Falso positivo. `<mensagem>` é sintaxe obrigatória do Gherkin (Scenario Outline). Ignore. |
| **Relatório HTML às vezes sai, às vezes não** | O Hub só grava o `.html` se a IA embutir o bloco na resposta. Não é bug. |
| **Relatório diz "meta atingida" sem citar número** | Defeito conhecido. **Confira a cobertura você mesmo** antes de aceitar. |
| **Sessão 1 avança em tarefa da Sessão 2** | Intermitente, sem correção. Anote e siga. |
| **Regras da instruction não aparecem no código gerado** | A instruction do `.github/` **não chega no Implement**. Os canais que funcionam são a **Constituição** e a **Task List**. |
| **Projeto Angular sem cobertura medida** | A medição real é só de Java. Em Angular o QA usa cobertura declarada. |

---

# Parte 5 — Manutenção

## Os dois botões de atualizar fazem coisas diferentes

| Botão | Atualiza | Comportamento |
|---|---|---|
| **Atualizar Skills** | `globalStorage/skills` | apaga e recopia — espelho fiel do catálogo |
| **Sincronizar Skills Nativas** | `~/.copilot/skills` e `agents` | só escreve por cima, **nunca apaga** |

**Consequência:** skill removida ou renomeada no catálogo **fica para sempre** em `~/.copilot`
de quem já sincronizou. Não existe como recolher — corrija por cima, mantendo o mesmo nome.

## De onde vem cada coisa

| O quê | Chega por | Só muda quando |
|---|---|---|
| Skills, instructions, personas | **git** | roda "Atualizar Hub" |
| **Playbooks das fases SDD** | **embutidos no `.vsix`** | **sai versão nova** |

Mexer num playbook de fase **não chega em ninguém por git**. Precisa de `.vsix` novo.

## Stacks suportadas

Java 21 + Spring Boot · Angular 18+ · Node.js / NestJS · COBOL · iOS (Swift) · Android (Kotlin)

> O card da sidebar mostra o rótulo da stack, mas o **Plan lê a versão real do `pom.xml`**. Se
> divergir, ele registra a divergência no documento em vez de escolher em silêncio.

---

# Resumo em 6 linhas

1. Escreva a história com ator de negócio e sem ambiguidade.
2. Rode as fases na ordem. Não pule.
3. **Revise as suposições** no `user_story.md` — são decisões suas.
4. **Revise o Tasks** — toda classe precisa de teste. Adapter de log é o mais esquecido.
5. Faltou algo? Escreva no `technical_spec.md`, depois do `RESPOSTA:`.
6. No fim, **confira o número da cobertura você mesmo**. Não aceite "meta atingida" sem número.
