import * as vscode from 'vscode';

// Trava de acesso: o Hub e ferramenta interna Foursys, entao so roda pra quem informa um
// e-mail @foursys.com.br. Isto NAO e seguranca forte — a caixa aceita qualquer texto que
// termine no dominio, ninguem confere se o e-mail existe. Serve pra impedir uso casual fora
// da Foursys; controle real dependeria de SSO (em avaliacao com infra).
//
// Limite conhecido: skills ja copiadas pra ~/.copilot/skills por "Sincronizar Copilot Pessoal"
// continuam funcionando no IntelliJ/Copilot nativo sem passar por aqui — a trava alcanca a
// extensao do VS Code, nao arquivo que ja esta na maquina.

const ACCESS_EMAIL_KEY = 'access.email';
const ACCESS_UNLOCK_KEY = 'access.unlockedByCode';
const TELEMETRY_EMAIL_KEY = 'telemetry.email';   // mesma chave usada por telemetry.ts

const ALLOWED_DOMAIN = '@foursys.com.br';

// Escape hatch pra quem e da Foursys mas esta em maquina de cliente sem e-mail corporativo
// configurado. Vai embutido no .vsix (que e um zip), entao quem abrir o pacote acha — assim
// como o token de telemetria. E freio pra caso excepcional, nao segredo forte.
const UNLOCK_CODE = 'FOURSYS-HUB-2026';

const BLOCKED_MESSAGE =
    'O Foursys SDD Hub e de uso interno da Foursys e precisa de um e-mail @foursys.com.br.';
const BLOCKED_HINT =
    'Se voce e da Foursys e esta em ambiente de cliente, peca o codigo de liberacao ao time do Hub ' +
    'e rode "Foursys: Liberar Acesso" na paleta de comandos (Ctrl+Shift+P).';

// Exige pelo menos um caractere antes do @ — endsWith sozinho aceitava "@foursys.com.br"
// digitado sem nome nenhum.
const FOURSYS_EMAIL = /^[^\s@]+@foursys\.com\.br$/i;

function isFoursysEmail(email: string | undefined): boolean {
    return !!email && FOURSYS_EMAIL.test(email.trim());
}

/** True se esta maquina ja passou pela validacao — por e-mail valido ou por codigo. */
export function hasAccess(context: vscode.ExtensionContext): boolean {
    if (context.globalState.get<boolean>(ACCESS_UNLOCK_KEY)) { return true; }
    return isFoursysEmail(context.globalState.get<string>(ACCESS_EMAIL_KEY));
}

/**
 * Porteiro de toda acao do Hub. Retorna true se pode seguir.
 *
 * Pergunta o e-mail UMA vez por maquina (fica salvo em globalState). Se a pessoa ja informou
 * um e-mail @foursys.com.br pra telemetria, aproveita esse e nem pergunta.
 */
/** Prompt em andamento. Abrir o Hub dispara a checagem e clicar num botao dispara outra —
 *  sem isto, as duas abriam caixa de e-mail e a pessoa respondia duas vezes seguidas. */
let perguntaEmAndamento: Promise<boolean> | null = null;

export async function ensureFoursysAccess(context: vscode.ExtensionContext): Promise<boolean> {
    if (hasAccess(context)) { return true; }
    if (perguntaEmAndamento) { return perguntaEmAndamento; }

    perguntaEmAndamento = perguntarEValidar(context).finally(() => { perguntaEmAndamento = null; });
    return perguntaEmAndamento;
}

async function perguntarEValidar(context: vscode.ExtensionContext): Promise<boolean> {
    // Reaproveita o e-mail da telemetria quando ele ja e Foursys — evita perguntar duas vezes
    // a mesma coisa pra quem ja respondeu.
    const doTelemetria = context.globalState.get<string>(TELEMETRY_EMAIL_KEY);
    if (isFoursysEmail(doTelemetria)) {
        await context.globalState.update(ACCESS_EMAIL_KEY, doTelemetria!.trim().toLowerCase());
        return true;
    }

    const informado = await vscode.window.showInputBox({
        title: 'Foursys SDD Hub — acesso',
        prompt: `Informe seu e-mail corporativo (${ALLOWED_DOMAIN}) para usar o Hub.`,
        placeHolder: `seu.nome${ALLOWED_DOMAIN}`,
        ignoreFocusOut: true,
        validateInput: (v) =>
            isFoursysEmail(v) ? null : `Use seu e-mail ${ALLOWED_DOMAIN}.`
    });

    if (!isFoursysEmail(informado)) {
        // Cobre tanto cancelar (Esc) quanto fechar sem preencher.
        vscode.window.showWarningMessage(`${BLOCKED_MESSAGE} ${BLOCKED_HINT}`);
        return false;
    }

    await context.globalState.update(ACCESS_EMAIL_KEY, informado!.trim().toLowerCase());
    return true;
}

/** Comando "Foursys: Liberar Acesso" — destrava esta maquina via codigo, sem e-mail Foursys. */
export async function unlockAccessWithCode(context: vscode.ExtensionContext): Promise<void> {
    if (context.globalState.get<boolean>(ACCESS_UNLOCK_KEY)) {
        vscode.window.showInformationMessage('✅ Este equipamento ja esta liberado.');
        return;
    }

    const codigo = await vscode.window.showInputBox({
        title: 'Foursys SDD Hub — liberar acesso',
        prompt: 'Cole o codigo de liberacao fornecido pelo time do Hub.',
        ignoreFocusOut: true,
        password: true
    });

    if (!codigo) { return; }

    if (codigo.trim() !== UNLOCK_CODE) {
        vscode.window.showErrorMessage('❌ Codigo invalido. Fale com o time do Hub.');
        return;
    }

    await context.globalState.update(ACCESS_UNLOCK_KEY, true);
    vscode.window.showInformationMessage('✅ Acesso liberado neste equipamento.');
}
