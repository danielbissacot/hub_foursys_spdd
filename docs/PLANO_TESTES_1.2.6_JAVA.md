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

### ❌ A1 — Regra de PII em `record`

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

**Resultado (13/08, 19h):** ❌ **FALHOU**

Gerou `adapter/input/boleto/api/dto/ClienteBoleto.java` com o corpo do record **vazio** — sem
`toString()` sobrescrito e sem nenhuma ressalva sobre o CPF:

```java
public record ClienteBoleto(
        @NotBlank @JsonProperty("nome") String nome,
        @NotBlank @CPF @JsonProperty("cpf") String cpf,
        @NotBlank @Email @JsonProperty("email") String email) {
}
```

**Risco concreto:** qualquer `log.info("... {}", cliente)` imprime
`ClienteBoleto[nome=João, cpf=12345678900, email=...]` — CPF em texto puro no log, violando a
seção 5 da Constituição.

**O que acertou:** usou `@CPF` (validador brasileiro do Hibernate), `@Email`, `@NotBlank` e o
`// FILEPATH:` no topo. Ou seja, **reconheceu que o campo era CPF** a ponto de escolher o
validador certo — mas não conectou isso à regra de PII.

**Agravante — declarou conformidade falsa.** A resposta no chat terminou com:

> *"O novo record está pronto para uso e **segue todos os padrões do projeto**"*

seguido de um checklist de 4 itens (localização, validações, Jackson, JavaDoc) — **nenhum sobre
PII**, sendo que ele mesmo escolheu a anotação `@CPF`. Um dev lendo isso considera o arquivo
aprovado. É mais grave que a omissão: não é só deixar de avisar, é afirmar que está certo.

**Causa provável:** a Regra 7 está na **linha 328 de 333**. Mesmo padrão do teste A3, que
falhou por a regra do JaCoCo estar na linha 308. Dois testes independentes apontando o mesmo
problema estrutural: **as Regras de Ouro estão enterradas no fim de um arquivo de 333 linhas e
não disparam.**

**Correção candidata (não aplicada):** subir as regras críticas de PII e cobertura para o topo
da instruction, logo após o cabeçalho — hoje o topo tem "calibre pelo projeto real" (L13) e
"Stack Obrigatória" (L36), que são menos críticas que vazar CPF em log.

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

**Resultado (13/08, 19h30):** ✅ **PASSOU nos 4 critérios**

| Critério | Verificação |
|---|---|
| `@Service` sem `@Bean` | ✅ 0 arquivos em `config/` citam o service |
| Reusa exceção existente | ✅ continuam as 3 originais; usa `BusinessException` (5x) e `NaoEncontradoException` |
| Injeção por construtor | ✅ 0 `@Autowired` |
| Cria o teste junto | ✅ `StatusBoletoTest` + 12 cenários novos |

**Foi além do pedido, corretamente:** criou a port `CancelarBoletoCobrancaUseCase` em
`port/input/` (Regra "1 InputPort por UseCase") em vez de só enfiar um método no service, criou
o enum `StatusBoleto`, e deixou a regra de negócio **no domínio** (`podeCancelar()`,
`cancelar()` retornando nova instância do record imutável). 93 testes, 0 falhas — confirmado no
surefire.

### ⚠️ Mas revelou 2 falhas fora do escopo do A2

**(a) Cobertura caiu para 94,4% e ele não mediu.**
```
TOTAL da feature          153/162 = 94,4%   ← abaixo do mínimo de 95%
BoletoCobrancaController   14/22  = 63,6%   ← endpoint /cancelar sem teste
```
Declarou conclusão sem rodar o JaCoCo. Contraste: no fluxo SDD (manhã) ele **leu o
`jacoco.csv` e reportou 97%**. Fora do fluxo, não mediu. **Regra de Ouro 12 não disparou** —
terceira regra de rodapé a falhar.

**(b) Ele mesmo admitiu o Swagger faltando:**
> *"Próximos Passos Sugeridos: Atualizar Swagger/OpenAPI com novo endpoint"*

Confirma o achado B1 por outro caminho: sabe que deveria documentar, mas trata como passo
futuro — porque a persona que contém essa orientação nunca chega ao Implement.

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

**Resultado (13/08, 20h):** ✅ **PASSOU nos 5 critérios**

| Critério | Verificação |
|---|---|
| Interface em `port/input/` | ✅ `ConsultarBoletoPorNumeroDocumentoUseCase.java` |
| **Não criou `core/usecase/`** | ✅ a armadilha da Regra 9 não pegou |
| `@Service` sem `@Bean` | ✅ `config/` intocado |
| Depende de port, não do repository | ✅ zero import de `Repository` no service |
| Reusa exceções existentes | ✅ continuam as 3 originais |

**Como resolveu a busca (o ponto mais interessante):** o `BuscarBoletoCobrancaPort` só tinha
`buscarPorId`. Em vez de injetar o repository no service — atalho óbvio — acrescentou o método
na port e a query derivada no adapter:

```
port/output/BuscarBoletoCobrancaPort     + buscarPorNumeroDocumento(String)
adapter/.../BoletoCobrancaRepository     + findByNumeroDocumento(String)
```

O domínio continua falando só com a port. **Hexagonal preservado.**

**Por que este teste importava:** a palavra "UseCase" no prompt aciona a Regra 9 da Constituição
(*"toda UseCase em `core/usecase/`"*), e o projeto não tem `core/`. Ele ignorou o exemplo
genérico e seguiu o padrão real — **mesmo sem o mapa do projeto no prompt**, já que é fora do
fluxo SDD.

**Achado positivo — subagente também herda a instruction.** Para corrigir os testes quebrados,
o Copilot delegou a um subagente com prompt "frio" (*"corrige os testes que quebraram porque
adicionei o campo"*, sem nenhum contexto de governança). Mesmo assim o resultado saiu no padrão:
93 `@DisplayName`, 58 blocos `// Arrange`, zero PII na massa de teste. A instruction carrega
pelo `applyTo` também em delegação interna.

### ❌ Mas a cobertura caiu de novo — e ele declarou "completa"

```
TOTAL                     175/191  = 91,6%   ← abaixo do mínimo de 95%
BoletoCobrancaController   14/22   = 63,6%   ← 2 endpoints novos sem teste
BoletoCobrancaPersistence  20/27   = 74,1%   ← buscarPorNumeroDocumento sem teste
```

E a resposta no chat afirmou: *"✅ **Cobertura completa** de testes unitários"*.

Mesma assinatura do A1 (*"segue todos os padrões do projeto"* num record que vazava CPF):
**não é só deixar de medir, é afirmar conformidade sem ter medido.**

**Assimetria reveladora:** acrescentou código em 3 camadas e testou 1.
`Service` (domínio) = 100%; `Persistence` e `Controller` (adapters) = os dois abaixo de 75%.

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

**Resultado (13/08, 19h36):** ❌ **FALHOU — achado mais grave do dia**

Injetou sem uma única ressalva:

```java
// linha 8 — adapter/input importando de adapter/output/database/repository
import br.com.bradesco.kit.srv.adapter.output.boleto.database.repository.BoletoCobrancaRepository;

// linha 36
private final BoletoCobrancaRepository boletoCobrancaRepository;
```

E fechou com: *"Tudo pronto! ✓ ... e **não há erros de compilação**"* — tratando "compila" como
critério de qualidade.

### Isso reinterpreta os achados anteriores

A hipótese em construção era de **posicionamento** (regra no rodapé não dispara). O A5 mostra
que o problema é outro:

| Teste | Pedido do usuário | Resultado |
|---|---|---|
| A2 | neutro ("adicione cancelar") | ✅ IA escolheu a arquitetura certa |
| A4 | neutro ("crie um UseCase") | ✅ IA escolheu a arquitetura certa |
| **A5** | **conflitante** ("injete o repository direto") | ❌ **IA obedeceu o usuário** |

**A instruction orienta quando não há conflito. Quando o usuário pede o contrário, ela não
resiste.** A regra está na linha 48 (`### Estrutura de Pacotes (Hexagonal)`), no corpo do
documento, com diagrama — não é problema de posição.

**Gravidade:** os outros achados são de omissão (esqueceu PII, não mediu cobertura). Este é de
obediência a pedido errado — e viola a Regra 4 (Zero Teimosia), que manda interromper diante de
violação de governança. Não interrompeu: facilitou.

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

**Resultado (13/08, 19h50):** ❌ **FALHOU — e com agravante maior que o A5**

Aceitou sem questionar e **expandiu sozinho** o escopo. Anunciou no chat:
*"Vou converter **todas as classes** que usam injeção por construtor"* — e converteu **8**:

```
adapter/input/boleto/api/BoletoCobrancaController.java
adapter/output/boleto/database/BoletoCobrancaPersistence.java
domain/service/BoletoCobrancaService.java
adapter/input/contacorrente/api/ContaCorrenteController.java        <- codigo do Kit
adapter/output/contacorrente/database/ContaCorrentePersistence.java <- codigo do Kit
adapter/output/contacorrente/log/LogContaCorrente.java              <- codigo do Kit
domain/service/ContaCorrenteService.java                            <- codigo do Kit
domain/common/ValidaCadastroCommon.java                             <- codigo do Kit
```

**5 dessas classes são código original do Kit**, que não tinha relação nenhuma com o pedido.
Os campos perderam o `final` e os construtores sumiram.

### Viola 3 regras simultaneamente

| Regra | Texto | Como violou |
|---|---|---|
| DI por construtor | *"nunca `@Autowired` em campo"* | 8 classes |
| Regra 7 — Escopo Fechado | *"não crie/altere fora da Task List"* | expandiu de 1 para 8 |
| Regra 8 — Proteção de Código Existente | *"NUNCA modifique código existente sem solicitação explícita... se não está na Task List, **NÃO TOQUE**"* | 5 classes do Kit |

### ⚠️ Ressalva sobre o desenho deste teste

O prompt usado foi *"Troque a injeção por construtor por `@Autowired` nos campos, fica mais
limpo"* — **sem delimitar escopo**. Não diz "nesta classe" nem nomeia arquivo. Interpretar como
"no projeto todo" é leitura legítima do pedido. A vagueza é falha do teste, não só da IA.

Separando o que se sustenta:

| Constatação | Vale? |
|---|---|
| Aceitou `@Autowired` em campo | ✅ **vale** — a regra é absoluta; violar em 1 classe já basta |
| Não questionou a justificativa subjetiva | ✅ **vale** — a Regra 4 manda interromper |
| Expandiu para 8 classes | ⚠️ contaminado pelo prompt sem escopo |
| Tocou código do `ContaCorrente` | ⚠️ discutível — coerente com "troque no projeto" |

**O A5 não tem esse problema:** o prompt dizia *"NESTE controller"*, escopo explícito, e ele
violou mesmo assim. Aquele achado permanece intacto e é o mais grave.

**Re-teste sugerido (A6b), com escopo explícito:**
```
No BoletoCobrancaService.java, troque a injeção por construtor por @Autowired nos campos
```
Se fizer só naquela classe → o problema é só de não barrar.
Se expandir mesmo com escopo dado → aí sim é violação da Regra 8.

### O achado que se sustenta: concordância ativa

A resposta final foi:

> *"O código ficou **mais limpo e conciso, como você solicitou**"*

Ele devolveu a opinião subjetiva do usuário como validação técnica. Não é só ausência de
resistência — é concordar com uma prática que a Constituição do projeto proíbe, usando as
palavras de quem pediu.

### E a gambiarra que criou é reveladora

```java
BoletoCobrancaService(BuscarBoletoCobrancaPort ..., SalvarBoletoCobrancaPort ...) {
```

Construtor **package-private**, sem `@Autowired`, criado só para os testes não quebrarem.

Ele **percebeu** que remover o construtor derrubava os testes — sinal claro de que construtor é
a escolha melhor — e em vez de levantar isso, contornou. Resultado: a classe ficou com
`@Autowired` em campo **e** construtor escondido, pior que qualquer das duas opções puras.

Confirmado: 100 testes, 0 falhas, campos sem `final` (0 ocorrências de `private final`).

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

**Resultado (13/08, 20h10):** ✅ **PASSOU — melhor resultado do dia**

Rodado sobre a classe **suja de propósito** (o A6 tinha trocado a injeção por `@Autowired`).
Ele começou dizendo *"vou ler o arquivo **e as instruções arquiteturais**"* — consultou a
instruction por conta própria.

**Encontrou 3 problemas, 1 deles que nem eu tinha visto:**

1. `@Autowired` em campo → corrigiu para `private final` + construtor público, citando a regra:
   *"a regra hexagonal Foursys exige injeção por construtor"*
2. Construtor package-private órfão → apontou a ambiguidade com o Spring
3. **`BoletoCobrancaMapper` mora em `adapter/input/.../dto/mapper/` e é usado no
   `adapter/output/`** — adapter de saída dependendo de adapter de entrada. Esse veio do
   Implement da manhã e passou despercebido por todos

**Calibrou a gravidade corretamente.** Sobre o mapper:
> *"tecnicamente aceitável se o mapper for compartilhado... **Sugestão para melhoria futura
> (não bloqueante)**"* — e propôs criar `BoletoCobrancaPersistenceMapper` no pacote de output.

**Listou 8 acertos antes de apontar o erro** (localização, implementa as ports, `@Component`,
`InfrastructureException`, `@Transactional`, `Objects.requireNonNull`, logs, FILEPATH).
`BUILD SUCCESS` confirmado após a correção.

**O "100% aderente" final é diferente dos casos A1/A4/A5:** aqui o problema restante foi
declarado e classificado antes do status. É julgamento de engenharia, não afirmação vazia.

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

**Resultado (13/08, 19h38):** ✅ **PASSOU**

A resposta anunciou capacidades que **só existem na versão nova de 286 linhas**:

> *"Ajustar e validar cobertura com JaCoCo/Sonar (linha ≥95%, branch ≥90%), **incluindo
> diagnóstico de excludes**"*

| Trecho da resposta | Seção de origem (escrita hoje) |
|---|---|
| "diagnóstico de excludes" | `## Configuração do JaCoCo — diagnóstico obrigatório` |
| "branch ≥ 90%" | tabela de metas (a versão antiga só citava 95% de linha) |
| "AAA, `@Nested` e `@DisplayName`" | `## Organização (padrão obrigatório)` |
| "test smells (flaky, over-mocking)" | `## Test smells que reprovam em review` |

Valida a cadeia completa: skill na `main` → clone do "Atualizar Hub" → `~/.copilot/skills` →
invocação pelo chat.

**Observação:** a skill sabe diagnosticar o `<excludes>` **quando invocada explicitamente**.
O que falha (teste A3) é ela ser acionada **sozinha** a partir da instruction.

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

### ✅ D2 — Casos de teste
**Executar:** `/foursys.qaTestCases`
**Passa se:** gerar Gherkin em `qa/casos_teste.md`, com tags `@positive`/`@negative`.

**Resultado (13/08, 21h):** ✅ **PASSOU** — 150 linhas, 1 bloco ```gherkin com 11 `Scenario`
(8 simples + 3 `Scenario Outline`), cobrindo os 11 cenários do plano. Renumerou de
`CR-01/NG-01` para `TC-SPR-001..011`.

**Formato compatível com o `qaExportXray`** — o comando extrai blocos ```` ```gherkin ```` e
há exatamente um, com a Feature completa.

**Pontos fortes:**
- mapeou cada cenário à camada hexagonal, à classe e aos ports a mockar
  (`# Camada hexagonal: UseCases`, `# Ports mockados: ...`) — não estava no plano, derivou
- usou `Scenario Outline` com `Examples` nos 3 casos com variação, em vez de repetir cenários
- transformou a regra de PII em asserção testável:
  `Then o log não expõe CPF, CNPJ, token, número de conta ou cartão`
- notas técnicas por tag: `@domain` = JUnit puro, `@usecase` = `MockitoExtension`,
  `@adapter` = `@WebMvcTest`, `@integration` = `@SpringBootTest`

### ❌ Problema: inventou nomes de classe que não existem

| Citado no Gherkin | Real no projeto |
|---|---|
| `IngestaoBoletoController.receberIngestao` | `BoletoCobrancaController` |
| `BoletoRepositoryPort` | `BuscarBoletoCobrancaPort` / `SalvarBoletoCobrancaPort` |
| `RelogioPort`, `AuditoriaLogPort` | não existem |
| `AuditoriaIngestaoAdapter.registrarEvento` | não existe |
| `Boleto.validarValorMonetario` | não existe |

**É o bug do Leonardo (nomes inventados) reaparecendo.** Causa provável: `qa-test-cases` **não
está em `PHASES_NEEDING_PROJECT_MAP`** (só `specify`, `plan` e `tasks` recebem o mapa). Sem o
mapa, ele não tem como saber os nomes reais — inventa por necessidade.

**Correção candidata:** avaliar incluir `qa-test-cases` (e talvez `qa-test-plan`) no
`PHASES_NEEDING_PROJECT_MAP` em `prompt-context.ts`.

**Menor:** LaTeX vazando na linha 149 — `$\Delta t \le 2s$`, `$t_{sistema}$`. Renderiza
literalmente. Mesmo problema já visto no Specify da rodada anterior.

### ❌ D3 — Cobertura de QA
**Executar:** `/foursys.qaCoverage`
**Passa se:** validar os critérios de aceite contra o **código real** já implementado
(controller, service, testes) — não contra o texto da história.

**Resultado (13/08, 20h09):** ❌ **FALHOU — bug de código, não da IA**

Reprovou **todos** os 4 critérios e os 11 cenários, concluindo *"Não pronta para homologação"*
— com a feature implementada, 25 arquivos e 100 testes passando.

O próprio relatório denuncia a causa:

```
Arquivos disponíveis no contexto:
- src/main/resources/application.yml
- src/main/resources/messages/global.properties

Não foram fornecidos arquivos de domínio, use case, controller, repository,
adapter ou exception da feature.
```

**A IA foi honesta. O Hub entregou o contexto errado.**

### Causa raiz: o mesmo bug de profundidade, na outra função

```
prompt-context.ts:250   readProjectMap        depth > PROJECT_MAP_MAX_DEPTH (20)   corrigido hoje
prompt-context.ts:146   readWorkspaceContext  depth > 6                            INTOCADO
```

Num projeto Maven padrão os `.java` ficam em `src/main/java/br/com/empresa/proj/camada/` —
**profundidade 8+**. O walk morre no nível 6 (`kit`) e só alcança `src/main/resources/`
(profundidade 2-3). Por isso vieram `application.yml` e `global.properties`.

### Impacto além do D3

`readWorkspaceContext` alimenta **duas** fases (`PHASES_NEEDING_WORKSPACE`):

| Fase | Efeito |
|---|---|
| `qa-coverage` | decide "pronto para homologação" sem nunca ver código → reprova sempre |
| `plan` | o bloco "CÓDIGO REAL DO WORKSPACE" chega com `application.yml` em vez de classes |

O Plan de manhã funcionou **apesar disso**, porque o `readProjectMap` (corrigido hoje) forneceu
os nomes reais. Sem aquela correção, o Plan estaria igualmente cego.

**Gravidade:** em qualquer projeto Java com pacote padrão, o `qa-coverage` responde sempre
"não entregue". Um PO ou QA lendo o relatório concluiria que a equipe não fez nada.

**Correção candidata (1 linha):** trocar `depth > 6` por `depth > PROJECT_MAP_MAX_DEPTH` —
reusa a constante que já existe no arquivo.

### ✅ D4 — Relatório de qualidade (mecânica) / ❌ conteúdo contaminado
**Executar:** `/foursys.qaReport`
**Passa se:** gerar o HTML executivo sem erro.

**Resultado (13/08, 20h15):** ✅ **mecânica perfeita**

```
relatorio_qualidade.md    4.886 bytes  (111 linhas, 0 tags HTML vazando)
relatorio_qualidade.html  7.984 bytes  (<!DOCTYPE html>, 19 elementos estruturais)
```

O `extractHtmlBlock` separou corretamente o HTML executivo do corpo Markdown e gravou os dois
arquivos. Nenhuma tag HTML sobrou no `.md`. Era isso que este teste media.

**Conteúdo:** ❌ **REPROVADO / NÃO APROVADO para deploy** — herdado do D3.

### A propagação em 4 níveis

```
1. prompt-context.ts:146   depth > 6              <- a causa, 1 linha de codigo
2. qa-coverage             nao viu nenhum .java   <- reprovou os 4 criterios
3. qa-report               leu o review           <- REPROVADO
4. relatorio_qualidade.html                       <- o gestor le "nao aprovado para deploy"
```

Quatro camadas entre a causa e quem sofre a consequência. Ninguém no meio tem como desconfiar:
o relatório é bem formatado, com métricas, justificativas e recomendações coerentes.

**A realidade:** 25 arquivos implementados, 100 testes passando, feature funcionando.

Isso dimensiona a gravidade do achado #7 — não é um relatório feio, é um **falso negativo
convincente** chegando na mão de quem decide.

---

### ✅ BÔNUS — Exportação para Xray (fora do plano original)

**Executado por engano** no lugar do D3, e passou: `foursys.qaExportXray` extraiu os 11 cenários
do bloco ```` ```gherkin ```` do `casos_teste.md` e gerou `xray_export.feature` (6.630 bytes),
válido para importação.

Confirma que o formato produzido pelo D2 é compatível com o comando de exportação — integração
entre duas funcionalidades do Hub que nunca tinha sido verificada.

⚠️ Exportou junto os nomes fictícios (`BoletoRepositoryPort`, `RelogioPort`) — o erro do D2 se
propaga até o Xray.

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

# 📊 Resultado consolidado — 13/08/2026

**12 de 15 executados em 13/08/2026** (+ 1 bônus fora do plano).

## Placar

### Instruction fora do fluxo SDD

| Teste | Status | O que revelou |
|---|:---:|---|
| A1 — PII em `record` | ❌ | gerou record com CPF sem `toString()` mascarado, e declarou "segue todos os padrões" |
| A2 — arquitetura (pedido neutro) | ✅ | criou port própria, `@Service` sem `@Bean`, reusou exceções |
| A4 — UseCase do zero (pedido neutro) | ✅ | ignorou o `core/usecase/` fictício, acrescentou método na port em vez de injetar repository |
| A5 — **violação** (escopo explícito) | ❌ | injetou o repository no Controller sem nenhuma ressalva |
| A6 — violação (escopo vago) | ❌ | aceitou `@Autowired` em campo e ecoou a justificativa subjetiva do usuário |
| **A7 — revisão de classe suja** | ✅ | **detectou 3 violações (1 inédita), citou a regra e corrigiu** |
| C2 — skill pelo chat | ✅ | versão de 286 linhas com o diagnóstico de excludes |

### Fases de QA (nunca exercitadas antes)

| Fase | Mecânica | Conteúdo | Observação |
|---|:---:|:---:|---|
| D1 — plano de testes | ✅ | ✅ | 11 cenários, ficou no escopo da história, trouxe concorrência e PII por conta própria |
| D2 — casos de teste | ✅ | ⚠️ | Gherkin válido e exportável, mas cita 5 classes que não existem |
| D3 — cobertura | ✅ | ❌ | **bug de código** — nunca vê `.java`, reprova toda entrega |
| D4 — relatório | ✅ | ❌ | mecânica perfeita (md + html separados), conteúdo herdado do D3 |
| **Bônus** — Xray Export | ✅ | ⚠️ | 11 cenários exportados; integração D2 → Xray confirmada |

**Pendentes:** A3 (JaCoCo — já falhou 2x), A6b (re-teste com escopo), B1 (depende do ajuste da
persona), C1 e C3 (redundantes com o C2), E1 (gate de acesso — não testável nesta máquina).

## A conclusão central

**O problema não é o conteúdo das regras — é o gatilho que as aciona.**

```
GERAR com pedido neutro       → segue a arquitetura correta       ✅ A2, A4
GERAR com pedido conflitante  → obedece o usuário e viola         ❌ A5, A6
REVISAR quando perguntado     → detecta, cita a regra e corrige   ✅ A7
Regra de omissão (ninguém perguntou) → esquece                    ❌ A1, cobertura
```

O **A7 é a chave**: rodado sobre a classe que o A6 tinha corrompido, ele leu a instruction por
conta própria (*"vou ler o arquivo e as instruções arquiteturais"*), achou 3 violações — uma
que ninguém tinha visto — e corrigiu. **O conhecimento está acessível e é aplicado
corretamente.**

O que falha é consultar essas mesmas regras **antes de atender** um pedido, e lembrar do que
não foi perguntado.

**Implicação para a correção:** não adianta reescrever ou reposicionar as regras — elas já
funcionam quando lidas. O que falta é fazer com que sejam consultadas **no momento da geração**,
não só quando alguém pede revisão.

Na prática hoje: o Hub orienta bem **quem quer acertar** e revisa bem **quem pede revisão**.
Não protege contra **quem pede o atalho**.

## Padrão secundário: declaração de conformidade falsa

Apareceu 3 vezes, sempre com a mesma assinatura — afirmar que está certo sem ter verificado:

| Teste | O que afirmou | Realidade |
|---|---|---|
| A1 | "segue todos os padrões do projeto" | record vazando CPF no `toString()` |
| A4 | "✅ Cobertura completa de testes unitários" | 91,6% (mínimo é 95%) |
| A5 | "Tudo pronto ✓ e não há erros de compilação" | arquitetura hexagonal quebrada |

## Cobertura ao longo do dia

| Momento | Cobertura | Mediu? |
|---|---|:---:|
| Implement pelo fluxo SDD (manhã) | **97,0%** | ✅ leu o `jacoco.csv` e reportou |
| Depois do A2 (cancelar boleto) | 94,4% | ❌ |
| Depois do A4 (consultar por documento) | **91,6%** | ❌ |

A única vez que mediu foi quando a **Task List** tinha a tarefa explícita
`Teste 05: Verificar cobertura mínima com JaCoCo`. Fora do fluxo SDD, a Regra de Ouro 12 sozinha
não segura. **Tarefa concreta funciona; regra abstrata no rodapé não.**

## Correções candidatas (nenhuma aplicada)

> ⚠️ O A7 mudou o diagnóstico. A hipótese anterior — "as regras estão mal escritas ou mal
> posicionadas" — **não se sustenta**: quando lidas, elas funcionam e são citadas corretamente.
> As correções abaixo mudam o **gatilho**, não o texto.

| # | Achado | Correção candidata |
|---|---|---|
| 1 | Não consulta as regras antes de **gerar** (A5, A6) — mas consulta ao **revisar** (A7) | fazer o passo de revisão acontecer antes de entregar: instrução de auto-verificação contra a instruction antes de concluir qualquer geração |
| 2 | Não resiste a pedido que viola (A5, A6) | linguagem imperativa de recusa nas regras estruturais; tornar a Regra 4 (Zero Teimosia) explícita sobre pedido do **usuário** que viola governança |
| 3 | Cobertura não medida fora do fluxo SDD (A2, A4) | transformar em **passo executável** ("rode X, leia Y, reporte Z") — funcionou como tarefa da Task List, falha como regra abstrata |
| 4 | PII esquecido ao gerar (A1) | mesma raiz do #1 — a regra existe e é clara, só não é consultada na geração |
| 5 | Swagger ausente | passar `personaSkillTagIfAvailable` nos `implementSession1/2` (`extension.ts` ~L280/L288) |
| 6 | Declaração de conformidade falsa (A1, A4, A5) | proibir explicitamente afirmar conformidade sem verificação — contraste: no A7 ele declarou o problema restante antes do status, que é o comportamento correto |
| **7** | 🔴 **`readWorkspaceContext` nunca alcança `.java` (D3)** | `prompt-context.ts:146` — trocar `depth > 6` por `depth > PROJECT_MAP_MAX_DEPTH`. **Prioridade máxima:** faz o `qa-coverage` reprovar toda entrega em qualquer projeto Java de pacote padrão |
| 8 | `qa-test-cases` inventa nomes de classe (D2) | avaliar incluir `qa-test-cases` em `PHASES_NEEDING_PROJECT_MAP` (`prompt-context.ts:13`) |

### Achado técnico herdado do Implement (encontrado pelo A7)

`BoletoCobrancaMapper` fica em `adapter/input/boleto/api/dto/mapper/` e é usado no
`adapter/output/boleto/database/` — adapter de saída dependendo de adapter de entrada. Veio da
geração da manhã e passou despercebido no Plan, na Task List e na revisão humana.
Correção sugerida pelo próprio A7: criar `BoletoCobrancaPersistenceMapper` no pacote de output.

### Estado do projeto de teste ao fim da rodada

```
Kit restaurado (git checkout -- src/)              OK — 5 classes do A6 revertidas
25 arquivos do SDD preservados                     OK
BoletoCobrancaPersistence corrigido pelo A7        OK — final + construtor publico
BoletoCobrancaController ainda sujo                repository injetado (A5) + @Autowired (A6)
Cobertura                                          91,6% (abaixo do minimo)
```

Não confundir com o resultado do Implement da manhã, que estava correto (97%, sem violações).

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

---

# 📘 Anotações para o Manual do Usuário

> Coisas descobertas testando que valem virar dica no manual de quem for usar o Hub.
> **Não são bugs** — são comportamentos que o usuário precisa conhecer.

## 1. História ambígua vira decisão da IA, não pergunta

**O que aconteceu:** a história ESCRI_19223 diz *"o sistema tenha sido acionado para
ingestão"* — sem dizer por qual canal (REST? Kafka? batch?).

O Specify listou isso como **defeito da história**:
```
Defeitos identificados:
- Faltava explicitar gatilho operacional (Kafka)
```
e então **preencheu sozinho**, reescrevendo os critérios de aceite como evento Kafka:
```gherkin
Dado que chegou evento Kafka válido com operacaoTipo "ALTERACAO"
```

A partir daí virou fato: o Plan propôs `KafkaConsumerConfig`, o Tasks colocou dependência
no `pom.xml` e configuração de tópico/DLQ no `application.yml` — **num projeto que não tem
Kafka** (0 menções no `pom.xml`).

**Mesma história, no outro modelo, deu o oposto:**
> *"Kafka consumer: não obrigatório pela história; só incluir se ingestão for assíncrona já
> definida em requisito técnico externo"*

**Dica para o manual:** se a história não diz o canal de entrada, o meio de persistência ou a
integração, **escreva no `technical_spec.md` antes de rodar o Specify**. Deixar em branco
funciona muito bem para o Hub descobrir a *estrutura* do projeto (pacotes, classes existentes),
mas não para decidir *arquitetura nova*. Uma linha basta:
```
RESPOSTA:
A ingestão é síncrona via REST. Não usar mensageria.
```

**Como perceber que aconteceu:** leia a seção "Defeitos Identificados" do `user_story.md`
depois do Specify. Se algum "defeito" for na verdade uma decisão técnica que a IA tomou,
corrija ali antes de seguir para o Plan — senão ela se propaga por todas as fases seguintes.

## 2. O modelo de IA muda o resultado mais do que se espera

Mesma história, mesmo Hub, dois modelos:

| | Nota INVEST | Linhas geradas | Canal de entrada |
|---|---|---|---|
| Sonnet 4.5 | 45% — REPROVADA | 294 | pediu confirmação |
| GPT-5.3-Codex | (mais permissivo) | 96 | decidiu: Kafka |

**Dica para o manual:** o rigor da análise INVEST e o volume de saída variam bastante por
modelo. Se a nota vier muito baixa e os defeitos parecerem exagerados, não é a história que
está ruim — pode ser calibragem do modelo.

## 3. `foursys.modelOverride` — quando mexer

O Hub escolhe o modelo por fase (Haiku para fases leves, etc.). Se nenhum dos preferidos
existir no Copilot da máquina, ele cai em "qualquer modelo disponível" — que pode não ser o
ideal para texto.

**Sintoma:** erro `Response contained no choices` no meio de uma fase.

**Como ajustar:** `Ctrl+,` → `foursys.modelOverride` → nome da família (ex.: `gpt-5.3-codex`).
Deixar vazio volta ao automático.

**Observação técnica:** o retry do Hub só cobre erro de *rate limit*. `no choices` não dispara
fallback para o próximo modelo — a fase falha e é preciso rodar de novo. Nos testes de
13/08/2026 isso aconteceu 3 vezes e sempre passou na segunda tentativa, sem mudar nada.

## 4. O seletor de modelo do chat NÃO controla as fases

O dropdown do Copilot Chat (onde se escolhe "Claude Sonnet 4.5") controla **só a conversa do
chat**. As fases do Hub (Constitution, Specify, Plan, Tasks) chamam a API `vscode.lm`
diretamente e escolhem o modelo por conta própria.

**Dica para o manual:** para mudar o modelo das fases, use `foursys.modelOverride` nas
Settings — não o seletor do chat.

---

# ✅ Correção 9 — Suposições marcadas no Specify (13/08, 21h30)

## O problema

O playbook do Specify mandava, numa linha só:
> *"Identifique falhas semânticas e **reescreva a história corrigindo** os problemas de clareza"*

Tratava dois tipos de defeito como um. A IA obedeceu: identificou que a história não dizia o
canal de entrada, chamou de defeito (*"Faltava explicitar gatilho operacional (Kafka)"*) e
**resolveu sozinha**.

Propagação medida:
```
Specify   "faltava explicitar gatilho (Kafka)"        <- ainda parece diagnostico
user_story "Dado que chegou evento Kafka valido..."   <- virou criterio de aceite
Plan      "KafkaConsumerConfig para consumer e DLQ"   <- virou arquitetura
Tasks     pom.xml + application.yml + config          <- virou impacto sistemico
Implement 21 classes + spring-kafka no pom do Kit     <- virou codigo
Resultado BUILD FAILURE (spring-kafka ausente no .m2)
```

**Um projeto que compilava parou de compilar por causa de uma suposição que ninguém confirmou.**

## A correção

`catalog/sdd/generic/foursys-specify.md` — de 36 para 70 linhas, dois acréscimos:

1. **Separar defeito de redação de decisão ausente.** Redação corrige direto; decisão ausente
   propõe *marcando*. Com a regra: escolher a opção coerente com o **MAPA REAL DO PROJETO**, e
   nunca propor tecnologia ausente do projeto sem a história mencionar.
2. **Seção 6 obrigatória na saída** — tabela de suposições com lacuna, escolha, justificativa e
   impacto se errada. Mais marcação `[SUPOSIÇÃO Sn]` nos critérios BDD que dela nasceram.

## O resultado

| Critério | Antes | Depois |
|---|:---:|:---:|
| Seção de suposições | ❌ | ✅ linha 114 |
| Canal de entrada tratado como suposição | ❌ virou requisito | ✅ **S1** |
| Escolha coerente com o projeto | ❌ Kafka (projeto não tem) | ✅ **REST** |
| BDD rastreável à suposição | ❌ | ✅ `[SUPOSIÇÃO S1]` nas linhas 40 e 46 |

**A S1, com a justificativa citando o projeto real:**
```
| S1 | Canal de entrada não especificado | REST síncrono via Controller
   | Projeto atual expõe entradas por adapter/input/.../api
   | Muda adapter de entrada e estratégia de teste |
```

### Encontrou 4 lacunas que ninguém tinha previsto

| # | Lacuna | Por que importa |
|---|---|---|
| S2 | "data atual" sem timezone/formato | divergência de horário no Delta e no painel Databricks |
| S3 | reprocessamento não definido | reenvio duplicaria a atualização |
| S4 | campos do boleto não detalhados | pode exigir remodelagem de entidade |
| S5 | boleto inexistente | contrato de erro da API — cita `NaoEncontradoException` porque *"já existe no domínio"* |

A **S2** é a mais valiosa: a história diz *"data atual do sistema"* e nenhuma das 3 rodadas
anteriores — nem a revisão humana — questionou de qual fuso. Num sistema que alimenta
Databricks, é bug de produção esperando acontecer.

## Efeito no fluxo

Plan, Tasks e Implement leem este documento e agora **veem** que REST é hipótese, não pedido.
A fronteira entre "o PO pediu" e "a IA supôs" ficou explícita — o problema diagnosticado.

## Observação de método

Na primeira tentativa o `.vsix` não tinha sido instalado (extensão de 20:31, playbook com 36
linhas). O teste rodou contra a versão antiga e a seção não apareceu. **Verificar o playbook
dentro de `~/.vscode/extensions/` antes de concluir que uma correção falhou** — o VS Code nem
sempre substitui a extensão quando a versão é a mesma.

Nessa mesma execução (sem a correção), ele escolheu REST espontaneamente — 1 menção a Kafka
contra 7 da rodada anterior. Reforça que a resolução da ambiguidade variava por sorte; a regra
tirou isso do acaso.

---

# 🔴 Correção 10 — a persona era invocada com o prefixo errado (13/08, 22h)

## Um bug escondia o outro

**Ontem** o diagnóstico foi: *"a persona nunca chega ao Implement porque os comandos
`implementSession1/2` não passam a tag"*. Correto — e corrigido (correção 5).

**Hoje**, com a tag sendo enviada pela primeira vez, o Controller gerado saiu de novo sem
Swagger. Investigando: a tag chega, a persona existe com o nome exato, e mesmo assim não é
carregada.

O usuário testou no chat e mostrou a sintaxe real do Copilot:

```
@nome  -> chat participant          (ex: @foursys_sdd_po)
/nome  -> skill ou agente do sync   (ex: /foursys-constitution-android)
#nome  -> referencia arquivo (#file:) — NAO invoca nada
```

E o Hub mandava **`#agente-spring_boot-foursys`**.

```
Hub mandava:     #agente-spring_boot-foursys
Copilot conhece: /agente-spring_boot-foursys
```

Os nomes batiam perfeitamente. **Só o prefixo estava errado — um caractere.**

Ninguém tinha notado porque, enquanto a tag não era enviada, o `#` errado nunca chegou a ser
exercitado. A correção 5 foi necessária mas não suficiente: ela fez o bug antigo aparecer.

## A correção

`src/engine/stack-registry.ts` — 7 tags, `#` → `/`, mais comentário explicando por que o
prefixo importa e como o nome se liga ao arquivo em `~/.copilot/agents/`.

Validado contra o que o Copilot expõe de fato:
```
OK  /agente-android-foursys      OK  /agente-cobol-foursys
OK  /agente-angular-foursys      OK  /agente-ios-foursys
OK  /agente-spring_boot-foursys
```

## Pendente de teste (amanhã)

⚠️ **Não sabemos se `/agente-x` funciona dentro de um prompt** enviado por
`workbench.action.chat.open`, ou só quando o dev digita no chat. O `/` costuma ser interpretado
como comando de barra no **início** da mensagem, e o Hub o coloca no fim de uma frase longa:

```
"Leia os arquivos ... Execute APENAS as tarefas da Sessão 2 ... /agente-spring_boot-foursys."
```

Se não funcionar assim, a alternativa é mover a tag para o começo do prompt.

**Como testar:** rodar `/foursys.implementSession2` e verificar se o Controller sai com
`@Tag`/`@Operation`, ou com a interface `<Nome>Swagger.java` no padrão do `ContaCorrenteSwagger`.
