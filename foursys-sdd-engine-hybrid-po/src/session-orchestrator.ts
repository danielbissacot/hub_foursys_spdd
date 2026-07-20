import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AIClient } from './ai-client';
import { findCatalogPath } from './engine/catalog-loader';
import { resolveStack, getStackConfig } from './engine/stack-registry';
import { assembleFinalPrompt, getPhaseType, extractHtmlBlock } from './engine/prompt-context';
import { resolveStoryDocPath, getActiveStorySlug } from './utils';
import { trackEvent } from './telemetry';
import {
    createSession, loadSession, appendMessage, recordOutputFile,
    SDDSession, SDDSessionMessage
} from './engine/session-store';

/** Fases cujo arquivo de saída vive na subpasta da história ativa (doc_projeto/<slug>/...).
 *  Constitution e o trilho PO (Discovery/PRD/Stories) são de nível de projeto, não de história. */
const STORY_SCOPED_PHASES = new Set([
    'plan', 'tasks', 'qa-test-plan', 'qa-test-cases', 'qa-automation', 'qa-coverage', 'qa-report'
]);

const PHASE_LABELS: Record<string, string> = {
    constitution:    'Constitution',
    plan:            'Plano técnico',
    tasks:           'Tarefas',
    'qa-test-plan':  'Plano de QA',
    'qa-test-cases': 'Casos de Teste',
    'qa-automation': 'Automação de Testes',
    'qa-coverage':   'Cobertura de Testes',
    'qa-report':     'Relatório de Qualidade',
    'po-discovery':  'Discovery',
    'po-prd':        'PRD',
    'po-stories':    'User Stories',
};

/** Últimas N mensagens da sessão dobradas no prompt — mantém o AIClient.sendPrompt() sem
 *  precisar de um parâmetro de histórico próprio, e segue o mesmo espírito de orçamento de
 *  contexto enxuto já usado em prompt-context.ts (CONTEXT_FILE_MAX_LINES etc). */
const MAX_HISTORY_MESSAGES = 6;

export interface PhaseTurnStepEvent {
    sessionId: string;
    step: 'reading-context' | 'calling-model' | 'writing-file' | 'done' | 'error';
    detail?: string;
}

export interface RunPhaseTurnParams {
    context: vscode.ExtensionContext;
    outputChannel: vscode.OutputChannel;
    token: vscode.CancellationToken;
    /** Sessão existente a continuar. Omitido = cria uma sessão nova para `command`. */
    sessionId?: string;
    /** Obrigatório quando sessionId é omitido — a fase a iniciar. */
    command?: string;
    /** Pode ser '' no primeiro turno (gera automaticamente com base só no playbook/contexto). */
    userMessage: string;
    onStep?: (evt: PhaseTurnStepEvent) => void;
    onChunk?: (chunk: string) => void;
}

export interface RunPhaseTurnResult {
    session: SDDSession;
    outputPath: string;
    wroteFile: boolean;
    cancelled: boolean;
}

export function getSessionsRootDir(rootPath: string): string {
    return path.join(rootPath, 'foursys-sessions');
}

function getWorkspaceRoot(): string | null {
    const folders = vscode.workspace.workspaceFolders;
    return folders ? folders[0].uri.fsPath : null;
}

function foldHistory(session: SDDSession | null, newMessage: string): string {
    if (!session || session.messages.length === 0) { return newMessage; }
    const recent = session.messages.slice(-MAX_HISTORY_MESSAGES);
    const historyText = recent
        .map(m => `${m.role === 'user' ? 'DEV' : 'AGENTE'}: ${m.content}`)
        .join('\n\n');
    return `HISTÓRICO DA CONVERSA NESTA SESSÃO:\n${historyText}\n\nNOVA MENSAGEM DO DEV:\n${newMessage}`;
}

/**
 * Executa um turno (mensagem do dev -> resposta da IA -> arquivo salvo) dentro de uma sessão
 * persistente. Reaproveita a mesma montagem de prompt e o mesmo AIClient que o fluxo de um
 * tiro só (executeSDDPhase, em extension.ts) já usa hoje — a diferença é que aqui a troca fica
 * salva em disco e turnos seguintes na mesma sessão enxergam o histórico anterior.
 *
 * `specify` não passa por aqui — o wizard de bootstrap/import de história do PO Agent continua
 * exatamente como está (comando/chat participant). `implement`/`qa-implement` também: abrem o
 * Copilot Chat direto, sem gerar arquivo, então não fazem sentido como turno de sessão.
 */
export async function runPhaseTurn(params: RunPhaseTurnParams): Promise<RunPhaseTurnResult> {
    const { context, outputChannel, token, onStep, onChunk } = params;

    const rootPath = getWorkspaceRoot();
    if (!rootPath) { throw new Error('Nenhum workspace aberto.'); }

    let session = params.sessionId ? loadSession(getSessionsRootDir(rootPath), params.sessionId) : null;
    if (params.sessionId && !session) { throw new Error(`Sessão não encontrada: ${params.sessionId}`); }

    const command = session?.phase ?? params.command;
    if (!command) { throw new Error('command é obrigatório ao criar uma sessão nova.'); }
    if (command === 'specify' || command === 'implement' || command === 'qa-implement') {
        throw new Error(`Fase "${command}" não roda por sessão — use o comando/chat participant existente.`);
    }

    const savedStack = context.workspaceState.get<string>('activeStack');
    const storyDocPath = resolveStoryDocPath(rootPath, context);
    const userStoryPath = path.join(storyDocPath, 'user_story.md');
    const detection = resolveStack(rootPath, userStoryPath, savedStack);
    const stackId = detection.stackId;
    const stackConfig = getStackConfig(stackId);

    const sessionsRootDir = getSessionsRootDir(rootPath);
    if (!session) {
        const storySlug = STORY_SCOPED_PHASES.has(command) ? getActiveStorySlug(context) : undefined;
        const label = PHASE_LABELS[command] ?? command;
        const title = storySlug ? `${storySlug} · ${label}` : label;
        session = createSession(sessionsRootDir, { phase: command, storySlug, stackId, title });
    }

    onStep?.({ sessionId: session.id, step: 'reading-context' });

    const builtinCatalogPath = path.join(context.extensionUri.fsPath, 'catalog');
    const externalCatalogPath = findCatalogPath(rootPath, context.globalState.get<string>('catalogPath') || '');
    const resourcesPath = path.join(context.extensionUri.fsPath, 'resources');

    const foldedInstruction = foldHistory(session, params.userMessage);
    const { systemPrompt, finalPrompt, outputPath } = assembleFinalPrompt({
        command,
        stackId,
        workspaceRoot: rootPath,
        builtinCatalogPath,
        externalCatalogPath,
        resourcesPath,
        userInstruction: foldedInstruction,
        storyDocPath
    });

    const userMsg: SDDSessionMessage = {
        role: 'user',
        content: params.userMessage || '(gerar automaticamente)',
        timestamp: new Date().toISOString()
    };
    session = appendMessage(sessionsRootDir, session.id, userMsg);

    const relOutputPath = path.relative(rootPath, outputPath);

    // Sobrescrita: se esta sessão já é dona do arquivo, aplica direto. Se o arquivo existe
    // com conteúdo real mas não foi esta sessão que gerou, mantém a confirmação de sempre
    // (mesma regra que executeSDDPhase já usa hoje) — não é um "desliga geral" da proteção.
    const alreadyOwnsFile = session.outputFiles.includes(relOutputPath);
    if (!alreadyOwnsFile && fs.existsSync(outputPath)) {
        const existing = fs.readFileSync(outputPath, 'utf8').trim();
        if (existing.length > 100 && !existing.includes('DESCREVA AQUI')) {
            const choice = await vscode.window.showWarningMessage(
                `⚠️ "${path.basename(outputPath)}" já existe com conteúdo.\nSobrescrever com a nova geração?`,
                { modal: true },
                'Sobrescrever', 'Cancelar'
            );
            if (choice !== 'Sobrescrever') {
                const cancelMsg: SDDSessionMessage = {
                    role: 'assistant',
                    content: `Cancelado — "${path.basename(outputPath)}" preservado sem alterações.`,
                    timestamp: new Date().toISOString(),
                    isError: true
                };
                session = appendMessage(sessionsRootDir, session.id, cancelMsg);
                return { session, outputPath, wroteFile: false, cancelled: true };
            }
        }
    }

    onStep?.({ sessionId: session.id, step: 'calling-model' });

    try {
        const { text: fullText, totalTokens, credits } = await AIClient.sendPrompt(
            systemPrompt, finalPrompt, outputChannel, token, onChunk, getPhaseType(command)
        );

        let mdToSave = fullText;
        let htmlReportPath: string | null = null;
        let htmlReportContent: string | null = null;
        if (command === 'qa-report' || command === 'qa-coverage') {
            const { html, rest } = extractHtmlBlock(fullText);
            if (html) {
                mdToSave = rest.trim() + '\n';
                htmlReportPath = outputPath.replace(/\.md$/, '.html');
                htmlReportContent = html;
            }
        }

        onStep?.({ sessionId: session.id, step: 'writing-file', detail: relOutputPath });
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) { fs.mkdirSync(outputDir, { recursive: true }); }
        fs.writeFileSync(outputPath, mdToSave);
        if (htmlReportPath && htmlReportContent) { fs.writeFileSync(htmlReportPath, htmlReportContent); }

        const assistantMsg: SDDSessionMessage = {
            role: 'assistant',
            content: fullText,
            timestamp: new Date().toISOString(),
            tokens: totalTokens,
            credits
        };
        session = appendMessage(sessionsRootDir, session.id, assistantMsg);
        session = recordOutputFile(sessionsRootDir, session.id, relOutputPath);
        if (htmlReportPath) { session = recordOutputFile(sessionsRootDir, session.id, path.relative(rootPath, htmlReportPath)); }

        await trackEvent(context, outputChannel, {
            event: 'session_turn_completed',
            command,
            stack: stackId,
            tokens: totalTokens,
            credits: credits ?? 0
        });

        onStep?.({ sessionId: session.id, step: 'done' });
        return { session, outputPath, wroteFile: true, cancelled: false };
    } catch (error: any) {
        const errorMsg: SDDSessionMessage = {
            role: 'assistant',
            content: `Erro: ${error.message || error}`,
            timestamp: new Date().toISOString(),
            isError: true
        };
        session = appendMessage(sessionsRootDir, session.id, errorMsg);
        onStep?.({ sessionId: session.id, step: 'error', detail: error.message || String(error) });
        outputChannel.appendLine(`[Motor ERRO] ${error.message || error}`);
        return { session, outputPath, wroteFile: false, cancelled: false };
    }
}
