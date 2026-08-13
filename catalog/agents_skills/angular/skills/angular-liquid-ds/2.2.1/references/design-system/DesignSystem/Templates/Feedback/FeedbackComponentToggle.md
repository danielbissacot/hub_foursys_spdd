# FeedbackComponentToggle

A tela de feedback foi pensada para ser responsível e reforçar o padrão do liquid corporativo, se encaixando em todos os temas. Nesse caso de uso o modelo irá de bottom-sheet a modal de acordo com a resolução atendida, utilizando o serviço Component Toggle.
.

# Uso do HTML
```
<section id="feedback-template" class="brad-component-toggle">${primaryServiceHtml} ${secondaryServiceHtml}</section>
Copy
```
Uso de scripts
```
const serviceMapping = {
  BradBottomSheetService: {
    class: BradBottomSheetService,
    html: (id) => /* HTML */ ` <div id="${id}" class="brad-bottom-sheet brad-component-toggle__template" aria-modal="true" tabindex="-1"></div>`,
    moreOptions: {
      state: "modal",
    },
  },
  BradModalService: {
    class: BradModalService,
    html: (id) => /* HTML */ `<div id="${id}" class="brad-modal brad-component-toggle__template" role="dialog" aria-modal="true" tabindex="-1"></div>`,
  },
};

const TemplateFlowManager = (() => {
  let currentFlowPosition = 0;
  let currentTemplate = null;
  let currentFlow = null;

  const setTemplate = (template) => {
    currentTemplate = template;
    updateCurrentFlow();
  };

  const updateCurrentFlow = (pos = 0) => {
    currentFlowPosition = pos;
    currentFlow = currentTemplate ? currentTemplate.flow[currentFlowPosition] : null;
  };

  const getCurrentFlow = () => currentFlow;

  const getCurrentFlowPosition = () => currentFlowPosition;

  const nextFlow = () => {
    if (currentTemplate && currentFlowPosition < currentTemplate.flow.length - 1) {
      updateCurrentFlow(currentFlowPosition + 1);
    }
  };

  const previousFlow = () => {
    if (currentTemplate && currentFlowPosition > 0) {
      updateCurrentFlow(currentFlowPosition - 1);
    }
  };

  const resetFlow = () => {
    currentFlowPosition = 0;
    updateCurrentFlow();
    return currentFlow;
  };

  const hasSetup = () => {
    return typeof getCurrentFlow().setup === "function";
  };

  return {
    setTemplate,
    updateCurrentFlow,
    getCurrentFlow,
    getCurrentFlowPosition,
    nextFlow,
    previousFlow,
    resetFlow,
    hasSetup,
  };
})();

const onInitTemplate = () => {
  const targetTemplate = templates.find((t) => t.template === "Rating&Review");

  if (targetTemplate) {
    TemplateFlowManager.setTemplate(targetTemplate);
    return;
  }
};

const feedbackContent = {
  content: /* HTML */ `
    <div class="brad-feedback-template--toggle__component">
      <div class="brad-modal__close" brad-dc-toggle-close></div>

      <div class="brad-feedback-template__content-container">
        <div class="brad-feedback-template__desktop-limiter">
          <div class="brad-feedback-template__ilustra">
            <img class="brad-illustration__content brad-illustration__content--misc-suc-pesquisa-de-satisfacao brad-illustration__bg--amoeba-2" />
          </div>

          <div class="brad-feedback-template__content brad-m-xs-t">
            <div class="brad-feedback-template__content--text">
              <h1 class="brad-font-title-md brad-m-sm-b">Sua sessão expirou</h1>

              <p class="brad-font-paragraph-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque</p>
            </div>

            <div class="brad-feedback-template__button-container brad-sticky">
              <div class="brad-feedback-template__button-container--button">
                <button brad-dc-toggle-close class="brad-btn brad-btn-primary">Fechar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup: (service) => {
    service.eContainer.classList.add("brad-feedback-template--toggle");

    function toggleButtonElevationClass(buttonContainer, add) {
      const buttonClassList = buttonContainer.classList;

      if (buttonClassList.contains("brad-sticky")) {
        if (add) {
          buttonClassList.add("brad-sticky__elevation");
        } else {
          buttonClassList.remove("brad-sticky__elevation");
        }
      } else {
        if (add) {
          buttonClassList.add("brad-shadow-top-10", "brad-bg-color-neutral-0");
        } else {
          buttonClassList.remove("brad-shadow-top-10", "brad-bg-color-neutral-0");
        }
      }
    }

    if (!window.updateElementsInterface) {
      window.updateElementsInterface = (elementsRef) => {
        toggleButtonElevationClass(elementsRef.buttonContainer, validateIfTextUnderneath(elementsRef.textContainerBottomElement, elementsRef.buttonContainer));
      };
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

    function onScroll() {
      window.updateElementsInterface(elementsRef);
    }

    function initScrollListeners(elementsRef) {
      const templateAreas = document.querySelectorAll(".brad-component-toggle__template");

      templateAreas.forEach((area) => {
        area.addEventListener("scroll", onScroll, true);
      });
    }

    const elementsRef = getFeedbackTemplateElements(service.eContainer.id);

    initScrollListeners(elementsRef);
    window.updateElementsInterface(elementsRef);

    window.addEventListener("resize", () => {
      initScrollListeners(elementsRef);

      setTimeout(() => {
        window.updateElementsInterface(elementsRef);
      }, 500);
    });

    function onClose() {
      const templateAreas = document.querySelectorAll(".brad-component-toggle__template");

      templateAreas.forEach((area) => {
        area.removeEventListener("scroll", onScroll, true);
      });
    }

    service.eContainer.addEventListener("close", onClose);
  },
};

const templates = [
  {
    template: "Rating&Review",
    flow: [feedbackContent],
  },
];

const id = "feedback-template";
const idPrimaryService = "primary-container";
const idSecondaryService = "secondary-container";

const primaryComponentService = "BradBottomSheetService";
const secondaryComponentService = "BradModalService";

const PrimaryService = serviceMapping[primaryComponentService].class;
const primaryServiceMoreOptions = serviceMapping[primaryComponentService].moreOptions || {};
const primaryServiceHtml = serviceMapping[primaryComponentService].html(idPrimaryService);

const SecondaryService = serviceMapping[secondaryComponentService].class;
const secondaryServiceMoreOptions = serviceMapping[secondaryComponentService].moreOptions || {};
const secondaryServiceHtml = serviceMapping[secondaryComponentService].html(idSecondaryService);

onInitTemplate();

const options = {
  targetSelector: `#${id}`,
  primaryComponentService: new PrimaryService({
    targetSelector: `#${idPrimaryService}`,
    ...primaryServiceMoreOptions,
  }),
  secondaryComponentService: new SecondaryService({
    targetSelector: `#${idSecondaryService}`,
    ...secondaryServiceMoreOptions,
  }),
  content: TemplateFlowManager.getCurrentFlow().content,
};

const service = BradComponentToggleService.getInstance(options);
window.LiquidCorp = window.LiquidCorp || {};
window.LiquidCorp.BradComponentToggleService = service;

TemplateFlowManager.getCurrentFlow().setup(service);

service.eContainer.addEventListener("close", () => {
  service.resetContent();
  TemplateFlowManager.resetFlow().setup(service);
});
Copy
```
Para modelos com o botão flutuante fixo no final do componente, utilize os scripts abaixo dentro do setup do template:
```
service.eContainer.classList.add("brad-feedback-template--toggle");

function toggleButtonElevationClass(buttonContainer, add) {
  const buttonClassList = buttonContainer.classList;

  if (buttonClassList.contains("brad-sticky")) {
    if (add) {
      buttonClassList.add("brad-sticky__elevation");
    } else {
      buttonClassList.remove("brad-sticky__elevation");
    }
  } else {
    if (add) {
      buttonClassList.add("brad-shadow-top-10", "brad-bg-color-neutral-0");
    } else {
      buttonClassList.remove("brad-shadow-top-10", "brad-bg-color-neutral-0");
    }
  }
}

if (!window.updateElementsInterface) {
  window.updateElementsInterface = (elementsRef) => {
    toggleButtonElevationClass(elementsRef.buttonContainer, validateIfTextUnderneath(elementsRef.textContainerBottomElement, elementsRef.buttonContainer));
  };
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

function onScroll() {
  window.updateElementsInterface(elementsRef);
}

function initScrollListeners(elementsRef) {
  const templateAreas = document.querySelectorAll(".brad-component-toggle__template");

  templateAreas.forEach((area) => {
    area.addEventListener("scroll", onScroll, true);
  });
}

const elementsRef = getFeedbackTemplateElements(service.eContainer.id);

initScrollListeners(elementsRef);
window.updateElementsInterface(elementsRef);

window.addEventListener("resize", () => {
  initScrollListeners(elementsRef);

  setTimeout(() => {
    window.updateElementsInterface(elementsRef);
  }, 500);
});

function onClose() {
  const templateAreas = document.querySelectorAll(".brad-component-toggle__template");

  templateAreas.forEach((area) => {
    area.removeEventListener("scroll", onScroll, true);
  });
}

service.eContainer.addEventListener("close", onClose);
Copy
```
## Observação

Devido a uma limitação do storybook, para melhor visualização do template indicamos a visualização em forma de story e mudança do preview para mobile.

# Exemplo
```
<button
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  onclick="window.LiquidCorp.BradComponentToggleService.open()"
>
  <em><em class="fab-icon i icon-ui-placeholder"></em></em>
</button>

<section id="is-85" class="brad-component-toggle">
   <div
    id="primary-316"
    class="brad-bottom-sheet brad-component-toggle__template"
    aria-modal="true"
    tabindex="-1"
  ></div> <div
    id="secondary-223"
    class="brad-modal brad-component-toggle__template"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  ></div>
</section>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| title | Título do feedback string | - | - |
| description | Descrição do feedback string | - | - |