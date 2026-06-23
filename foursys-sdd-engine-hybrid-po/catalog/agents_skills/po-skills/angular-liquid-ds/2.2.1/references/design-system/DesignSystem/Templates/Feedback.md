# Feedback

A tela de feedback foi pensada para ser responsível e reforçar o padrão do liquid corporativo, se encaixando em todos os temas.
.

# Uso do HTML
```
<div id="idFeedbackContainer" class="brad-feedback-template">
  <div class="brad-feedback-template__content-container">
    <div class="brad-feedback-template__desktop-limiter">
      <div class="brad-feedback-template__ilustra">
        <img class="brad-illustration__content brad-illustration__content--chave-de-seguranca-ale-validando-ativacao" />
        <p class="brad-feedback-template__error-code-mobile brad-font-subtitle-xxs">XXX</p>
      </div>

      <div class="brad-feedback-template__content">
        <div class="brad-feedback-template__content--text">
          <h1 class="brad-font-title-md brad-m-sm-b">Avaliação enviada</h1>
          <p class="brad-font-paragraph-sm">Agradecemos por dedicar esse tempo para compartilhar sua opinião com a gente.</p>
          <p class="brad-feedback-template__error-code-desktop brad-font-subtitle-xxs brad-m-sm-t">XXX</p>
        </div>

        <div class="brad-feedback-template__button-container brad-fixed">
          <div class="brad-feedback-template__button-container--button">
            <button class="brad-btn brad-btn-primary">Botão primário</button>
            <button class="brad-btn brad-btn-text">Button Text</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
Copy
```
Uso de scripts
Para modelos fullscreen com o botão flutuante fixo no final da página, utilize os scripts abaixo:
```
function toggleButtonElevationClass(buttonContainer, add) {
  const buttonClassList = buttonContainer.classList;

  if (buttonClassList.contains("brad-sticky")) {
    buttonClassList.toggle("brad-sticky__elevation", add);
  } else {
    buttonClassList.toggle("brad-shadow-top-10", add);
    buttonClassList.toggle("brad-bg-color-neutral-0", add);
  }
}

function handlePageContentPadding(bottomElement, containerToApplyPadding) {
  bottomElement = bottomElement.getBoundingClientRect().height;
  containerToApplyPadding.style.paddingBottom = `${bottomElement - 30}px`;
}

function validateIfTextUnderneath(bottomElement, topElement) {
  bottomElement = bottomElement.getBoundingClientRect().bottom;
  topElement = topElement.getBoundingClientRect().top;

  return bottomElement >= topElement;
}

function getFeedbackTemplateElements(idFeedbackContainer) {
  return {
    buttonContainer: document.querySelector(`#${idFeedbackContainer} .brad-feedback-template__button-container`),
    contentContainer: document.querySelector(`#${idFeedbackContainer} .brad-feedback-template__desktop-limiter`),
    textContainerBottomElement: document.querySelector(`#${idFeedbackContainer} .brad-feedback-template__content--text`),
  };
}

if (!window.updateElementsInterface) {
  window.updateElementsInterface = (elementsRef) => {
    toggleButtonElevationClass(elementsRef.buttonContainer, validateIfTextUnderneath(elementsRef.textContainerBottomElement, elementsRef.buttonContainer));
  };
}

function onInitAndResizeFullHeightUpdateInterface(elementsRef) {
  handlePageContentPadding(elementsRef.buttonContainer, elementsRef.contentContainer);
  window.updateElementsInterface(elementsRef);
}

const elementsRef = getFeedbackTemplateElements("idFeedbackContainer");
onInitAndResizeFullHeightUpdateInterface(elementsRef);
window.addEventListener("scroll", () => window.updateElementsInterface(elementsRef));
window.addEventListener("resize", () => onInitAndResizeFullHeightUpdateInterface(elementsRef));
Copy
```

São scripts para adicionar scroll no conteúdo da página, adicionar efeitos de elevação no container do botão, no scroll e no resize identificar posicionamento do container do botão sobre o texto, criando ou removendo o efeito de scroll na página.

# Observação

Devido a uma limitação do storybook, para melhor visualização do template indicamos a visualização em forma de story e mudança do preview para mobile.

# Exemplo
```
<div id="feedback-template-194" class="brad-feedback-template">
  <div class="brad-feedback-template__content-container">
    <div class="brad-feedback-template__desktop-limiter">
      <div class="brad-feedback-template__ilustra">
        <img
          class="brad-illustration__content brad-illustration__content--chave-de-seguranca-ale-validando-ativacao"
        />
        <p
          class="brad-feedback-template__error-code-mobile brad-font-subtitle-xxs"
        >
          XXX
        </p>
      </div>

      <div class="brad-feedback-template__content">
        <div class="brad-feedback-template__content--text">
          <h1 class="brad-font-title-md brad-m-sm-b">Sua sessão expirou</h1>
          <p class="brad-font-paragraph-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque</p>
          <p
            class="brad-feedback-template__error-code-desktop brad-font-subtitle-xxs brad-m-sm-t"
          >
            XXX
          </p>
        </div>

        <div class="brad-feedback-template__button-container brad-fixed">
          <div class="brad-feedback-template__button-container--button">
            <button class="brad-btn brad-btn-primary">
              Botão primário
            </button>
            <button class="brad-btn brad-btn-text">Button Text</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| title | Título do feedback string | - |  |
| description | Descrição do feedback string | - |  |

# STORIES
Feedback
```
<div id="feedback-template-194" class="brad-feedback-template">
  <div class="brad-feedback-template__content-container">
    <div class="brad-feedback-template__desktop-limiter">
      <div class="brad-feedback-template__ilustra">
        <img
          class="brad-illustration__content brad-illustration__content--chave-de-seguranca-ale-validando-ativacao"
        />
        <p
          class="brad-feedback-template__error-code-mobile brad-font-subtitle-xxs"
        >
          XXX
        </p>
      </div>

      <div class="brad-feedback-template__content">
        <div class="brad-feedback-template__content--text">
          <h1 class="brad-font-title-md brad-m-sm-b">Sua sessão expirou</h1>
          <p class="brad-font-paragraph-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque</p>
          <p
            class="brad-feedback-template__error-code-desktop brad-font-subtitle-xxs brad-m-sm-t"
          >
            XXX
          </p>
        </div>

        <div class="brad-feedback-template__button-container brad-fixed">
          <div class="brad-feedback-template__button-container--button">
            <button class="brad-btn brad-btn-primary">
              Botão primário
            </button>
            <button class="brad-btn brad-btn-text">Button Text</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```
Feedback 3 Buttons
```
<div id="feedback-template-356" class="brad-feedback-template">
  <div class="brad-feedback-template__content-container">
    <div class="brad-feedback-template__desktop-limiter">
      <div class="brad-feedback-template__ilustra">
        <img
          class="brad-illustration__content brad-illustration__content--chave-de-seguranca-ale-validando-ativacao"
        />
      </div>

      <div class="brad-feedback-template__content">
        <div class="brad-feedback-template__content--text">
          <h1 class="brad-font-title-md brad-m-sm-b">Sua sessão expirou</h1>
          <p class="brad-font-paragraph-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            hendrerit nisi sed sollicitudin pellentesque</p>
        </div>

        <div class="brad-feedback-template__button-container brad-fixed">
          <div class="brad-feedback-template__button-container--button">
            <button class="brad-btn brad-btn-primary">
              Botão primário
            </button>
            <button class="brad-btn brad-btn-secondary">
              Botão primário
            </button>
            <button class="brad-btn brad-btn-text">Button Text</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```
Feedback No Button Fixed
```
<div class="brad-feedback-template">
  <div class="brad-feedback-template__content-container">
    <div class="brad-feedback-template__desktop-limiter">
      <div class="brad-feedback-template__ilustra">
        <img
          class="brad-illustration__content brad-illustration__content--erro-generico-err-mobile"
        />
      </div>

      <div class="brad-feedback-template__content">
        <div class="brad-feedback-template__content--text">
          <h1 class="brad-font-title-md brad-m-sm-b">Lorem ipsum dolor sit amet, consectetur adipiscingelit. Ut dictum dolor id nulla dictum</h1>
          <p class="brad-font-paragraph-sm">Lorem ipsum dolor sit amet, consectetur adipiscingelit. Ut dictum dolor id nulla dictum</p>

          <div class="brad-card brad-card--default brad-m-sm-t">
            <div
              id="accordion-258"
              class="brad-accordion brad-accordion--without-both"
            >
              <button
                role="button"
                class="brad-accordion__header brad-p-lg-l brad-font-title-md"
                onclick="LiquidCorp.BradAccordionService[0].toggle()"
              >
                <div class="brad-accordion__title brad-p-none-l">
                  <h2>Label</h2>
                </div>
                <em class="brad-accordion__icon"></em>
              </button>

              <div
                class="brad-accordion__content brad-p-lg-l brad-font-paragraph-sm"
                aria-hidden="true"
              >
                <p>
                  Lorem Ipsum has been the industry's standard dummy text
                  ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen
                  book.
                </p>
              </div>
            </div>
          </div>

          <div class="brad-card brad-card--default brad-m-sm-t">
            <div
              id="accordion-259"
              class="brad-accordion brad-accordion--without-both"
            >
              <button
                role="button"
                class="brad-accordion__header brad-p-lg-l brad-font-title-md"
                onclick="LiquidCorp.BradAccordionService[1].toggle('#accordion-259')"
              >
                <div class="brad-accordion__title brad-p-none-l">
                  <h2>Label</h2>
                </div>
                <em class="brad-accordion__icon"></em>
              </button>

              <div
                class="brad-accordion__content brad-p-lg-l brad-font-paragraph-sm"
                aria-hidden="true"
              >
                <p>
                  Lorem Ipsum has been the industry's standard dummy text
                  ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen
                  book.
                </p>
              </div>
            </div>
          </div>

          <div class="brad-alert brad-alert--info brad-m-md-t">
            <div class="brad-alert__icon">
              <em class="icon-feedback-alert-orientation d-flex"></em>
            </div>

            <div class="brad-alert__content">
              <h1 class="brad-alert__title brad-font-title-md">Title</h1>
              <div class="brad-alert__body">
                <div
                  class="brad-alert__body__middle brad-font-paragraph-sm"
                >
                  Ellentesque mattis accumsan lectus vitae efficitur. Sed
                  vitae voluptat sem, id laoreet lacus.
                </div>

                <button
                  class="brad-alert__link brad-btn brad-btn-text brad-btn-text--no-bg brad-btn--auto"
                >
                  <span>Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="brad-feedback-template__button-container">
          <div class="brad-feedback-template__button-container--button">
            <button class="brad-btn brad-btn-primary">
              Botão primário
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```