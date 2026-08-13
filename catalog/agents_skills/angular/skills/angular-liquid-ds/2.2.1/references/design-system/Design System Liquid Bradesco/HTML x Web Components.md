## Comparação: HTML Components vs Web Components

Importante: Este documento apresenta duas abordagens igualmente válidas para utilização do Design System Liquid. A escolha entre HTML Components e Web Components deve ser baseada nas necessidades da sua jornada, requisitos do projeto e contexto técnico do seu time.

# Visão geral das abordagens

O Design System Liquid oferece dois modelos complementares de implementação, cada um com seus pontos fortes e casos de uso ideais:

HTML Components: Abordagem tradicional com HTML explícito e services JavaScript para máximo controle
Web Components: Elementos customizados que encapsulam funcionalidade e oferecem API declarativa

Ambas as abordagens são totalmente suportadas, mantidas e seguem os mesmos padrões de qualidade do DSYS Liquid.

## Características de cada abordagem
## HTML Components: Controle e flexibilidade

# Pontos fortes:

Customização granular: Controle total sobre a estrutura HTML e comportamento
Integração com código legado: Compatibilidade com sistemas existentes sem refatoração
Debugging mais direto: Estrutura HTML visível e manipulável diretamente no DOM
Flexibilidade de composição: Liberdade para combinar elementos e criar variações específicas
Intervenção precisa: Acesso direto a métodos e propriedades do service para casos complexos

# Ideal para:

## Projetos com requisitos de customização avançada
Necessidade de controle fino sobre o comportamento
Integrações complexas com bibliotecas externas
## Web Components: Simplicidade e encapsulamento

# Pontos fortes:

API declarativa: Configuração via atributos HTML, sem necessidade de JavaScript para casos básicos
Encapsulamento automático: Lógica interna protegida, expondo apenas interface pública
Reatividade nativa: Mudanças de atributos refletem automaticamente na UI
Lifecycle gerenciado: Inicialização e cleanup automáticos
Compatibilidade com frameworks: Funciona nativamente em Angular, React, Vue, etc.
Developer Experience: Autocomplete em IDEs, inspeção clara no DevTools

# Ideal para:

# Novos projetos e features
Prototipagem rápida
Consumo por times com diferentes níveis de experiência
Integração com frameworks modernos
Casos de uso padrão do design system
Comparação prática: Calendar
Implementação com HTML Component
```
<!-- HTML + JavaScript -->
<div
id="calendar-123"
class="brad-calendar brad-calendar--day"
>
<div class="brad-calendar__ui-select">
  <button class="brad-btn brad-btn-text brad-calendar__btn-year">
    <span>2024</span>
    <em class="brad-btn--icons-right i icon-ui-chevron-down"></em>
  </button>
  <button class="brad-btn brad-btn-text brad-calendar__btn-month">
    <span>Janeiro</span>
    <em class="brad-btn--icons-right i icon-ui-chevron-down"></em>
  </button>
</div>

<hr class="brad-calendar__dividing-line brad-shadow-10" />

<div class="brad-calendar__content">
  <div class="brad-calendar__weekdays brad-calendar__row" aria-hidden="true">
    <div class="brad-calendar__cell">D</div>
    <div class="brad-calendar__cell">S</div>
    <div class="brad-calendar__cell">T</div>
    <div class="brad-calendar__cell">Q</div>
    <div class="brad-calendar__cell">Q</div>
    <div class="brad-calendar__cell">S</div>
    <div class="brad-calendar__cell">S</div>
  </div>

  <div class="brad-calendar__sheets">
    <div class="brad-calendar__sheet" data-month="0" data-year="2024">
      <div class="brad-calendar__row">
        <button
          class="brad-calendar__cell brad-calendar__cell--day"
          data-day="1"
          aria-label="1 de Janeiro de 2024"
        >
          <span>1</span>
        </button>
        <button
          class="brad-calendar__cell brad-calendar__cell--day"
          data-day="2"
          aria-label="2 de Janeiro de 2024"
        >
          <span>2</span>
        </button>
        <!-- ...outros dias -->
      </div>
    </div>
  </div>

</div>

<div class="brad-calendar__ui-nav">
  <button
    class="brad-btn brad-btn-icon brad-btn-icon--on-color brad-calendar__btn-prev"
    aria-label="Mês anterior"
  >
    <em class="btn-icon i icon-ui-chevron-left"></em>
  </button>
  <button
    class="brad-btn brad-btn-icon brad-btn-icon--on-color brad-calendar__btn-next"
    aria-label="Próximo mês"
  >
    <em class="btn-icon i icon-ui-chevron-right"></em>
  </button>
</div>
</div>

<script>
const calendar = BradCalendarService.getInstance({
  targetSelector: '#calendar-123',
  type: 'day',
  date: new Date(),
  minDate: new Date('2024-01-01'),
  maxDate: new Date('2024-12-31')
});
calendar.buildCalendar();
calendar.goToMonth({ month: 5, year: 2024 });
</script>
```
Implementação com Web Component
```
<!-- HTML declarativo -->
<brad-calendar
  brad-type="day"
  brad-min-date="2024-01-01"
  brad-max-date="2024-12-31"
></brad-calendar>

<script>
  const calendar = document.querySelector('brad-calendar');
  calendar.setAttribute('brad-type', 'month');
  // ou via property setter
  // calendar.bradType = 'year';
</script>
```

Observação: Ambas as implementações produzem o mesmo resultado visual e funcional. A diferença está na abordagem: HTML Component oferece mais controle sobre a estrutura, enquanto Web Component simplifica o uso com API declarativa.

# Inicialização e Lifecycle
## HTML Component

# 1. HTML deve existir no DOM

## 2. Instanciação manual obrigatória

```
const service = BradCalendarService.getInstance({
  targetSelector: '#calendar',
  type: 'day',
  date: new Date()
});
```

# 3. Construir componente

```
service.buildCalendar();
```

## 4. Cleanup manual (se necessário)

```
service.destroy();
```

## Lifecycle: Gerenciado manualmente pelo desenvolvedor

# Web Component

# 1. Adicione ao DOM

```
<brad-calendar brad-type="day"></brad-calendar>
```

# 2. Lifecycle automático

## connectedCallback() → Auto-inicialização
attributeChangedCallback() → Reatividade
## disconnectedCallback() → Cleanup automático

## 3. Acesso via DOM (se necessário)

```
const calendar = document.querySelector('brad-calendar');
console.log(calendar.bradType); // 'day'
```

Lifecycle: Gerenciado automaticamente pela Web Components API

## Interoperabilidade com JavaScript
## HTML Component

# 1. Instanciar service

```
const calendar = BradCalendarService.getInstance({
  targetSelector: '#calendar',
  type: 'day',
  date: new Date()
});
```

# 2. Construir componente

```
calendar.buildCalendar();
```

## 3. Atualizar propriedades via métodos específicos

```
calendar.goToMonth({ month: 5, year: 2024 });
```
## Web Component

# 1. Selecionar elemento

```
const calendar = document.querySelector('brad-calendar');
```

## 2. Atualizar via property setter

```
calendar.bradType = 'month';
```

# 3. Atualizar via atributo HTML

```
calendar.setAttribute('brad-type', 'month');
```
## Quando usar cada abordagem?

A decisão entre HTML Components e Web Components deve considerar múltiplos fatores:

# Use HTML Components quando:
Você precisa customizar profundamente a estrutura HTML do componente
O projeto já utiliza HTML Components e você busca consistência
É necessário controle granular sobre eventos e métodos internos
Está migrando um sistema legado com estrutura HTML específica
A complexidade da implementação justifica o controle adicional
Use Web Components quando:
Você busca implementação rápida com menos código boilerplate
O projeto é novo ou está em fase de prototipagem
A integração com frameworks modernos é um requisito
A equipe tem diferentes níveis de experiência técnica
## Os casos de uso se encaixam nos padrões do design system

Princípio fundamental: Não existe escolha errada entre HTML Components e Web Components. Ambas são soluções robustas, mantidas e documentadas. A escolha certa é aquela que melhor atende às necessidades da sua jornada de desenvolvimento e aos requisitos técnicos do seu projeto.

# Migração e coexistência

## Ambas abordagens podem coexistir no mesmo projeto:

Não é necessário escolher uma única abordagem para todo o projeto
Você pode migrar gradualmente de HTML Components para Web Components (ou vice-versa)
A escolha pode variar por componente, baseada nas necessidades específicas
O DSYS Liquid garante consistência visual independentemente da abordagem escolhida
Recursos adicionais
## Documentação específica de componentes

Cada componente possui documentação detalhada com exemplos de uso para ambas as abordagens. Para acessar a documentação:

# Navegação no Storybook:

```
Components/
└── [Nome do Componente]/
  ├── HTML/                         → Documentação HTML Component
  │      └── Docs
  └── Web Component/     → Documentação Web Component
           └── Docs
```

# Exemplo de navegação:

## HTML Component: Components → Calendar → HTML → Docs
## Web Component: Components → Calendar → Web Component → Docs

Todos os componentes seguem essa estrutura de organização, facilitando a localização da documentação específica para cada abordagem.