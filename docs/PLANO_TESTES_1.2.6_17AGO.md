# Plano de Testes — Foursys SDD Hub 1.2.6

> **Versão:** 1.2.6 · **Data:** 17/08/2026 · **Stack:** Java / Spring Boot
> **Projeto de teste:** `ensc-srv-kit-java`

## O que este documento é

Um roteiro **executável de ponta a ponta**, escrito depois de fechados os 7 testes de canal.
Você segue de cima para baixo, sem precisar decidir o que ainda vale.

O `PLANO_TESTES_1.2.6_JAVA.md` continua no repositório como **histórico** — é o diário das
correções 9 a 29, com a medição de cada uma. Consulte-o quando quiser saber *por que* uma
verificação existe. Não o use como roteiro.

## Divisão de trabalho

| Quem | Faz o quê |
|---|---|
| **Daniel** | Executa: clica nos botões do Hub, cola texto no Copilot Chat |
| **Claude** | Confere o resultado contra os arquivos no disco e preenche o status aqui |

**Legenda:** ⬜ pendente · ✅ passou · ❌ falhou · ⚠️ passou parcialmente

---

# Antes de começar

| | Item | Como conferir |
|:---:|---|---|
| 1 | Instalar `foursys-sdd-engine-hybrid-po-1.2.6.vsix` | 452.983 bytes, gerado 17/08 19:32 |
| 2 | Sidebar mostra **v1.2.6** | abaixo do título "Foursys SDD Hybrid" |
| 3 | Criar **história nova** | não reaproveitar `historia-202608172131` — está inconsistente |
| 4 | Stack ativa = Java / Spring Boot | card no topo da sidebar |

> ⚠️ **Não altere nada no Kit pela mão.** Tudo passa pelo Hub. Se uma fase pedir mudança em
> `pom.xml` ou código, isso é resultado do teste — anote, não conserte por fora.

> ⚠️ **Não rode `mvn` a partir daqui.** Quando um passo exigir build, o comando é entregue
> pronto para você rodar no seu terminal.

---

# Passo 1 — Ciclo SDD

## 1.1 · Constitution

**Como rodar:** sidebar → botão **0 Constitution**

**Passa se:** gera `doc_projeto/constitution.md` sem erro.

**Status:** ✅  **Resultado:** `constitution.md` 5.710 bytes, 20:51. Java 17 lido do pom com a divergência escrita; Lombok ausente declarado; Regras 9/10/11 (@Bean, Swagger, Parada Honesta) presentes. Ressalva cosmética: cabeçalho declara `CONSTITUICAO.md`, nome inventado — o prompt nunca informa o nome do arquivo de saída.

---

## 1.2 · Specify

**Como rodar:** sidebar → botão **1 Specify**

**Passa se:** o que a IA deduziu aparece **marcado como suposição**, não afirmado como fato.

> Por quê: história ambígua vira decisão silenciosa da IA. Levou 7 rodadas para fechar
> (correção 9).

**Status:** ✅  **Resultado:** `user_story.md` 6.395 bytes, 6 marcações de suposição, cada uma com impacto se errada, e rastreadas até os critérios BDD (`[SUPOSIÇÃO S1]`). Separou o que corrigiu do que "não resolveu em silêncio". Achado: não listou o adapter de auditoria, embora exigisse log obrigatório.

---

## 1.3 · Plan

**Como rodar:** sidebar → botão **2 Plan**

**Passa se** — as cinco:

| | Verificação |
|:---:|---|
| a | Java vem do `pom.xml` (**17**), não do playbook (21) |
| b | Se divergir do playbook, a divergência está **escrita no documento** — não escolhida em silêncio |
| c | Bloco de transação financeira só aparece se a história mexe em saldo/posição. Se não mexe, tem que dizer **"não aplicável"** |
| d | Nenhum `@Bean` duplicando classe que já tem `@Service` |
| e | Reusa componentes existentes em vez de criar paralelos. Zero `GlobalExceptionHandler` inventado |

**Status:** ✅  **Resultado:** passou nos 5 critérios. Cortou a idempotência sozinho ("inflaria escopo sem requisito explícito"). **Confirmou o furo do Specify: zero componente de log**, apesar de exigir auditoria na seção 3. Corrigido pelo PO via `technical_spec.md` (a gaveta que Plan e Tasks leem e nenhuma fase sobrescreve).

---

## 1.4 · Tasks

**Como rodar:** sidebar → botão **3 Tasks**

**Passa se** — as cinco:

| | Verificação |
|:---:|---|
| a | `Arquivo impactado` aponta para a **pasta real da história** (a de timestamp), não para um nome inventado |
| b | **Uma tarefa de teste por classe criada** — incluindo adapter de log, que já foi esquecido e sozinho segurou a entrega em 92,6% |
| c | Projeto sem Lombok → tarefa de **teste de contrato** para cada classe de dados (construtor, getters, `equals`/`hashCode`, `toString` sem PII) |
| d | Última tarefa é o **Relatório de Implementação**, com número real (`Tarefa 12`) — nunca `Tarefa NN` ou `ZZ` |
| e | Se a história expõe endpoint, alguma tarefa exige a documentação do contrato (Swagger) |

**Status:** ✅  **Resultado:** melhor Task List da semana. O `technical_spec.md` funcionou: Tarefa 04 (Port), Tarefa 14 (adapter) e **Teste 09** para o log. 9 classes com lógica → 9 testes, nenhuma sobrou; interfaces sem teste, correto. Testes 01/03/04/07 são de contrato. Relatório saiu como `Tarefa 16` — número real. Caminho `messages/global` conferido: existe.

---

## 1.5 · Implement — Sessão 1

**Como rodar:** sidebar → botão **4 Implement**, ou no chat `/foursys.implementSession1`

**Passa se:**

- executa **só** as tarefas da Sessão 1 — Domínio
- teste que não compila é **corrigido**, nunca apagado
- em projeto sem Lombok, os testes constroem objeto pelo **construtor real**, sem `builder()`

**Status:** ✅  **Resultado:** exatamente as 5 tarefas de domínio, **sem invadir a Sessão 2** (o bug intermitente não apareceu). Zero Lombok. `BoletoCobranca` saiu como `record` com `toString()` manual e `valor` em `BigDecimal`.

> **Limite conhecido:** a Sessão 1 às vezes avança em tarefas da Sessão 2. É intermitente e
> não tem correção — se acontecer, anote e siga.

---

## 1.6 · Implement — Sessão 2

**Como rodar:** `/foursys.implementSession2`

**Passa se:**

- Controller sai com Swagger (`@Tag`/`@Operation`, ou a interface `<Nome>Swagger.java`)
- o Relatório de Implementação é gerado **mesmo que alguma tarefa tenha ficado aberta**
- o relatório cita cobertura **com a fonte do número**, e não apresenta cobertura de um
  componente como se fosse o total

**Status:** ⚠️  **Resultado:** as 9 classes de infra saíram e o **Swagger fechou** — `BoletoCobrancaController implements BoletoCobrancaSwagger`, idêntico ao padrão do Kit, 11 anotações. 60 testes, 100% passando.

**❌ Falhou o critério do relatório medir.** O `relatorio_implementacao.md` lista cobertura por classe (todas 100%) e conclui `Meta: ≥95% / Resultado: ✅ ATENDIDO` — **sem nunca declarar o total medido**. É exatamente o que a seção 4 do playbook proíbe: *"Nunca apresente cobertura por componente como se fosse o total"*. O total real é 96,0% linha / 92,9% branch, então a conclusão está certa **por sorte, não por método** — com legado pior, diria ✅ do mesmo jeito. O JaCoCo bruto (74,5%, por causa do `<exclude>${sonar.coverage.exclusions}</exclude>` quebrado) não aparece nem para ser explicado.

---

# Passo 2 — QA

## 2.1 · Plano de Testes

**Como rodar:** sidebar → aba **QA Auto** → **Plano de Testes**

**Passa se:** item sem informação suficiente vem marcado com **`@pendente-po`** em vez de a IA
inventar o critério.

**Status:** ✅  **Resultado:** `plano_testes.md` 6.503 bytes.

---

## 2.2 · Casos de Teste (BDD)

**Passa se:** gera `doc_projeto/<historia>/qa/casos_teste.md` sem erro.

**Status:** ⚠️  **Resultado:** o BDD saiu correto — Scenario Outline com tabela `Examples:`.
Mas a **varredura de placeholder acusou falso positivo**: alertou
`casos_teste.md: placeholder não resolvido — placeholder entre < >: <mensagem>`.

`<mensagem>` e `<operacao>` são **sintaxe obrigatória do Gherkin**, ligando o cenário às colunas
da tabela `Examples:`. Sem os `< >` o BDD não funciona.

**Causa raiz:** o texto veio do nosso próprio playbook —
`catalog/sdd/spring_boot/foursys-qa-test-cases.md:76` traz
`Then erro de validação "<mensagem>" é retornado`. Como `detectarPlaceholders` só acusa quando o
trecho aparece **literalmente no playbook**, ele pegou exatamente o comportamento correto: a IA
copiou o template como mandado.

O detector foi escrito para pegar `<PASTA DA HISTÓRIA ATIVA…>` sobrevivendo num documento;
ninguém previu que a fase de BDD produz `< >` de propósito. Afeta as 3 stacks cujo playbook usa
`Examples:` (generic, node, spring_boot).

**Conserto proposto (não aplicado):** pular a varredura na fase `qa-test-cases`, ou não acusar
quando o documento contém `Examples:`. Não corrigido durante a rodada para não invalidar as
fases seguintes.

---

## 2.3 · Review de Entrega

**Passa se:**

- enxerga o código **de produção** da entrega (não só os arquivos de teste)
- usa o número de cobertura **calculado pelo Hub**, não um número declarado pela IA
- gates aplicados: **linha ≥ 95%** e **branch ≥ 90%**

**Status:** ✅  **Resultado:** reprovou honestamente e mapeou cada critério ao código. **Achou
defeito real de contrato:** `BoletoCobrancaSwagger:24` declara `@ApiResponse(422)` mas nenhum
código do projeto retorna 422 — e o `BusinessExceptionHandler` não trata `BusinessException`.
Passou por 5 fases sem ninguém ver.

---

## 2.4 · Relatório de Qualidade

**Passa se:** reprovando, faz a **Parada Honesta** — declara a reprovação em vez de escrever
"pronto para produção" contra os próprios números.

**Status:** ✅  **Resultado:** o melhor da semana. `❌ NÃO APROVADO para deploy` **mesmo com a
cobertura passando** (96,0% / 92,9%) — reprovou pelos critérios de aceite, sem usar o número bom
para esconder o problema. Citou os números do Hub exatos (`214/223`, `13/14`), confirmando a
correção 19. **E fechou o teste A3**: recomendou sozinho *"ajustar excludes do JaCoCo no pom.xml
para convergência com o Sonar"* — o diagnóstico que falhou em 13/08 e motivou a Regra de Ouro 12.
HTML extraído para o arquivo irmão nas duas fases. Deslizes menores: datou 18/08 (era 17/08) e
marcou ❌ em "taxa de regressão: não informado", que deveria ser n/a.

---

# Passo 3 — Canais de invocação

Todos passaram em 17/08/2026. Refaça apenas para confirmar do zero.

| | Comando | Passa se | Status |
|:---:|---|---|:---:|
| **F1** | `@foursys_sdd_po /specify implementar cancelamento de boleto` | o texto livre chega e substitui a história ativa | ✅ |
| **F2** | `@foursys_sdd_po /plan #BoletoController.java` | o arquivo referenciado entra no contexto | ✅ |
| **F3** | `@foursys_sdd_po /implement` | abre o Copilot Chat com a lista de arquivos, sem erro | ✅ |
| **F4** | `@foursys_sdd_po /skill springboot-testing` | imprime a skill no chat | ✅ |
| **F4** | `@foursys_sdd_po /playbook` | abre o seletor no topo; escolhido um, salva em `doc_projeto/playbook/` | ✅ |
| **F5** | sidebar → aba **Catálogo** → `springboot-testing` | abre a skill completa | ✅ |
| **F6** | `/springboot-testing` sozinho, **no início** da mensagem | o Copilot carrega a skill e age conforme ela | ✅ |
| **F7** | `Ctrl+Shift+P` → digitar `Foursys` | aparecem **25 comandos** | ✅ |

> **F6 é o mais importante dos sete** — é o canal que vale para IntelliJ e CLI, onde a extensão
> do VS Code não existe.

---

# Limites conhecidos — não são falhas

Registre se aparecerem, mas não trate como defeito:

| | Limite |
|:---:|---|
| 1 | **A instruction não chega no Implement.** `applyTo` é `**/*.java` e o Implement abre o chat pedindo só `.md`. Os canais que funcionam são **Constituição** e **Task List** |
| 2 | **Angular usa cobertura declarada, não medida.** `readCoverageReport` e `readMavenStackInfo` são exclusivos de Java |
| 3 | **Sessão 1 pode executar tarefa da Sessão 2** — intermitente, sem correção |
| 4 | **`/playbook` roda sem contexto de workspace** — a saída pede ao dev que cole o código |
| 5 | **A caixa de e-mail `@foursys.com.br` não é testável nesta máquina** — só aparece em `globalState` limpo |
| 6 | **A IA obedece ao usuário contra a arquitetura** quando o pedido é explícito |

## Sobre os 95% neste Kit

O Kit tem cerca de **300 linhas contadas**. Uma linha descoberta vale **0,32%**, e as ~17 linhas
de código legado sem teste representam **5,4% de déficit fixo**.

Cobrir 100% da feature nova ainda deixaria o total em torno de **94,6%**. A meta de 95% é
alcançável em projeto novo ou bem coberto — **neste Kit ela é estruturalmente apertada**. Não
confunda isso com falha do Hub.

---

# Aberto — decisão, não teste

| | Assunto |
|:---:|---|
| 1 | **`pom.xml` do Kit** — a IA acrescentou `adapter/output/*/database/entity/*Entity.java` ao `sonar.coverage.exclusions` por conta própria, tirando do gate oficial uma classe que reprovava. A tradução do `<excludes>` do JaCoCo feita junto é legítima. **Só a linha da Entity deveria ser revertida** |
| 2 | **Skill no Implement** — pôr `/springboot-testing` no **início** do `instrucaoDeImplement`. Custo medido: ~0 token. Nunca testado na posição correta |
| 3 | **Angular** — nunca exercitado. Precisa de outro repositório e da instruction Angular na `main` |


---

# 📌 Rodada completa de 17/08/2026 — resultado

**9 de 11 fases limpas.** História `historia-202608172356` no `ensc-srv-kit-java`, Kit limpo do zero.

| | |
|---|---|
| ✅ | Constitution, Specify, Plan, Tasks, Implement S1, Plano de Testes, Review de Entrega, Relatório de Qualidade |
| ⚠️ | Implement S2 (relatório não mediu), Casos de Teste (falso positivo) |

**Cobertura medida:** linha 96,0% (214/223) · branch 92,9% (13/14) — passa nos dois gates.
A entrega isolada: 124/128 = 96,9%; sem o `MapperImpl` gerado, **100%**. O `LogBoletoCobranca`,
que ontem ficou em 0/11 e derrubou a rodada, hoje está **19/19**.

## Candidatas de correção (nenhuma aplicada)

**C-30 · O Relatório de Implementação não declara o total medido.**
Lista cobertura por classe (todas 100%) e conclui `Meta ≥95% / ✅ ATENDIDO` sem nunca dizer o
número. É o que a seção 4 do playbook proíbe. A conclusão ficou certa **por sorte**: com legado
pior diria ✅ igual. Conserto: exigir o número e a fonte antes do veredito.

**C-31 · O detector de placeholder acusa Gherkin válido.**
`detectarPlaceholders` alertou `<mensagem>` no `casos_teste.md`, que é sintaxe obrigatória de
Scenario Outline. O texto veio do próprio playbook
(`spring_boot/foursys-qa-test-cases.md:76`), e o detector só acusa o que está no playbook —
então pegou o acerto. Afeta generic, node e spring_boot. Conserto: pular a fase
`qa-test-cases`, ou não acusar quando o documento tem `Examples:`.

**C-32 · Ninguém reconcilia critérios quando o Plan corta escopo.** *(estrutural)*
O Specify criou a suposição S5 e o critério **C4** (idempotência). O Plan **rejeitou** com
justificativa. Tasks e Implement não fizeram. A QA então **reprovou por C4 faltando** — medindo
contra um critério abandonado de propósito. Não é erro de nenhuma fase: falta um passo que
renegocie os critérios de aceite quando o Plan reduz escopo.

## Esclarecido — não é defeito

**O HTML intermitente.** O Hub só grava o `.html` se a IA embutir um bloco ```` ```html ```` na
resposta (`extension.ts:954-959`). O playbook pede; a IA às vezes obedece. Não é bug do Hub.
