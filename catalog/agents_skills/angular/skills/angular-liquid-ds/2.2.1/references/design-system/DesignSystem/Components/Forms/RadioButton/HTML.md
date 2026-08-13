# RadioButton

É um componente que permite a seleção de um único item em uma lista.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do HTML
```
<label class="brad-radio brad-flex-row brad-flex-align-items-start brad-m-sm-b">
<input type="radio" name="group" />
<span class="checkmark"></span>
<p>Label 1</p>
</label>
```
Estilos
## OnColor

O modo OnColor é uma solução para obter maior contraste para elementos visuais e componentes aplicados em fundo escuro e colorido. Este modo torna possível atender ao contraste mínimo recomendado pela WCAG.

```
<label
class="brad-radio brad-radio--on-color brad-flex-row brad-flex-align-items-start brad-m-sm-b"
>
<input type="radio" name="group" />
<span class="checkmark"></span>
<p>Label 1</p>
</label>
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Acessibilidade

O componente radio-button do Design System Liquid foi desenvolvido usando HTML semântico, assegurando a interpretação correta do leitor de tela e permitindo a navegação com o teclado, além da navegação com swipe nos dispositivos móveis.

Certifique-se de adicionar a tag name em cada input do tipo radio-button com um valor idêntico para todos os radio-buttons dentro do mesmo grupo. Isso permite que os radio-buttons sejam associados corretamente, facilitando a comunicação com leitores de tela e outras tecnologias assistivas.

Abaixo está um exemplo do nosso componente, consistindo de dois radio-buttons. Ambos os radio-buttons possuem o mesmo atributo name, neste caso, chamado group. Essa abordagem garante que a acessibilidade funcione conforme esperado, permitindo a identificação precisa do radio-button em foco e sua posição relativa aos outros no grupo.

# Exemplos
Default
```
<label
        class="brad-radio  brad-flex-row brad-flex-align-items-start brad-m-sm-b"
      >
        <input type="radio" name="group" value="1"  checked />
        <span class="checkmark"></span>
        <p>1. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.</p>
      </label>
    
      <label
        class="brad-radio  brad-flex-row brad-flex-align-items-start brad-m-sm-b"
      >
        <input type="radio" name="group" value="2"  />
        <span class="checkmark"></span>
        <p>2. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.</p>
      </label>
    
      <label
        class="brad-radio  brad-flex-row brad-flex-align-items-start brad-m-sm-b"
      >
        <input type="radio" name="group" value="3"  />
        <span class="checkmark"></span>
        <p>3. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.</p>
      </label>
    
      <label
        class="brad-radio  brad-flex-row brad-flex-align-items-start brad-m-sm-b"
      >
        <input type="radio" name="group" value="4"  />
        <span class="checkmark"></span>
        <p>4. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.</p>
      </label>
```