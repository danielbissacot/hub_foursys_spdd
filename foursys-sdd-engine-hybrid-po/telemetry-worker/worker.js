// Cloudflare Worker — recebe eventos de uso da extensão (POST) e serve o snapshot
// agregado pro dashboard local (GET), sempre gravando/lendo o log no GitHub.
// Config necessária (Worker → Settings → Variables and Secrets):
//   GITHUB_TOKEN          (secret)   fine-grained PAT, escopo só no repo de telemetria, permissão "Contents: Read and write"
//   GITHUB_REPO           (variável) ex: "danielbissacot/sdd-telemetry-data"
//   GITHUB_BRANCH         (variável, opcional) default "main"
//   SHARED_SECRET         (secret)   valor arbitrário; precisa bater com o header X-Foursys-Token
//                                    enviado pela extensão (src/telemetry.ts) em requisições POST. Não é
//                                    autenticação forte — só um freio simples contra escrita trivial.
//   DASHBOARD_READ_SECRET (secret)   valor arbitrário, diferente do SHARED_SECRET; precisa bater com o
//                                    header X-Foursys-Token em requisições GET (botão "Atualizar dados" do
//                                    dashboard, ver foursys-sdd-engine-hibrid-dashboard/generate-report.js).
//                                    Sem essa variável configurada, GET fica sempre bloqueado (seguro por padrão) —
//                                    esse endpoint devolve e-mails reais, então nunca fica aberto sem token.

const AUTH_HEADER = 'X-Foursys-Token';
const APPEND_RETRIES = 4;
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Foursys-Token'
};

function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(b64) {
    return decodeURIComponent(escape(atob(b64)));
}

async function githubRequest(env, path, options = {}) {
    const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'foursys-sdd-telemetry-worker',
            ...(options.headers || {})
        }
    });
    return res;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// GET (pega o sha atual) → PUT (grava com esse sha) não é atômico: se dois eventos
// chegarem quase juntos, o segundo PUT pode ser rejeitado por sha desatualizado
// (409/422). Em vez de perder o evento, tenta de novo lendo o sha mais recente.
async function appendEventLine(env, filePath, line) {
    const branch = env.GITHUB_BRANCH || 'main';

    for (let attempt = 1; attempt <= APPEND_RETRIES; attempt++) {
        const getRes = await githubRequest(env, `${filePath}?ref=${branch}`);
        let existingContent = '';
        let sha;
        if (getRes.status === 200) {
            const data = await getRes.json();
            sha = data.sha;
            existingContent = base64ToUtf8(data.content);
        } else if (getRes.status !== 404) {
            throw new Error(`Falha ao ler ${filePath}: ${getRes.status} ${await getRes.text()}`);
        }

        const newContent = existingContent + line + '\n';
        const putRes = await githubRequest(env, filePath, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `telemetry: evento ${new Date().toISOString()}`,
                content: utf8ToBase64(newContent),
                branch,
                ...(sha ? { sha } : {})
            })
        });

        if (putRes.ok) {
            return;
        }

        const isConflict = putRes.status === 409 || putRes.status === 422;
        if (!isConflict || attempt === APPEND_RETRIES) {
            throw new Error(`Falha ao gravar ${filePath}: ${putRes.status} ${await putRes.text()}`);
        }

        await sleep(attempt * 300);
    }
}

async function fetchAllEvents(env) {
    const branch = env.GITHUB_BRANCH || 'main';
    const listRes = await githubRequest(env, `?ref=${branch}`);
    if (!listRes.ok) {
        throw new Error(`Falha ao listar arquivos: ${listRes.status} ${await listRes.text()}`);
    }
    const entries = await listRes.json();
    const eventFiles = entries.filter((e) => /^events-\d{4}-\d{2}\.jsonl$/.test(e.name));

    const events = [];
    for (const file of eventFiles) {
        const fileRes = await githubRequest(env, `${file.name}?ref=${branch}`);
        if (!fileRes.ok) { continue; }
        const data = await fileRes.json();
        const content = base64ToUtf8(data.content);
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed) { continue; }
            try { events.push(JSON.parse(trimmed)); } catch { /* linha inválida ignorada */ }
        }
    }
    return events;
}

export default {
    async fetch(request, env) {
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }

        if (request.method === 'GET') {
            // Sem DASHBOARD_READ_SECRET configurado, GET fica sempre bloqueado — esse
            // endpoint devolve e-mails reais, nunca abre por padrão.
            if (!env.DASHBOARD_READ_SECRET || request.headers.get(AUTH_HEADER) !== env.DASHBOARD_READ_SECRET) {
                return new Response('Unauthorized', { status: 401, headers: CORS_HEADERS });
            }
            try {
                const events = await fetchAllEvents(env);
                return new Response(JSON.stringify(events), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
                });
            } catch (err) {
                console.error(err.message);
                return new Response('Erro ao buscar eventos', { status: 500, headers: CORS_HEADERS });
            }
        }

        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
        }

        if (env.SHARED_SECRET && request.headers.get(AUTH_HEADER) !== env.SHARED_SECRET) {
            return new Response('Unauthorized', { status: 401, headers: CORS_HEADERS });
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return new Response('JSON inválido', { status: 400 });
        }

        const { email, event, command, stack, tokens, credits, version, ts } = body;
        if (!email || !event) {
            return new Response('Campos obrigatórios: email, event', { status: 400 });
        }

        const line = JSON.stringify({
            email,
            event,
            command: command || '',
            stack: stack || '',
            tokens: Number(tokens) || 0,
            credits: Number(credits) || 0,
            version: version || '',
            ts: ts || new Date().toISOString()
        });

        // Um arquivo por mês, pra não crescer um único arquivo indefinidamente.
        const monthKey = (ts ? new Date(ts) : new Date()).toISOString().slice(0, 7); // YYYY-MM
        const filePath = `events-${monthKey}.jsonl`;

        try {
            await appendEventLine(env, filePath, line);
            return new Response('OK', { status: 200 });
        } catch (err) {
            console.error(err.message);
            return new Response('Erro ao gravar evento', { status: 500 });
        }
    }
};
