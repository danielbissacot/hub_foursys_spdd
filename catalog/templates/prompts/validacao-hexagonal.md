# Template: Validação de Arquitetura Hexagonal

Copie o texto do bloco abaixo e cole no ChatGPT, Copilot ou Claude, junto com os arquivos ou a árvore de diretórios do seu projeto. 

Este prompt instrui a IA a atuar como um arquiteto rigoroso na análise do seu código.

---

### 📋 Copie o Prompt abaixo:

```text
Atue como um Arquiteto de Software Especialista em Java e Arquitetura Hexagonal (Ports and Adapters). 

Por favor, analise as classes e a estrutura do código que vou fornecer a seguir. Quero que você avalie de forma rigorosa se a implementação atual respeita os pilares da Arquitetura Hexagonal adotados pelo nosso Hub de Governança. 

Verifique obrigatoriamente os seguintes pontos:

1. **Isolamento do Domínio:** O modelo de domínio (Domain) e as regras de negócio centrais estão 100% isoladas de infraestrutura? Existe alguma anotação de framework (como Spring, JPA, drivers de banco) sujando essas classes?
2. **Ports and Adapters:** As comunicações da aplicação com o meio externo (bancos, APIs, mensageria) ocorrem estritamente por meio de interfaces (Ports)? 
3. **Inversão de Dependência:** O fluxo de dependências está apontando de fora para dentro? (Adaptadores dependem de Ports de entrada ou implementam Ports de saída, e o domínio não conhece nada externo).
4. **Vazamento de Lógica de Negócio:** Existem regras de negócio escondidas ou implementadas dentro de Controllers, Gateways ou Repositories?

Seu retorno deve ser um laudo técnico contendo:
- O que está correto e bem implementado.
- Quais regras foram quebradas (cite exatamente a classe e o trecho de código ofensor).
- Como refatorar o código para corrigir a violação, demonstrando como as classes deveriam ficar.

Aqui está o código/estrutura para avaliação:
[COLE A ESTRUTURA DE PASTAS OU O CÓDIGO DAS CLASSES AQUI]
```
