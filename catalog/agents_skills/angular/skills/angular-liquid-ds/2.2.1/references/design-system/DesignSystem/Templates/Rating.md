# Rating

O template rating permite aos usuários classificar um item, produto ou serviço e complementar sua avaliação adicionando comentários sobre a classificação atribuída.
A tela de avaliação é apresentada durante ou no fim de uma jornada e possui o seguinte comportamento:


Quando o usuário fizer a avaliação, o botão de enviar será habilitado e ao clicar, ele será direcionado para a tela de feedback.
.

# Uso do HTML
```
<section id="rating-template" class="brad-component-toggle">${primaryServiceHtml} ${secondaryServiceHtml}</section>
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

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, args) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(args));
    }
  }
}

const ratingContent = {
  content: /* HTML */ `
    <div class="brad-rating-form__content">
      <div class="brad-modal__close" brad-dc-toggle-close></div>

      <h2 class="brad-rating-form__content--title brad-font-title-xl brad-text-color-neutral-100 brad-m-sm-b">Conta pra gente o que achou dessa experiência</h2>

      <p class="brad-rating-form__content--description brad-font-paragraph-sm brad-text-color-neutral-50 brad-m-md-b">Sua opinião nos ajuda a entregar serviços do jeito que você precisa.</p>

      <div id="rating" class="brad-rating brad-rating--lg brad-m-md-b">
        <div class="brad-rating__accessibility" aria-live="polite"></div>
      </div>

      <label class="brad-text-field brad-m-md-b">
        <textarea aria-label="Campo de texto" type="text" placeholder="Deixe seu comentário" rows="3" maxlength="400"></textarea>
        <small aria-hidden="true" aria-hidden="true" class="placeholder-label-field">Deixe seu comentário</small>
        <em class="validation-icon complements"></em>

        <span class="helper-text">
          Opcional
          <small class="count"><span class="count" id="char-counter">0</span>/400</small>
        </span>

        <div class="brad-text-field--background"></div>
      </label>

      <div class="brad-rating-form__button-container brad-p-xxl-t">
        <button disabled id="btn-next-f1" class="brad-btn brad-btn-primary">Enviar avaliação</button>

        <button brad-dc-toggle-close class="brad-btn brad-btn-text">Agora não</button>
      </div>
    </div>
  `,
  setup: (service, globalEventEmitter) => {
    const ratingOptions = {
      targetSelector: "#rating",
      ratings: ["Muito insatisfeito", "Insatisfeito", "Neutro", "Satisfeito", "Muito satisfeito"],
      showTextRating: true,
    };

    const ratingService = BradRatingService.getInstance(ratingOptions);
    ratingService.eRating.addEventListener("rated", (event) => {
      globalEventEmitter.emit("rated", { detail: event.detail });
    });

    document.querySelector("textarea").addEventListener("input", (event) => {
      globalEventEmitter.emit("commented", {
        detail: event.target.value,
      });
    });

    service.eContainer.classList.remove("brad-feedback-template--toggle");
    service.eContainer.classList.add("brad-rating-form");

    const eButtonNext = document.getElementById("btn-next-f1");
    eButtonNext.addEventListener("click", () => {
      TemplateFlowManager.nextFlow();
      service.updateContent(TemplateFlowManager.getCurrentFlow().content);

      if (TemplateFlowManager.hasSetup()) TemplateFlowManager.getCurrentFlow().setup(service);
    });
  },
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
              <h1 class="brad-font-title-md brad-m-sm-b">Avaliação enviada</h1>

              <p class="brad-font-paragraph-sm">Agradecemos por dedicar esse tempo para compartilhar sua opinião com a gente.</p>
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
    service.eContainer.classList.remove("brad-rating-form");
    service.eContainer.classList.add("brad-feedback-template--toggle");

    if (!window.updateElementsInterface) {
      window.updateElementsInterface = (elementsRef) => {
        toggleButtonElevationClass(elementsRef.buttonContainer, validateIfTextUnderneath(elementsRef.textContainerBottomElement, elementsRef.buttonContainer));
      };
    }

    function toggleButtonElevationClass(buttonContainer, add) {
      const buttonClassList = buttonContainer.classList;

      if (buttonClassList.contains("brad-sticky")) {
        buttonClassList.toggle("brad-sticky__elevation", add);
      } else {
        buttonClassList.toggle("brad-shadow-top-10", add);
        buttonClassList.toggle("brad-bg-color-neutral-0", add);
      }
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

    service.eContainer.addEventListener("open", () => {
      initScrollListeners(elementsRef);
      window.updateElementsInterface(elementsRef);
    });

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
    flow: [ratingContent, feedbackContent],
  },
];

const id = "rating-template";
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

const globalEventEmitter = new EventEmitter();
globalEventEmitter.on("rated", (event) => {
  const buttonNext = document.querySelector(".brad-rating-form__button-container #btn-next-f1");

  if (event.detail.currentRating > 0) {
    buttonNext.disabled = false;
  } else {
    buttonNext.disabled = true;
  }
});

globalEventEmitter.on("commented", (event) => {
  const counterElement = document.querySelector(".brad-rating-form__content .helper-text #char-counter");

  counterElement.innerText = event.detail.length;
});

TemplateFlowManager.getCurrentFlow().setup(service, globalEventEmitter);

service.eContainer.addEventListener("close", () => {
  service.resetContent();
  TemplateFlowManager.resetFlow().setup(service, globalEventEmitter);
});
Copy
```
Exemplo
```
<button
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  onclick="window.LiquidCorp.BradComponentToggleService.open()"
>
  <em><em class="fab-icon i icon-ui-placeholder"></em></em>
</button>

<section id="is-337" class="brad-component-toggle">
   <div
    id="primary-110"
    class="brad-bottom-sheet brad-component-toggle__template"
    aria-modal="true"
    tabindex="-1"
  ></div> <div
    id="secondary-35"
    class="brad-modal brad-component-toggle__template"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  ></div>
</section>
```