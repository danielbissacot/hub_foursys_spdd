import * as vscode from 'vscode';
import * as https from 'https';

const EMAIL_KEY = 'telemetry.email';
const OPTOUT_KEY = 'telemetry.optOut';

const TELEMETRY_ENDPOINT = 'https://foursys-sdd-telemetry.foursys-sdd.workers.dev';

const CONSENT_PROMPT =
    'Usamos seu e-mail para medir adoção da extensão Foursys SDD Hybrid PO (quem usa, qual stack) e não compartilhamos com terceiros. ' +
    'Você pode desativar quando quiser com o comando "Foursys: Desativar Telemetria".';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

interface TelemetryEvent {
    event: string;
    command?: string;
    stack?: string;
    /** Estimativa client-side (via model.countTokens do VS Code) — não é o uso oficial do provedor. */
    tokens?: number;
    /** Estimativa em créditos, calculada a partir da tabela pública de preços do GitHub Copilot — não é o valor exato cobrado da conta. */
    credits?: number;
}

async function promptForEmail(title: string): Promise<string | undefined> {
    const email = await vscode.window.showInputBox({
        title,
        prompt: CONSENT_PROMPT,
        placeHolder: 'seu.nome@foursys.com',
        ignoreFocusOut: true,
        validateInput: (v) => (EMAIL_REGEX.test(v.trim()) ? null : 'Informe um e-mail válido')
    });
    return email?.trim() || undefined;
}

async function ensureConsent(context: vscode.ExtensionContext): Promise<string | undefined> {
    if (context.globalState.get<boolean>(OPTOUT_KEY)) { return undefined; }

    const existing = context.globalState.get<string>(EMAIL_KEY);
    if (existing) { return existing; }

    const email = await promptForEmail('Foursys SDD Hybrid — Telemetria de Uso');
    if (!email) { return undefined; }

    await context.globalState.update(EMAIL_KEY, email);
    return email;
}

function sendEvent(payload: string, log: (msg: string) => void): void {
    if (!TELEMETRY_ENDPOINT) { return; }
    try {
        const endpoint = new URL(TELEMETRY_ENDPOINT);
        const options = {
            hostname: endpoint.hostname,
            port: endpoint.port || 443,
            path: endpoint.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };
        const req = https.request(options, (res) => { res.on('data', () => { /* ignora corpo da resposta */ }); });
        req.on('error', (e) => log(`[Telemetria] Falha ao enviar evento (ignorado): ${e.message}`));
        req.write(payload);
        req.end();
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        log(`[Telemetria] Erro inesperado ao enviar evento (ignorado): ${msg}`);
    }
}

/**
 * Registra um evento de uso (clique de botão, skill, fase SDD...), com consentimento explícito.
 * Só envia se: (1) telemetria geral do VS Code está ligada e (2) o usuário não desativou nem recusou informar e-mail.
 */
export async function trackEvent(
    context: vscode.ExtensionContext,
    outputChannel: vscode.OutputChannel | undefined,
    data: TelemetryEvent
): Promise<void> {
    if (!vscode.env.isTelemetryEnabled) { return; }
    if (context.globalState.get<boolean>(OPTOUT_KEY)) { return; }

    const email = await ensureConsent(context);
    if (!email) { return; }

    const payload = JSON.stringify({
        email,
        event: data.event,
        command: data.command ?? '',
        stack: data.stack ?? '',
        tokens: data.tokens ?? 0,
        credits: data.credits ?? 0,
        version: context.extension.packageJSON.version,
        ts: new Date().toISOString()
    });

    const log = outputChannel ? (msg: string) => outputChannel.appendLine(msg) : (msg: string) => console.error(msg);
    sendEvent(payload, log);
}

export async function optOutTelemetry(context: vscode.ExtensionContext): Promise<void> {
    // Manda um último evento avisando o opt-out (só se já havia e-mail salvo) — depois disso, nada mais é enviado.
    if (context.globalState.get<string>(EMAIL_KEY)) {
        await trackEvent(context, undefined, { event: 'telemetry_opted_out' });
    }
    await context.globalState.update(OPTOUT_KEY, true);
    vscode.window.showInformationMessage('🔒 Telemetria de uso desativada. Nenhum evento será mais enviado.');
}

export async function setTelemetryEmail(context: vscode.ExtensionContext): Promise<void> {
    const email = await promptForEmail('Foursys SDD Hybrid — Atualizar e-mail de telemetria');
    if (!email) { return; }
    await context.globalState.update(EMAIL_KEY, email);
    await context.globalState.update(OPTOUT_KEY, false);
    vscode.window.showInformationMessage('✅ E-mail de telemetria atualizado.');
}
