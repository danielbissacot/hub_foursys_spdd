export interface SDDStep {
    id: string;
    agent: string;
    input_context: string;
    expected_output_extension: string;
    require_human_approval: boolean;
}

export interface SDDPipeline {
    id: string;
    name: string;
    description: string;
    steps: SDDStep[];
}

export interface HubConfig {
    version: string;
    pipelines: SDDPipeline[];
}

export class SDDEngine {
    // Regras Globais "Chumbadas" no código do plugin
    private static GLOBAL_RULES = `
# AI GOVERNANCE HUB - REGRAS GLOBAIS

Este arquivo dita o comportamento obrigatório de todos os Agentes (Skills) executados pelo Plugin Orquestrador usando GitHub Copilot Enterprise.

## Regras de Backend (Java / Spring Boot)
1. **Clean Code Obrigatório:** O código gerado deve seguir estritamente o padrão Clean Code.
2. **Versionamento:** Utilizar Java 21+ e Spring Boot 3+.
3. **Injeção de Dependências:** Sempre usar injeção por construtor, nunca via @Autowired em propriedades.
4. **Resiliência:** Interfaces de comunicação externa devem utilizar padrões de circuit breaker e retry.

## Regras de Frontend (Angular)
1. **Arquitetura:** Seguir a estrutura de Standalone Components (Angular 14+).
2. **Reatividade:** Priorizar o uso de Signals sobre RxJS para o estado local, utilizando RxJS primariamente para integrações com serviços HTTP.
3. **Acessibilidade (a11y):** Todo elemento interativo deve ter ARIA attributes apropriados.
`;

    // Configuração "Chumbada" do Pipeline (Não depende mais do YAML)
    private static BUILTIN_CONFIG: HubConfig = {
        version: "1.2.0",
        pipelines: [
            {
                id: "fluxo_completo_backend",
                name: "⚙️ Fluxo Completo: Backend Java Spring Boot",
                description: "Refinamento -> Arquiteto -> Desenvolvedor Java",
                steps: [
                    { id: "step_refinamento", agent: "AGENTE_REFINAMENTO", input_context: "user_story.md", expected_output_extension: ".md", require_human_approval: true },
                    { id: "step_arquiteto", agent: "AGENTE_ARQUITETO", input_context: "output_agente_refinamento.md", expected_output_extension: ".md", require_human_approval: true },
                    { id: "step_dev", agent: "AGENTE_DESENVOLVEDOR_JAVA", input_context: "output_agente_arquiteto.md", expected_output_extension: ".java", require_human_approval: false }
                ]
            },
            {
                id: "fluxo_completo_frontend",
                name: "⚙️ Fluxo Completo: Frontend Angular 18",
                description: "Refinamento -> UX/UI -> Desenvolvedor Angular",
                steps: [
                    { id: "step_refinamento", agent: "AGENTE_REFINAMENTO", input_context: "user_story.md", expected_output_extension: ".md", require_human_approval: true },
                    { id: "step_ux", agent: "AGENTE_UX_UI", input_context: "output_agente_refinamento.md", expected_output_extension: ".html", require_human_approval: true },
                    { id: "step_dev", agent: "AGENTE_DESENVOLVEDOR_ANGULAR", input_context: "output_agente_ux_ui.html", expected_output_extension: ".ts", require_human_approval: false }
                ]
            },
            {
                id: "acesso_direto_java",
                name: "⚡ Acesso Direto: Desenvolvedor Java",
                description: "Gera apenas o código Java baseado em um arquivo de contexto fornecido",
                steps: [
                    { id: "step_dev", agent: "AGENTE_DESENVOLVEDOR_JAVA", input_context: "user_story.md", expected_output_extension: ".java", require_human_approval: false }
                ]
            },
            {
                id: "acesso_direto_angular",
                name: "⚡ Acesso Direto: Desenvolvedor Angular",
                description: "Gera apenas o código Angular baseado em um arquivo de contexto fornecido",
                steps: [
                    { id: "step_dev", agent: "AGENTE_DESENVOLVEDOR_ANGULAR", input_context: "user_story.md", expected_output_extension: ".ts", require_human_approval: false }
                ]
            }
        ]
    };

    constructor(workspaceRoot: string) {
        // WorkspaceRoot mantido por compatibilidade com extension.ts, 
        // mas não lemos mais arquivos globais daqui.
    }

    public loadConfig(): HubConfig {
        return SDDEngine.BUILTIN_CONFIG;
    }

    public getGlobalRules(): string {
        return SDDEngine.GLOBAL_RULES;
    }
}
