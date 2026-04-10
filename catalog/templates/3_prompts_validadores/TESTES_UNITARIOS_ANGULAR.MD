---
applyTo: '**/*.ts'
name: Geração de Testes Unitários Angular
description: Prompt para gerar testes unitários e de integração de altíssima qualidade em Angular v21+ utilizando Vitest/Jasmine e Signals.
metadata:
  version: "0.0.1"
---

# Template: Geração de Testes Unitários (Angular v21+)

**Instruções de Uso:**
Selecione o arquivo inteiro do seu Componente, Serviço ou Diretiva (`.ts`) na sua IDE e execute este comando no Chat da inteligência artificial. Ele vai cuspir o `.spec.ts` blindado para você.

---

### 📋 Comando Base do Sistema

```text
Atue como um Engenheiro de Qualidade Frontend Sênior e Especialista Supremo em Angular v21+, dominando Vitest, Jasmine e a nova API de Signals do Angular.

Sua missão é criar o arquivo `.spec.ts` com uma suíte de testes ponta a ponta (unitários e integração local) para a classe Angular focada no meu contexto atual, visando sempre uma meta de cobertura maior que 95%.

### 🚫 O QUE NÃO FAZER (Anti-patterns)
- **NÃO TESTE** lógicas estáticas óbvias do framework, teste regras de negócio.
- **NÃO** instancie dependências complexas manualmente; use o `TestBed` ou Mocks (`vi.fn()` ou `jasmine.createSpyObj()`).
- Testes que quebram pela simples refatoração de estrutura interna do HTML sem perda de funcionalidade devem ser evitados.

### ✅ DIRETRIZES FUNDAMENTAIS PARA ANGULAR
O código deve ser limpo e aderir às seguintes diretivas de última geração:

1. **Signals Native:** Se o componente usa `signal`, `computed` ou `input()`, teste o fluxo reativo da forma correta (injetando novos valores usando `.set()`, `.update()` e validando as reações).
2. **OnPush Change Detection:** Se o componente é `OnPush`, garanta o uso explícito de `fixture.detectChanges()` para refletir atualizações no DOM.
3. **Serviços & HTTP:** Para serviços com injeção de dependências, utilize o `provideHttpClientTesting()` e mocke as requisições com `HttpTestingController`. Controle vazamento de chamadas.
4. **Mocking Assertivo:** Para Vitest favoreça `vi.fn()` / `vi.spyOn()`. Para Jasmine, favoreça `jasmine.createSpy()`. Extraia injeções com o `TestBed.inject()`.

### 📐 ESTRUTURA E QUALIDADE BDD
- Organize os testes logicamente dividindo-os com blocos `describe()` aninhados (ex: `describe('Initialization', ...)`, `describe('Signal Reactivity', ...)`).
- Todo teste `it('should...')` deve ser determinístico e auto-explicativo.

Com base nisso, gere agora o código completo do meu arquivo `.spec.ts`, contendo a configuração inicial perfeita (`TestBed`, `ComponentFixture`), `imports` estritos, e varredura completa dos cenários da minha classe, desde os Caminhos Felizes (Success Scenarios) até Edge Cases maliciosos (Undefined/Null).
```
