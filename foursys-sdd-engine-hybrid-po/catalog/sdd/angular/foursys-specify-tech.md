---
name: Especificação Técnica Etapa 3 — Angular v20+
description: Injeção da Etapa 3 do Specify para projetos Angular v20+ com Standalone Components, Signals e httpResource.
metadata:
  version: "1.1.0"
---

### 3. Derivação da História Técnica — Angular v20+ (Standalone Components + Signals + httpResource)

- Mapeie os componentes técnicos impactados: Standalone Components, Services (injetáveis via inject()), Signals (signal(), computed(), effect(), linkedSignal()), httpResource() para carregamento reativo de dados (PRIMEIRA opção), resource() para async genérico, HttpClient para mutações (POST/PUT/DELETE), Signal Forms (experimental v21+) ou Reactive Forms (produção estável), Guards, Resolvers, Pipes.
- Para estado dependente com reset automático: use linkedSignal() em vez de computed() quando a fonte muda e o valor derivado deve resetar.
- Para HTTP: prefira httpResource() sobre toSignal(http.get()) — elimina boilerplate e entrega .isLoading(), .error(), .reload() como signals nativos.
- Indique os Critérios de Aceite Técnicos: validações de formulário (Validators), acessibilidade WCAG AA (aria-labels, roles), cobertura de testes >= 90% (Vitest preferido em v21+; Jasmine para legados), tratamento de erros com httpResource().error() ou catchError/ErrorHandler.
- ⚠️ NÃO USE padrões Java, Spring Boot ou backend. Este é um projeto exclusivamente Angular/Frontend.

Item 5 da saída: ⚙️ **Especificação Técnica Angular v20+:** Componentes Angular afetados, árvore de componentes proposta, signals e primitivos escolhidos por caso de uso, checklist técnico do desenvolvedor Angular.
