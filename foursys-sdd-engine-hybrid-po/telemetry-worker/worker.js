// Cloudflare Worker — recebe eventos de uso da extensão e grava como log no GitHub.
// Config necessária (Worker → Settings → Variables and Secrets):
//   GITHUB_TOKEN  (secret)   fine-grained PAT, escopo só no repo de telemetria, permissão "Contents: Read and write"
//   GITHUB_REPO   (variável) ex: "danielbissacot/sdd-telemetry-data"
//   GITHUB_BRANCH (variável, opcional) default "main"

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

async function appendEventLine(env, filePath, line) {
    const branch = env.GITHUB_BRANCH || 'main';

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

    if (!putRes.ok) {
        throw new Error(`Falha ao gravar ${filePath}: ${putRes.status} ${await putRes.text()}`);
    }
}

export default {
    async fetch(request, env) {
        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
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
