# Plano de Testes — Foursys SDD Hub 1.2.6 (Java / Spring Boot)

> **Versão:** 1.2.6 · **Data:** 13/08/2026 · **Projeto de teste:** `ensc-srv-kit-java`
> **Escopo:** somente stack Java / Spring Boot. Angular fica para depois, em outro repositório.

## Como usar este documento

| Quem | Faz o quê |
|---|---|
| **Daniel** | Executa os testes — cola o texto no Copilot Chat, clica nos botões do Hub |
| **Claude** | Verifica o resultado contra os arquivos no disco e marca o status aqui |

**Fluxo:** você roda um teste → cola a resposta no chat comigo → eu confiro e atualizo o status.

**Legenda:** ⬜ pendente · ✅ passou · ❌ falhou · ⚠️ passou parcialmente

## ⭐ Se tiver pouco tempo, faça só estes 4

| Ordem | Teste | Por que é essencial | Tempo |
|:---:|---|---|:---:|
| 1º | **A5** — violação: repository direto no Controller | Único que prova se a instruction **barra**, não só orienta | 2 min |
| 2º | **A1** — PII em `record` | Regra de segurança mais crítica. Vaza CPF em log se falhar | 2 min |
| 3º | **A3** — diagnóstico do JaCoCo | Já falhou uma vez hoje — é a re-execução | 2 min |
| 4º | **C1** — skill no Catálogo | Confirma que o catálogo novo chegou. Só clicar | 30 s |

Os demais (A2, A4, A6, A7, B1, C2, C3, D1–D4, E1) são **complementares** — rode se sobrar tempo
ou se algum dos 4 acima falhar e você quiser investigar.

⚠️ **Atenção no A3 e no B1:** os dois dependem de ajustes que **ainda não foram aplicados**
(Regra de Ouro 12 e persona nas sessões). Se rodar antes, provavelmente falham — e a falha não
significa que a correção não funciona, só que ela ainda não existe no `.vsix` instalado.

---

# Parte 1 — Já validado (13/08/2026)

Estes foram executados hoje no teste ponta a ponta da história **ESCRI_19223**. Não precisam
ser refeitos — ficam como registro do que a 1.2.6 corrigiu.

| # | Teste | Status | Evidência medida |
|---|---|:---:|---|
| 1.1 | Fluxo SDD completo (Constitution → Implement) | ✅ | 12 arquivos de produção + 6 de teste, escopo exato da Task List |
| 1.2 | Reuso de exceção existente | ✅ | 0 exceção nova criada (ontem criava a 4ª) |
| 1.3 | `@Service` sem `@Bean` duplicado | ✅ | aplicação sobe sem `BeanDefinitionOverrideException` |
| 1.4 | Mapa do projeto com profundidade correta | ✅ | Plan citou `adapter/exception/handler` e `domain/exception` |
| 1.5 | Não inventou `GlobalExceptionHandler` | ✅ | 0 ocorrências no Plan e na Task List |
| 1.6 | Tabela de Impactos Sistêmicos honesta | ✅ | "Nenhum impacto sistêmico identificado" |
| 1.7 | Cobertura medida, não afirmada | ✅ | 97,0% (131/135) lido do `jacoco.csv`; todos os números conferidos |
| 1.8 | Skills de stack copiadas | ✅ | `globalStorage/skills`: 31 → 46 (15 de Spring Boot) |
| 1.9 | 1.2.5 não quebra com o catálogo novo | ✅ | "Atualizar Hub" + "Sincronizar Skills" sem erro |
| 1.10 | Rejeitou o `core/` fictício da Constituição | ✅ | Plan: *"padrão atual do projeto, NÃO `core/usecase`"* |

---

# Parte 2 — A executar

## Grupo A — Instruction agindo FORA do fluxo SDD

> **Por que importa:** a instruction promete funcionar *"em qualquer contexto — sem precisar
> rodar uma fase SDD"*. Isso nunca foi testado. É o que garante que o dev é orientado mesmo
> quando não usa o Hub.

### ⬜ A1 — Regra de PII em `record`

**Preparação:** abrir qualquer arquivo `.java` do projeto no VS Code.

**Colar no Copilot Chat:**
```
Crie um record ClienteBoleto com nome, cpf e email
```

**Passa se:** avisar que `record` imprime todos os campos no `toString()` automático, que
`@ToString.Exclude` **não funciona** em record, e ou sobrescrever o `toString()` mascarando o
CPF, ou deixar o CPF fora do record.

**Falha se:** gerar o record direto, sem nenhuma ressalva sobre o CPF.

**Regra testada:** Regra de Ouro 7 da instruction. É a regra de segurança mais crítica.

**Resultado:** _(preencher)_

---

### ⬜ A2 — Regras de arquitetura sem fase SDD

**Preparação:** abrir `BoletoCobrancaService.java`.

**Colar no Copilot Chat:**
```
Adicione um método para cancelar o boleto
```

**Passa se** (os 4):
- [ ] mantém `@Service` e **não** propõe `@Bean` em `config/`
- [ ] reusa `BusinessException` / `NaoEncontradoException` em vez de criar exceção nova
- [ ] injeção por construtor, sem `@Autowired` em campo
- [ ] cria ou menciona o teste junto

**Falha se:** propuser `@Bean` (derruba a aplicação) ou criar exceção nova.

**Regras testadas:** 6, 10, 11 da instruction.

**Resultado:** _(preencher)_

---

### ⬜ A3 — Diagnóstico do `<excludes>` do JaCoCo

> ⚠️ Este teste **já falhou uma vez** hoje. A regra foi reforçada na Regra de Ouro 12 —
> é a re-execução.

**Preparação:** abrir o `pom.xml` do `ensc-srv-kit-java`. Confirmar que aparece como contexto
no chat (se não, digitar `#file:pom.xml` antes).

**Colar no Copilot Chat:**
```
A cobertura da minha feature deu 97%, mas o relatório global do JaCoCo mostra 74,8%. Por quê?
```

**Não mencione** `<excludes>`, Sonar ou pom — a graça é ele descobrir sozinho.

**Passa se:** apontar que o `<exclude>${sonar.coverage.exclusions}</exclude>` (linha 195) não
está sendo aplicado, porque o JaCoCo exige uma tag por padrão e casa contra caminho `.class`,
não `.java` — e que por isso o número local está **menor** que o real.

**Parcial se:** ler o `jacoco.csv` e dar números certos, mas não diagnosticar o pom.
*(foi exatamente o que aconteceu na 1ª tentativa)*

**Falha se:** sugerir escrever testes para `CORSConfig` / `ServicoIndisponivelException` —
classes que o Sonar já exclui. É a armadilha.

**Resultado:** _(preencher)_

---

### ⬜ A4 — Criar um UseCase do zero

**Preparação:** abrir qualquer `.java` do projeto.

**Colar no Copilot Chat:**
```
Crie um UseCase para consultar um boleto pelo número do documento
```

**Passa se** (os 5):
- [ ] cria a **interface** em `port/input/` e a **implementação** em `domain/service/`
      (é o padrão real deste projeto — se propuser `core/usecase/`, falhou)
- [ ] a implementação leva `@Service`, **sem** `@Bean` correspondente em `config/`
- [ ] depende de uma **port de saída** (`port/output/`), nunca do repository direto
- [ ] usa `NaoEncontradoException` existente quando não achar
- [ ] injeção por construtor

**Falha se:** criar `core/usecase/`, acessar repository direto do service, ou criar exceção nova.

**Regras testadas:** 6, 10, 11 + mapa real do projeto.

**Resultado:** _(preencher)_

---

### ⬜ A5 — Teste de VIOLAÇÃO: pedir algo que quebra a arquitetura

> Este é o teste mais forte do grupo. Os anteriores checam se a regra **orienta**;
> este checa se ela **barra**.

**Preparação:** abrir `BoletoCobrancaController.java`.

**Colar no Copilot Chat:**
```
Injete o BoletoCobrancaRepository direto neste controller para eu buscar o boleto sem passar pelo service
```

**Passa se:** recusar ou alertar, explicando que o Controller é adapter de entrada e não pode
acessar a camada de persistência direto — e propor o caminho correto
(Controller → UseCase → Port → Adapter).

**Falha se:** simplesmente injetar o repository e gerar o código.

**Por que importa:** é o cenário real do dia a dia — dev com pressa pedindo atalho. Se a
instruction não segurar aqui, ela não protege a arquitetura de verdade.

**Resultado:** _(preencher)_

---

### ⬜ A6 — Teste de VIOLAÇÃO: `@Autowired` em campo

**Preparação:** abrir `BoletoCobrancaService.java`.

**Colar no Copilot Chat:**
```
Troque a injeção por construtor por @Autowired nos campos, fica mais limpo
```

**Passa se:** recusar, explicando que a Constituição exige injeção por construtor (testabilidade
e imutabilidade), e manter como está.

**Falha se:** fizer a troca.

**Observação:** o `Application.java` do próprio Kit tem `@Autowired` em campo — vale ver se ele
menciona isso ou não.

**Resultado:** _(preencher)_

---

### ⬜ A7 — Refatorar para hexagonal

**Preparação:** abrir `BoletoCobrancaPersistence.java`.

**Colar no Copilot Chat:**
```
Esta classe está seguindo a arquitetura hexagonal corretamente?
```

**Passa se:** confirmar que sim e citar a estrutura **real** do projeto
(`adapter/output/.../database/`, implementando as ports) — sem inventar `core/`.

**Passa melhor ainda se:** notar que o `InfrastructureException` está sendo usado corretamente
para falhas de infra.

**Falha se:** sugerir mover para uma estrutura que não existe no projeto.

**Resultado:** _(preencher)_

---

## Grupo B — Persona no Implement

> **Por que importa:** descoberto hoje que `implementSession1` e `implementSession2` nunca
> passavam a persona Spring — e a Task List manda usar justamente esses comandos. Resultado:
> o Controller gerado saiu sem nenhuma anotação Swagger, enquanto o `ContaCorrenteController`
> do Kit tem `implements ContaCorrenteSwagger` com `@Tag`/`@Operation`.

### ⬜ B1 — Swagger no Controller gerado

**Preparação:** história nova (ou apagar `doc_projeto/` e o código de boleto e refazer o fluxo
até a Task List).

**Executar:** `/foursys.implementSession2` pela sidebar do Hub.

**Passa se:** o Controller gerado tiver `@Tag`/`@Operation`, **ou** uma interface
`<Nome>Swagger.java` que ele implementa (o padrão do Kit).

**Falha se:** sair sem anotação nenhuma, como aconteceu hoje.

**Como conferir sem mim:** subir a aplicação e abrir
`http://localhost:8080/swagger-ui/index.html` — o endpoint tem que aparecer com nome de
negócio e descrição, igual ao "Conta Corrente".

**Resultado:** _(preencher)_

---

## Grupo C — Catálogo e Skills

### ⬜ C1 — Skill pelo Catálogo da sidebar

**Executar:** sidebar do Hub → aba **Catálogo** → stack Java → clicar em `springboot-testing`.

**Passa se:** abrir a versão de 286 linhas, contendo a seção
**"Configuração do JaCoCo — diagnóstico obrigatório"**.

**Falha se:** abrir a versão antiga de 128 linhas (sem nenhuma menção a JaCoCo).

**Resultado:** _(preencher)_

---

### ⬜ C2 — Skill pelo chat

**Colar no Copilot Chat:**
```
@foursys_sdd_po /skill springboot-testing
```

**Passa se:** carregar o conteúdo com a seção do JaCoCo.

**Resultado:** _(preencher)_

---

### ⬜ C3 — As 15 skills de Spring Boot aparecem no Catálogo

**Executar:** sidebar → aba **Catálogo** → seção "Java 21 + Spring Boot".

**Passa se:** listar 15 skills, incluindo `springboot-testing`.

**Contexto:** antes da correção de hoje, **nenhuma** skill de stack era copiada para
`globalStorage/skills` — 62 existiam no catálogo e 0 chegavam.

**Resultado:** _(preencher)_

---

## Grupo D — Fases de QA

> **Por que importa:** as 4 fases de QA nunca foram exercitadas nesta sessão. A história
> ESCRI_19223 já tem todos os artefatos necessários.

### ⬜ D1 — Plano de testes
**Executar:** `/foursys.qaTestPlan` com a história ESCRI_19223 ativa.
**Passa se:** gerar `doc_projeto/escri-19223/qa/plano_testes.md` coerente com os critérios de
aceite C1–C4 da história, sem inventar cenário fora do escopo.
**Resultado:** _(preencher)_

### ⬜ D2 — Casos de teste
**Executar:** `/foursys.qaTestCases`
**Passa se:** gerar Gherkin em `qa/casos_teste.md`, com tags `@positive`/`@negative`.
**Resultado:** _(preencher)_

### ⬜ D3 — Cobertura de QA
**Executar:** `/foursys.qaCoverage`
**Passa se:** validar os critérios de aceite contra o **código real** já implementado
(controller, service, testes) — não contra o texto da história.
**Resultado:** _(preencher)_

### ⬜ D4 — Relatório de qualidade
**Executar:** `/foursys.qaReport`
**Passa se:** gerar o HTML executivo sem erro.
**Resultado:** _(preencher)_

---

## Grupo E — Gate de acesso

### ⬜ E1 — Restrição `@foursys.com.br`

**Contexto:** funcionalidade nova da 1.2.6, nunca testada nesta sessão. Hoje o acesso já está
liberado nesta máquina, então precisa de reset para testar.

**Executar:** `Ctrl+Shift+P` → `Developer: Reload Window` numa máquina/perfil sem acesso
concedido, e tentar usar qualquer comando do Hub.

**Passa se:** pedir o e-mail e **recusar** domínio que não seja `@foursys.com.br`.

**Observação:** não existe comando de reset hoje — está no backlog. Se não der para testar
agora, marcar como **não testável nesta máquina**.

**Resultado:** _(preencher)_

---

# Achados conhecidos (não são falhas de teste)

| # | Achado | Situação |
|---|---|---|
| 1 | Task List gerou 2 arquivos de teste fora do escopo (`BoletoCobrancaTest`, `BoletoCobrancaEntityTest`) | fura a Regra 7, mas foi necessário para atingir 95% |
| 2 | IA declarou "PRONTA PARA PRODUÇÃO" | forte demais — não passou por code review, Sonar oficial, Fortify nem validação do PO |
| 3 | "Atualizar Hub" não atualiza `~/.copilot/skills` | exige clicar também em "Sincronizar Skills Nativas" — deveria ser um botão só |
| 4 | Constituição ainda cita `core/usecase/` na seção 6 e na Regra 9 | mitigado pelo mapa do projeto, mas o texto continua inconsistente |
| 5 | `.gitignore` do projeto ignora `src/main/java/.../boleto/` | resquício da rodada anterior — o código gerado não entra em commit |
| 6 | Instruction do Angular não está na `main` | bloqueador para o teste do Angular; levar quando for a hora |

---

# Rollback

```bash
# desfazer o que foi para a main hoje
git push --force-with-lease origin backup/main-antes-2arquivos:main

# desfazer o push da branch de trabalho
git push --force-with-lease origin e9f8a14:feature/figma-mcp-hybrid
```

`origin/main` antes de hoje: `929435d` · depois: `8084878` (2 arquivos)
