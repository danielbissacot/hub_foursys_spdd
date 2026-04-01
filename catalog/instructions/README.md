# 📜 Custom Instructions (Regras Globais da IA)

Esta pasta armazena o "coração comportamental" da Inteligência Artificial. Diferente dos *Templates* (que são prompts acionados ativamente pelo desenvolvedor em tarefas pontuais), as **Instructions** são diretrizes passivas que devem ser configuradas globalmente nas IDEs (Cursor, GitHub Copilot, Cline) ou Plataformas (ChatGPT, Claude) para que a IA sempre obedeça à arquitetura e cultura da empresa, sem que você precise lembrá-la disso.

## 📄 Matriz de Instruções

| Arquivo | O que essa instrução define |
|---------|-----------------------------|
| `hexagonal-java.md` | Instrução de projeto que proíbe IAs de violarem a Arquitetura Hexagonal. Blinda o domínio, isola Adapters e força Inversão de Dependência no Spring Boot. |
