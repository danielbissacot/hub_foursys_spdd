import * as vscode from 'vscode';

export class AIClient {
    /**
     * Interage nativamente com a API de Language Model do VS Code (GitHub Copilot Enterprise).
     */
    public static async sendPromptToCopilot(agentName: string, context: string, globalRules: string): Promise<string> {
        try {
            // Seleciona o modelo provido pelo GitHub Copilot
            const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
            
            if (!models || models.length === 0) {
                // Caso não tenha acesso ou a extensão não esteja ativa, cai no modo de simulação (Mock)
                return this.simulateFallback(agentName);
            }

            const model = models[0]; // Usa o modelo padrão do Copilot (geralmente GPT-4o)

            // Monta o prompt combinando a governança corporativa e a tarefa do agente
            const systemPrompt = `Você é o ${agentName} do AI Governance Hub. 
Siga estritamente as regras de governança corporativa abaixo:
---
${globalRules}
---`;
            let personaAction = "execute sua tarefa de forma detalhada.";
            if (agentName.includes("REFINAMENTO")) {
                personaAction = "Você deve atuar como Analista de Requisitos. Leia o documento de contexto fornecido, extraia as regras de negócio e crie Critérios de Aceite técnicos no formato BDD (Given, When, Then).";
            } else if (agentName.includes("ARQUITETO")) {
                personaAction = "Você deve atuar como Arquiteto de Software. Avalie o refinamento fornecido e desenhe uma proposta de arquitetura técnica em tópicos, especificando componentes, APIs e padrões a serem adotados.";
            } else if (agentName.includes("JAVA") || agentName.includes("ANGULAR")) {
                personaAction = "Você deve atuar como Engenheiro de Software Sênior. Gere o código-fonte final baseado no contexto fornecido, aplicando estritamente as regras de Clean Code e a arquitetura definida. Retorne apenas código.";
            }

            const userPrompt = `Baseado no documento fornecido, ${personaAction}\n\n[CONTEÚDO DO DOCUMENTO]\n${context}`;

            // Prepara as mensagens usando a API nativa
            const messages = [
                vscode.LanguageModelChatMessage.User(systemPrompt),
                vscode.LanguageModelChatMessage.User(userPrompt)
            ];

            // Envia a requisição usando a licença do usuário
            const chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
            
            let fullResponse = '';
            for await (const chunk of chatResponse.text) {
                fullResponse += chunk;
            }

            return fullResponse;
        } catch (error: any) {
            console.warn(`Falha ao contactar a API vscode.lm: ${error.message}. Entrando em modo simulação.`);
            return this.simulateFallback(agentName);
        }
    }

    /**
     * Fallback Visual: Caso haja restrição de rede ou o Copilot não esteja ativo, 
     * simula a geração para manter o fluxo SDD funcionando visualmente para a PoC.
     */
    private static async simulateFallback(agentName: string): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let simulatedCode = "";
                if (agentName.includes("JAVA")) {
                    simulatedCode = `// [Simulação: Código gerado pelo ${agentName}]\n@RestController\npublic class DemoController {\n    @GetMapping("/api")\n    public String get() { return "Hello Hub"; }\n}`;
                } else if (agentName.includes("ANGULAR")) {
                    simulatedCode = `// [Simulação: Código gerado pelo ${agentName}]\n@Component({\n  selector: 'app-demo',\n  standalone: true,\n  template: '<h1>Hello Hub</h1>'\n})\nexport class DemoComponent {}`;
                } else {
                    simulatedCode = `# Documentação Gerada pelo ${agentName}\n\n- Arquitetura validada.\n- Regras globais aplicadas.`;
                }
                resolve(simulatedCode);
            }, 3000); // 3 segundos de simulação para o usuário ler a tela
        });
    }
}
