# 🏛️ Instrução Global: Prontidão para Modernização Java

*Esta instrução define diretrizes de codificação que facilitam a futura migração/transpilação de lógica COBOL para Microserviços Java seguindo a Arquitetura Hexagonal.*

---

## 1. Desacoplamento de Lógica de Negócio

- **Isolamento de I/O:** Separe os parágrafos que lêem ou gravam arquivos daqueles que realizam cálculos. Mantenha a "Regra de Negócio" pura, simulando o que seria o **Domain/UseCase** no Java.
- **Chamada de Sub-programas:** Use calls organizados para modularizar funcionalidades, facilitando a identificação de serviços candidatos a virar Microserviços independentes.

## 2. Abstração de Dados

- **Evite Magic Numbers:** Não use valores constantes no meio da PROCEDURE DIVISION. Defina constantes na WORKING-STORAGE com nomes significativos.
- **Estruturas Atômicas:** Organize os dados (`01 levels`) de forma que representem Entidades ou DTOs claros. Evite misturar muitos dados não-relacionados no mesmo agrupador.

## 3. Padrão de Fluxo

- **Single Entry / Single Exit:** Garanta que cada parágrafo/seção performada tenha um ponto único de entrada e saída. Isso mapeia perfeitamente para Métodos e Funções em Java.
- **Tratamento de Exceções Lógicas:** Implemente retornos lógicos claros (Ex: `WS-STATUS-ERRO`) que possam ser mapeados para Exceções de Domínio no Spring Boot.

## 4. Documentação de Intenção

- **Contrato de Linkage:** Documente claramente todos os campos da `LINKAGE SECTION`, pois eles se tornarão os **Request/Response DTOs** ou **Input/Output Ports** na arquitetura hexagonal.

---
> [!TIP]
> **Dica de Futuro:** Um código COBOL bem estruturado hoje pode ser convertido automaticamente em um Microserviço Java de alta performance amanhã.

---
> **"Modernização não é apenas trocar a linguagem; é evoluir o pensamento."** - Arquiteto de Modernização
