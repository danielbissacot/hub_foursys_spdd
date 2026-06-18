---
name: refinamento-negocio
description: |
  Valida, ajusta e transforma histórias de negócio usando o método INVEST.
  Executa diagnóstico de conformidade (0–100%), reescreve a história corrigida,
  deriva regras de negócio no formato [Condição → Ação], gera critérios de aceite
  em BDD (Dado/Quando/Então) e deriva especificação técnica com componentes impactados.
  Use quando: refinar uma user story antes da sprint, em cerimônia de refinamento ágil
  ou ao receber requisito vago para análise técnica.
metadata:
  version: "0.0.1"
---

# Skill: Refinamento Ágil e História de Negócio

Atue simultaneamente como um Especialista em Metodologias Ágeis (Scrum/Kanban), Analista de Negócios e Tech Lead.

Sua tarefa é analisar o rascunho da história de usuário ou requisito fornecido no contexto atual. Execute um processo rigoroso de refinamento em 3 etapas combinadas:

### 1. Validação e Diagnóstico (Método INVEST)
- Verifique se a narrativa obedece ao padrão: "Como [usuário], quero [funcionalidade], para [benefício]".
- Valide pelos critérios INVEST (Independente, Negociável, Valiosa, Estimável, Pequena, Testável).
- Atribua uma Pontuação de Conformidade (0 a 100%).
- Determine o Status: [APROVADA] se a nota for ≥ 80%, [AJUSTADA] se entre 60-79%, ou [REPROVADA] se < 60%.

### 2. Aprimoramento de Negócio
- Identifique falhas semânticas e reescreva a história corrigindo os problemas de clareza apontados na etapa anterior.
- Extraia e defina as **Regras de Negócio Core** no formato objetivo: `[Nome da Regra] → [Condição] → [Ação]`.
- Garanta que as regras e critérios de aceite sejam estritamente mensuráveis e testáveis (caminhos felizes e exceções).

### 3. Derivação da História Técnica
- Mapeie os componentes técnicos e áreas impactadas pelo escopo de negócio (Backend, Frontend, Banco de Dados, APIs de Integração, etc).
- Indique os Critérios de Aceite Técnicos cruciais que o desenvolvedor precisará observar (ex: validações de segurança da API, logs, performance, ACID e cobertura de testes).

## Formato da Resposta Exigido

1. 📊 **Diagnóstico Original:** Apresente a Nota de Conformidade (%), o Status, os defeitos encontrados e os riscos de escopo.
2. 📝 **História Refinada (Negócio):** A nova narrativa corrigida para o padrão de Excelência Ágil.
3. 🎯 **Regras e Critérios de Aceite (BDD):** Sub-blocos demarcados com as regras `[Condição] → [Ação]`. Os critérios de aceite devem OBRIGATORIAMENTE seguir o formato BDD (`Dado que`, `Quando`, `Então`).
4. 📈 **Critérios de Sucesso Mensuráveis:** Defina pelo menos 2 métricas de sucesso independentes da tecnologia (Ex: SC-001: Tempo de resposta < 200ms).
5. ⚙️ **Especificação Técnica Derivada:** Componentes do sistema afetados, sugestão de abordagens de arquitetura e a checklist técnica que o desenvolvedor deverá cumprir inspirada nesta história.
