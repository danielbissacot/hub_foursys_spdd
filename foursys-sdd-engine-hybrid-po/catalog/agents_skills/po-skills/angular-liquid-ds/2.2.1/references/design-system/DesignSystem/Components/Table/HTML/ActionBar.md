# Action Bar

O componente Action Bar deve ser utilizado junto ao componente de tabela. O seu objetivo é apresentar informações e ações que são relevantes para a tabela em questão.

# Exemplos
With Button Text
```
<div
    class="brad-flex brad-flex-wrap brad-flex-justify-content-between brad-flex-align-items-center brad-bg-color-cta brad-p-xl"
  >
    <div class="brad-flex brad-flex-column">
  <p class="brad-font-subtitle-sm brad-text-color-neutral-0 brad-m-xs-r">Título</p>
  <p
      class="brad-font-paragraph-sm brad-text-color-neutral-0 brad-m-xs-r"
    >
      Conteúdo
    </p>
</div>

      <div class="brad-flex brad-flex-wrap brad-flex-align-items-center">
        
        <button
          class="brad-btn brad-btn-text brad-btn-text brad-btn--auto brad-btn-text--on-color"
        >
          <span>Aprovar</span>
        </button>

        <button
          class="brad-btn brad-btn-text brad-btn-text brad-btn--auto brad-btn-text--on-color"
        >
          <span>Reprovar</span>
        </button>

        <button
          class="brad-btn brad-btn-text brad-btn-text brad-btn--auto brad-btn-text--on-color"
        >
          <span>Suspender</span>
        </button>
      </div>
    </div>
  </div>
```
With Icons And Button Text
```
<div
      class="brad-flex brad-flex-wrap brad-flex-justify-content-between brad-flex-align-items-center brad-bg-color-cta brad-p-xl"
    >
      <div class="brad-flex brad-flex-column">
  <p class="brad-font-subtitle-sm brad-text-color-neutral-0 brad-m-xs-r">Título</p>
  <p
      class="brad-font-paragraph-sm brad-text-color-neutral-0 brad-m-xs-r"
    >
      Conteúdo
    </p>
</div>

      <div class="brad-flex brad-flex-wrap brad-flex-align-items-center">
        
      <button
        class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active brad-m-xs-r"
      >
        <em><em class="fab-icon i icon-ui-placeholder"></em></em>
      </button>
        <button
        class="brad-btn brad-btn-text brad-btn-text brad-btn--auto brad-btn-text--on-color"
      >
        <span>Aprovar</span>
      </button>
      </div>
    </div>
```
With Buttons
```
<div
      class="brad-flex brad-flex-wrap brad-flex-justify-content-between brad-flex-align-items-center brad-bg-color-cta brad-p-xl"
    >
      <div class="brad-flex brad-flex-column">
  <p class="brad-font-subtitle-sm brad-text-color-neutral-0 brad-m-xs-r">Título</p>
  <p
      class="brad-font-paragraph-sm brad-text-color-neutral-0 brad-m-xs-r"
    >
      Conteúdo
    </p>
</div>
      <div class="brad-flex brad-flex-row brad-flex-align-items-center">
        
        <button
          class="brad-btn brad-btn-secondary brad-btn-secondary--on-color brad-m-sm-l"
        >Aprovar
        </button>

        <button
          class="brad-btn brad-btn-secondary brad-btn-secondary--on-color brad-m-sm-l"
        >Reprovar
        </button>

        <button
          class="brad-btn brad-btn-secondary brad-btn-secondary--on-color brad-m-sm-l"
        >Suspender
        </button>
      </div>
    </div>
```