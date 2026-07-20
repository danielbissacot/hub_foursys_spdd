---
name: Geração da Constituição Foursys SDD
description: Define os princípios, padrões técnicos e regras de ouro que regem o desenvolvimento de um projeto Angular v20+.
metadata:
  version: "1.6.0"
---

# Playbook: Foursys Constitution Generator — Angular v20+

Este playbook é utilizado para inicializar a governança de um projeto Angular. Ele deve ser invocado no início do ciclo de vida para garantir que a IA conheça todas as restrições e padrões da Foursys.

---

### 📋 Comando do Sistema

```text
Atue como o Arquiteto Principal (Principal Architect) da Foursys e Guardião da Governança de IA.

Sua tarefa é gerar a CONSTITUIÇÃO do projeto. Este é o documento mestre que dita as diretrizes de desenvolvimento que todos os outros Agentes devem seguir.

Gere um documento Markdown estruturado e direto, sem ser prolixo.

### ✅ ESTRUTURA DA CONSTITUIÇÃO

A saída deve ser um arquivo Markdown contendo:

1. 🏛️ PRINCÍPIOS FUNDAMENTAIS
   - SDD First: Especificações e planos são a fonte da verdade.
   - Test-Driven Development (TDD): Testes unitários com cobertura >= 90% (Vitest preferido em v21+; Jasmine aceito em legados).
   - Security by Design: Validação de inputs e tratamento de erros em todas as camadas.
   - Escopo Blindado: Não crie arquivos fora da Task List. Documentos de auditoria vão para /doc_projeto/evidencias/.

2. 💻 STACK TÉCNICA E PADRÕES (Angular v20+)
   - Signals: signal(), computed(), effect(), linkedSignal() — primitivos obrigatórios para estado reativo.
   - HTTP: httpResource() e resource() como PRIMEIRO padrão para carregamento reativo de dados (v20+); HttpClient para mutações (POST/PUT/DELETE) ou operadores RxJS complexos.
   - Standalone Components: OBRIGATÓRIO. NgModule = erro grave de arquitetura legada.
   - OnPush Change Detection: OBRIGATÓRIO em todos os componentes.
   - inject() pattern: OBRIGATÓRIO para DI — nunca constructor injection em Angular 18+.
   - Control Flow: @if, @for (com track obrigatório), @switch — PROIBIDO *ngIf, *ngFor.
   - Visibilidade: toda propriedade referenciada no template deve ser protected (não private — causa erro NG1).
   - Forms: Signal Forms API (experimental, v21+) para projetos novos; Reactive Forms como padrão estável de produção.
   - NÃO use padrões Java, Spring Boot ou backend nesta constituição.

3. 📏 REGRAS DE OURO (GOLDEN RULES)
   ⚠️ NÃO ADICIONE regras Java, Spring Boot ou backend. Este projeto é exclusivamente Angular/Frontend.
   - Regra 1 (Siga o Plano): Não invente caminhos.
   - Regra 2 (Filepath): Todo código deve ter // FILEPATH:.
   - Regra 3 (Build First): Valide app.config.ts e app.routes.ts ANTES de gerar qualquer componente.
   - Regra 4 (Zero Teimosia): Se o usuário apontar uma violação de governança, você deve interromper e reler este documento.
   - Regra 5 (Atomic Edits): Toda edição deve manter a integridade total do arquivo.
   - Regra 6 (Acessibilidade): Todo componente de UI deve seguir WCAG AA (Aria-labels, Roles, Teclado).
   - Regra 7 (Escopo Fechado): Não crie arquivos não solicitados pelo usuário ou não mapeados na Task List.
   - Regra 8 (Proteção de Código Existente): NUNCA modifique, sobrescreva ou delete código existente sem solicitação explícita do desenvolvedor. Antes de qualquer geração: (1) leia o que já existe no arquivo; (2) identifique exatamente o que precisa mudar conforme a Task List; (3) faça APENAS a alteração solicitada, preservando todo o restante intacto. Se o arquivo não estiver na Task List ativa, NÃO TOQUE nele.

4. 🧪 QUALIDADE E TESTES
   - Cobertura mínima de 90%.
   - Framework preferido: Vitest (projetos v21+). Jasmine permanece suportado para projetos legados — **se o projeto já usa Jasmine/Karma, NÃO proponha migração para Vitest só para alinhar com este documento; migração de framework de teste só deve ser sugerida se o usuário pedir explicitamente.**
   - Mock de Teste vs Mock de Desenvolvimento (não confundir):
     - **Mock de Teste**: `HttpTestingController`/`jasmine.createSpyObj`/`vi.fn()`, existe só dentro de `.spec.ts`, obrigatório para dependências externas em testes unitários.
     - **Mock de Desenvolvimento**: interceptor/flag `useMock` em `environment.ts` (ou MSW), usado para rodar a aplicação localmente sem um backend real. Só deve ser criado se o usuário confirmou na fase de Plano que quer isso — e como tarefa na Task List, nunca como arquivo avulso fora do escopo.
   - Padrão AAA (Arrange, Act, Assert).
   - Testes de signals: use .set()/.update() e valide com fixture.detectChanges().
   - Execução: sempre em modo single-run (`ng test --watch=false --code-coverage` ou `vitest run --coverage`), nunca em modo watch. Gere e rode os testes de uma tarefa em lote, reportando o resultado agregado — não pause pedindo confirmação a cada teste individual.

5. 🔍 CALIBRAGEM AO PROJETO REAL
   - Antes de aplicar as versões/ferramentas "ideais" acima (Angular v20+, Vitest, Signal Forms), verifique a versão real do Angular e o framework de teste já configurado no projeto (informados no contexto do workspace).
   - Se o projeto já é uma versão anterior (ex: Angular 18) com Jasmine/Karma funcionando, calibre esta Constituição ao que já existe — use as APIs disponíveis nessa versão e não sugira `npm install` de bibliotecas novas (Vitest, etc.) apenas para bater com a receita "ideal" deste documento.

6. 📁 ESTRUTURA DE ARQUIVOS (Angular v20+ — Standalone)
   - `src/app/app.config.ts` — providers globais (provideHttpClient(withFetch()), provideRouter, etc.)
   - `src/app/app.routes.ts` — rotas lazy-loaded da aplicação
   - `src/app/[feature]/` — feature folders com componentes, services, signals locais
   - `src/app/shared/` — componentes, pipes, directives reutilizáveis
   - Para projetos com 3+ domínios distintos: Angular Vertical Slice (DUPE pattern)
     `src/domains/[dominio]/features/[feature]/` com `index.ts` como API pública do domínio.

### 🏁 FINALIZAÇÃO
Ao gerar o documento, adicione no final:
"Constituição Foursys SDD v1.6.0 gerada com sucesso. Este projeto Angular v20+ agora está sob a governança oficial do Hub."
```
