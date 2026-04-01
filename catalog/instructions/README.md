# 📜 Custom Instructions (Regras Globais da IA)

Esta pasta armazena o "coração comportamental" da Inteligência Artificial. Diferente dos *Templates* (que são prompts acionados ativamente pelo desenvolvedor em tarefas pontuais), as **Instructions** são diretrizes passivas que devem ser configuradas globalmente nas IDEs (Cursor, GitHub Copilot, Cline) ou Plataformas (ChatGPT, Claude) para que a IA sempre obedeça à arquitetura e cultura da empresa, sem que você precise lembrá-la disso.

## 📄 Matriz de Instruções

| Arquivo | O que essa instrução define |
| :--- | :--- |
| `mvc-java.md` | Instrução universal para projetos Spring MVC. Força a IA a blindar a entidade de Domínio contra o Lombok/JPA, mantendo regras restritas de cruzamento entre Controllers e Repositories. |
| `hexagonal-java.md` | Instrução de projeto que proíbe IAs de violarem a Arquitetura Hexagonal. Blinda o domínio, isola Adapters e força Inversão de Dependência no Spring Boot. |
| `angular-frontend.md` | Instrução de modernização visual forçando o arquiteto inteligente ao paradigma de uso dos Signals, destruição segura de ram via Memory Leaks (`takeUntilDestroyed`) e isolamento lógico. |
| `security-compliance.md` | A barreira AppSec: Trava a base aliada de cometer infrações de PCI-DSS gerando Logs viciados em informações ou aceitação de injeção XSS/SQL. |
| `testing-patterns.md` | Aciona o padrão rigoroso de BDD / Given-When-Then, banindo lixos unitários inúteis de testes simples como Getter Setters e apontando falha técnica para falta de "Sad Paths". |
| `solid-clean-code.md` | Proíbe IAs de desenvolver monólitos de classes (40~50 linhas), afunilamentos doentios com inúmeros sub-IFs (via uso de Guard Clauses) e impede nomes sujos ("magic numbers" e abrévios). |
