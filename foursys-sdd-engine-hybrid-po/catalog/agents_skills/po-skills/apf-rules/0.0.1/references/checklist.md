# Checklist de Revisão APF — Maximização de Pontos de Função

Use este checklist ao revisar uma User Story antes de finalizar. Cada item verificado
pode representar pontos de função que poderiam ser perdidos se não documentados.

---

## ✅ Funções de Dados

- [ ] **Todas as entidades/coleções mantidas** pela aplicação estão identificadas como ALI?
- [ ] **Cada entidade lógica distinta** está separada? (Cliente ≠ Endereço ≠ Contrato = 3 ALIs)
- [ ] **Todos os sistemas externos consultados** estão identificados como AIE?
- [ ] **Tabelas de domínio/referência** de sistemas externos estão como AIE?
- [ ] Se há **nova coleção ou novos campos** em coleção existente, está documentado?

---

## ✅ Funções Transacionais — Decomposição CRUD

- [ ] **Inclusão** de cada entidade está como EE separada?
- [ ] **Alteração** de cada entidade está como EE separada?
- [ ] **Exclusão** (física ou lógica) está como EE separada?
- [ ] **Consulta/detalhe** de cada entidade está como CE separada?
- [ ] **Listagem/pesquisa** com filtros está como CE separada?

---

## ✅ Funções Transacionais — Componentes de Interface

- [ ] Cada **combo-box** que busca dados de outra entidade está como CE?
- [ ] Cada **autocomplete** ou **campo de busca** está como CE?
- [ ] Cada **lista de seleção** com dados dinâmicos está como CE?
- [ ] **Paginação com filtros** diferentes gera CEs independentes?

---

## ✅ Funções Transacionais — Saídas e Relatórios

- [ ] Cada **relatório** com dados calculados/derivados está como SE?
- [ ] Cada **formato de exportação** (CSV, PDF, Excel) está como SE separada?
- [ ] Cada **dashboard/gráfico** com dados calculados está como SE?
- [ ] **Envio de dados** para outros sistemas está como SE?
- [ ] **Notificações** (email, push, SMS) com dados do sistema estão como SE?

---

## ✅ Integrações

- [ ] Cada sistema externo **consultado** está como AIE + CE correspondente?
- [ ] Cada sistema externo **alimentado** está como AIE + SE correspondente?
- [ ] **APIs externas** consumidas geram CE (consulta) ou SE (envio)?
- [ ] Cada **microsserviço** externo integrado está documentado?

---

## ✅ Seção APOIO APF

- [ ] Cada funcionalidade tem sua própria **linha com ➡️**?
- [ ] Os **verbos de ação** são claros (inclusão, alteração, exclusão, consulta, listagem, geração, envio)?
- [ ] As linhas de **browser** estão incluídas (Chrome, Edge) para aplicações web?
- [ ] Se multi-plataforma, cada **plataforma adicional** está listada?
- [ ] As funcionalidades estão **suficientemente granulares**? (não agrupadas genericamente)

---

## ✅ Projetos de Melhoria — Fatores de Impacto

- [ ] Cada função **nova** está claramente identificada como "inclusão"?
- [ ] Cada função **alterada** descreve o que muda?
- [ ] Cada função **excluída** está documentada como "exclusão"?
- [ ] Há **função de conversão** (migração de dados) necessária?
- [ ] As **alterações cosméticas** estão separadas das alterações funcionais?
- [ ] As **alterações por RNF** estão separadas das alterações por requisito funcional?

---

## ✅ Cenários Especiais

- [ ] Se há **processos batch complexos**, os DERs e ALRs estão quantificados para cálculo SNAP?
- [ ] Se há **BPM/workflow**, as tarefas de negócio estão como PEs independentes?
- [ ] Se há **múltiplos browsers**, cada browser adicional está documentado?
- [ ] Se há **múltiplas plataformas**, cada plataforma adicional está documentada?

---

## ✅ Critérios de Aceite e Regras de Negócio

- [ ] Cada **critério de aceite** corresponde a pelo menos uma funcionalidade contável?
- [ ] As **regras de negócio** estão explícitas o suficiente para justificar as funcionalidades?
- [ ] Há critérios para **cenários de erro/validação** que geram funções adicionais?
- [ ] As regras referenciam **combo-boxes e listas de seleção** quando aplicável?

---

## ✅ Separação Negócio × Técnico

- [ ] **Regras de Negócio** estão em linguagem pura de negócio (sem nomes de classes, filas, endpoints)?
- [ ] **Regras Técnicas** contêm detalhamento completo (DTOs, mappers, configs, error handling)?
- [ ] Cada **funcionalidade do APOIO APF** tem pelo menos uma RN correspondente?
- [ ] Cada **funcionalidade do APOIO APF** tem pelo menos um CA correspondente?
- [ ] A **IDENTIFICAÇÃO** menciona naturalmente os processos que mapeiam para funcionalidades?
- [ ] ALIs estão implícitos nas RNs ("persistir em registro de controle dedicado")?
- [ ] AIEs estão implícitos nas RNs ("consumindo a API X como fonte externa de dados")?

---

## ✅ Persona e Identificação

- [ ] A persona **EU COMO** é uma pessoa ou papel real (não "Como sistema X")?
- [ ] US de negócio usa persona de negócio (Analista, Gestor, Operador)?
- [ ] US puramente técnica (infraestrutura, config) usa "Tech Lead"?
- [ ] O **QUERO QUE** menciona os processos-chave da US?

---

## ✅ Regras Técnicas (Backend/Serviços)

- [ ] **UseCase** com passos numerados e `@Bean` config completo?
- [ ] **DTOs** como `record` com tipos, tamanhos e obrigatoriedade?
- [ ] **Feign Client** com `@FeignClient` annotation completa?
- [ ] **Mappers** com tabela campo-a-campo (Origem → Destino → Observação)?
- [ ] **Circuit Breaker** com YAML completo (recordExceptions, ignoreExceptions)?
- [ ] **Error Handling** com tabela (Exceção → Ação → Motivo)?
- [ ] **application.yml** com env vars e valores default?
- [ ] **pom.xml** dependencies listadas?
- [ ] **Observabilidade** com tabela de métricas (Nome → Tipo → Tags)?
- [ ] **Testes** com cenários de cobertura ≥ 95%?

---

## ✅ Uma US por Objetivo

- [ ] Cada US tem um **único objetivo/ESCRI**?
- [ ] USs similares (opt-in/opt-out) estão **separadas**, cada uma com seu próprio escopo?
- [ ] Diferenças técnicas entre USs similares estão **explicitadas** (não "mesma coisa que X")?

---

## ⚠️ Armadilhas Comuns

### Armadilhas de SUBCONTAGEM (perda de pontos):

| Armadilha | Consequência | Como Evitar |
|-----------|--------------|-------------|
| Agrupar CRUD como "gerenciar X" | Conta 1 em vez de 4-5 funções | Decompor cada operação |
| Omitir combo-boxes dinâmicos | Perde 3,95 PF por combo-box | Listar cada seletor que busca dados de outra entidade |
| Não documentar integrações | Perde AIE + CE/SE | Detalhar cada sistema integrado |
| Misturar alteração funcional com cosmética | Usa FI errado | Separar em funcionalidades distintas |
| Esquecer browsers de teste | Perde réplicas de funções | Sempre incluir Chrome + Edge |
| Não separar relatórios por formato | Conta 1 em vez de múltiplas SEs | Cada formato = 1 SE |
| Descrever funcionalidade vagamente | Medidor não consegue contar | Usar verbos de ação + objeto |

### Armadilhas de SUPERCONTAGEM (rejeição pelo medidor):

| Armadilha | Por que é rejeitada | Como Evitar |
|-----------|---------------------|-------------|
| Validação de campo como EE separada | Validação é sub-passo do PE de entrada | Incluir validação no EE que recebe os dados |
| Checkbox/radio estático como CE | Valores fixos = Dados de Código, não PE | Só contar CE se busca dados de outra entidade |
| Config/credencial como ALI | Infraestrutura ≠ Requisito Funcional | Só contar ALI para dados de negócio |
| Log/auditoria como ALI | Requisito técnico/NFR | Não contar como função de dados |
| Geração + envio como 2 SEs | Mesmo contexto = 1 PE | Contar como 1 SE (geração e envio) |
| Verificação de conectividade como CE | NFR (disponibilidade) | Não contar como função transacional |
| Sub-passos de processamento como PEs | PE deve deixar negócio em estado consistente | Agrupar sub-passos no PE principal |
