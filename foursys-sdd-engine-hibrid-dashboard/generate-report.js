#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO || 'danielbissacot/sdd-telemetry-data';

if (!GITHUB_TOKEN) {
    console.error('Erro: defina a variável de ambiente GITHUB_TOKEN antes de rodar.');
    console.error('Exemplo (PowerShell): $env:GITHUB_TOKEN="seu_token"; node generate-report.js');
    process.exit(1);
}

function githubRequest(apiPath) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: apiPath,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'foursys-sdd-telemetry-dashboard'
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    reject(new Error(`GitHub API ${apiPath} -> ${res.statusCode}: ${data}`));
                    return;
                }
                resolve(JSON.parse(data));
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function fetchAllEvents() {
    const entries = await githubRequest(`/repos/${REPO}/contents/`);
    const eventFiles = entries.filter(e => /^events-\d{4}-\d{2}\.jsonl$/.test(e.name));

    const events = [];
    for (const file of eventFiles) {
        const fileData = await githubRequest(`/repos/${REPO}/contents/${file.name}`);
        const content = Buffer.from(fileData.content, 'base64').toString('utf8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed) { continue; }
            try {
                events.push(JSON.parse(trimmed));
            } catch {
                console.warn(`Linha inválida ignorada em ${file.name}: ${trimmed.slice(0, 80)}...`);
            }
        }
    }
    return events;
}

function renderHtml(events) {
    const embeddedEvents = JSON.stringify(events);
    const generatedAt = new Date().toLocaleString('pt-BR');

    return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Foursys SDD Hybrid — Dashboard de Telemetria</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
  /* Tema único, igual ao painel real da extensão (sidebar-provider.ts / protótipo v1.1.2):
     fundo #1a1a2e, painéis #252526, bordas #3c3c3c, texto #cccccc, destaque laranja #ff6b00.
     Categóricas ajustadas (L/C) a partir das cores reais de cada stack pra passar nos 6
     checks de acessibilidade do skill de dataviz, validado contra a superfície #252526. */
  :root {
    --surface: #252526; --page: #1a1a2e; --text-primary: #cccccc;
    --text-secondary: #999999; --text-muted: #777777; --gridline: #3c3c3c;
    --border: #3c3c3c;
    --s-orange: #ec5a00; --s-blue: #2f95e4; --s-green: #50a555; --s-purple: #b076ba;
    --s-red: #f44336; --s-teal: #00a59c; --s-amber: #c37f00; --s-periwinkle: #658fd5;
    --brand-orange: #ff6b00; --status-good: #4caf50;
  }
  body { background: var(--page); color: var(--text-primary); font-family: system-ui,-apple-system,"Segoe UI",sans-serif; }
  .topbar { position: sticky; top: 0; z-index: 20; background: var(--surface); border-bottom: 1px solid var(--border); border-top: 3px solid var(--brand-orange); }
  h1 { color: var(--brand-orange); }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.35); }
  .card:hover { box-shadow: 0 6px 22px rgba(0,0,0,.45); transition: box-shadow .15s ease; }
  .card-title { font-weight: 600; font-size: .8rem; text-transform: uppercase; letter-spacing: .05em; color: var(--text-secondary); }
  .stat-tile .icon { font-size: 1.5rem; line-height: 1; }
  .stat-tile .value { font-size: 2rem; font-weight: 600; color: var(--text-primary); }
  .stat-tile .label { color: var(--text-secondary); font-size: .85rem; }
  .text-muted { color: var(--text-muted) !important; }
  .table { color: var(--text-primary); }
  .table thead th { color: var(--text-secondary); font-weight: 600; border-bottom-color: var(--gridline); }
  .table td, .table th { border-color: var(--gridline); }
  .table-striped > tbody > tr:nth-of-type(odd) > * { background: rgba(255,255,255,.03); color: var(--text-primary); }
  .table-hover tbody tr:hover { background: rgba(255,107,0,.06); }
  .toggle-table-btn { font-size: .8rem; color: var(--brand-orange); }
  .hidden-table { display: none; }
  .btn-primary { background-color: var(--brand-orange) !important; border-color: var(--brand-orange) !important; }
  .btn-primary:hover { filter: brightness(1.1); }
  .form-control { background: var(--page) !important; border-color: var(--border) !important; color: var(--text-primary) !important; }
  .form-control::placeholder { color: var(--text-muted); }
  .badge.bg-secondary { background: #555 !important; }
</style>
</head>
<body>
<div class="topbar py-3 mb-4">
  <div class="container d-flex flex-wrap align-items-center justify-content-between gap-2">
    <div>
      <h1 class="h4 mb-0">Foursys SDD Hybrid PO — Dashboard de Telemetria</h1>
      <p class="text-muted small mb-0" id="sourceInfo">Snapshot gerado em ${generatedAt} — fonte: repositório - Foursys HUB</p>
    </div>
    <div class="d-flex align-items-center gap-2">
      <span id="refreshStatus" class="text-muted small"></span>
      <button id="refreshBtn" class="btn btn-primary btn-sm">🔄 Atualizar dados</button>
    </div>
  </div>
</div>

<div class="container pb-5">
    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 mb-4" id="summaryCards"></div>

    <div class="row g-4 mb-4">
        <div class="col-lg-6">
            <div class="card h-100"><div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h2 class="card-title mb-0">Eventos por Stack</h2>
                  <button class="btn btn-link toggle-table-btn p-0" data-toggle-table="stackTable">Ver tabela</button>
                </div>
                <canvas id="chartStackEvents" height="220"></canvas>
                <div class="table-responsive hidden-table mt-3" id="stackTable">
                    <table class="table table-sm">
                        <thead><tr><th>Stack</th><th>Eventos</th><th>Tokens</th><th>Créditos (estimado)</th></tr></thead>
                        <tbody id="stackRows"></tbody>
                    </table>
                </div>
            </div></div>
        </div>
        <div class="col-lg-6">
            <div class="card h-100"><div class="card-body">
                <h2 class="card-title mb-2">Tokens por Stack</h2>
                <canvas id="chartStackTokens" height="220"></canvas>
            </div></div>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-lg-6">
            <div class="card h-100"><div class="card-body">
                <h2 class="card-title mb-1">Eventos por Tipo</h2>
                <p class="text-muted small mb-2">Inclui cliques e conclusões separadamente — é normal um "clicada/executada" ter um par "concluída" quase igual.</p>
                <canvas id="chartEventTypes" height="220"></canvas>
            </div></div>
        </div>
        <div class="col-lg-6">
            <div class="card h-100"><div class="card-body">
                <h2 class="card-title mb-2">Top Comandos / Skills</h2>
                <canvas id="chartTopCommands" height="220"></canvas>
            </div></div>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-12">
            <div class="card"><div class="card-body">
                <h2 class="card-title mb-2">Eventos por Dia (tendência de adoção)</h2>
                <canvas id="chartTimeline" height="100"></canvas>
            </div></div>
        </div>
    </div>

    <div class="card mb-4">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <h2 class="card-title mb-0">Uso por Pessoa</h2>
              <input type="search" id="personFilter" class="form-control form-control-sm" style="max-width:220px" placeholder="Filtrar por e-mail...">
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-hover table-sm">
                    <thead><tr><th>E-mail</th><th>Eventos</th><th>Tokens</th><th>Créditos (estimado)</th><th>Último uso</th><th>Opt-out</th></tr></thead>
                    <tbody id="personRows"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
<script>
const REPO = ${JSON.stringify(REPO)};
const embeddedToken = ${JSON.stringify(GITHUB_TOKEN)};
const embeddedEvents = ${embeddedEvents};
let charts = {};

const root = getComputedStyle(document.documentElement);
const cssVar = (name) => root.getPropertyValue(name).trim();
const SERIES = ['--s-orange', '--s-blue', '--s-green', '--s-amber', '--s-teal', '--s-purple', '--s-red', '--s-periwinkle'].map(cssVar);
const GRIDLINE = cssVar('--gridline');
const TEXT_MUTED = cssVar('--text-muted');
const colorFor = (index) => SERIES[index % SERIES.length];

if (window.Chart && window.ChartDataLabels) { Chart.register(ChartDataLabels); }
Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", sans-serif';
Chart.defaults.color = TEXT_MUTED;

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

const EVENT_TYPE_LABELS = {
    command_executed: 'Fase SDD executada (clique)',
    phase_completed: 'Fase SDD concluída',
    skill_clicked: 'Skill clicada',
    skill_completed: 'Skill concluída',
    playbook_clicked: 'Playbook clicado',
    playbook_completed: 'Playbook concluído',
    stack_selected: 'Stack selecionada',
    telemetry_opted_out: 'Desativou telemetria'
};

// Cada ação bem-sucedida gera 2 eventos: um no clique (command_executed/skill_clicked/
// playbook_clicked, tokens:0) e um na conclusão (phase_completed/skill_completed/
// playbook_completed, com os tokens reais). Contar os dois nas métricas de volume
// dobraria o número de "eventos" por ação — então as métricas de volume (total,
// por stack, por pessoa, por dia, top comandos) usam só os eventos "definitivos"
// abaixo. "Eventos por Tipo" continua mostrando todos, propositalmente (é o único
// lugar que compara clique vs. conclusão).
const CLICK_ONLY_EVENTS = new Set(['command_executed', 'skill_clicked', 'playbook_clicked']);

function aggregate(events) {
    const byStack = new Map();
    const byPerson = new Map();
    const byDay = new Map();
    const byEventType = new Map();
    const byCommand = new Map();
    const uniqueEmails = new Set();
    let totalTokens = 0;
    let totalCredits = 0;
    let volumeEventCount = 0;

    for (const ev of events) {
        const email = ev.email || 'desconhecido';
        const stack = ev.stack || 'unknown';
        const tokens = Number(ev.tokens) || 0;
        const credits = Number(ev.credits) || 0;
        const day = (ev.ts || '').slice(0, 10);
        const isVolumeEvent = !CLICK_ONLY_EVENTS.has(ev.event);

        uniqueEmails.add(email);

        if (!byPerson.has(email)) byPerson.set(email, { events: 0, tokens: 0, credits: 0, lastSeen: '', optedOut: false });
        const p = byPerson.get(email);
        if (ev.ts && ev.ts > p.lastSeen) p.lastSeen = ev.ts;
        if (ev.event === 'telemetry_opted_out') p.optedOut = true;

        const typeLabel = EVENT_TYPE_LABELS[ev.event] || ev.event || 'desconhecido';
        byEventType.set(typeLabel, (byEventType.get(typeLabel) || 0) + 1);

        if (!isVolumeEvent) { continue; }

        volumeEventCount += 1;
        totalTokens += tokens;
        totalCredits += credits;
        p.events += 1;
        p.tokens += tokens;
        p.credits += credits;

        if (!byStack.has(stack)) byStack.set(stack, { events: 0, tokens: 0, credits: 0 });
        const s = byStack.get(stack);
        s.events += 1;
        s.tokens += tokens;
        s.credits += credits;

        if (day) byDay.set(day, (byDay.get(day) || 0) + 1);

        if (ev.command) { byCommand.set(ev.command, (byCommand.get(ev.command) || 0) + 1); }
    }

    return {
        totalEvents: volumeEventCount,
        uniqueEmails: uniqueEmails.size,
        totalTokens,
        totalCredits,
        optedOutCount: [...byPerson.values()].filter(p => p.optedOut).length,
        byStack: [...byStack.entries()].sort((a, b) => b[1].events - a[1].events),
        byPerson: [...byPerson.entries()].sort((a, b) => b[1].events - a[1].events),
        byDay: [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0])),
        byEventType: [...byEventType.entries()].sort((a, b) => b[1] - a[1]),
        topCommands: [...byCommand.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
    };
}

const BAR_OPTS_BASE = {
    responsive: true,
    plugins: {
        legend: { display: false },
        datalabels: { anchor: 'end', align: 'end', color: TEXT_MUTED, font: { weight: '600' } }
    },
    scales: {
        x: { grid: { display: false }, ticks: { color: TEXT_MUTED } },
        y: { beginAtZero: true, grid: { color: GRIDLINE }, ticks: { color: TEXT_MUTED, precision: 0 } }
    }
};

const HBAR_OPTS_BASE = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
        legend: { display: false },
        datalabels: { anchor: 'end', align: 'end', color: TEXT_MUTED, font: { weight: '600' } }
    },
    scales: {
        x: { beginAtZero: true, grid: { color: GRIDLINE }, ticks: { color: TEXT_MUTED, precision: 0 } },
        y: { grid: { display: false }, ticks: { color: TEXT_MUTED } }
    }
};

function upsertChart(key, canvasId, config) {
    if (charts[key]) {
        charts[key].data = config.data;
        charts[key].update();
    } else {
        charts[key] = new Chart(document.getElementById(canvasId), config);
    }
}

function renderDashboard(events) {
    const stats = aggregate(events);

    document.getElementById('summaryCards').innerHTML = \`
        <div class="col"><div class="card stat-tile h-100"><div class="card-body d-flex align-items-center gap-3">
            <div class="icon">📊</div><div><div class="value">\${stats.totalEvents}</div><div class="label">Ações concluídas</div></div>
        </div></div></div>
        <div class="col"><div class="card stat-tile h-100"><div class="card-body d-flex align-items-center gap-3">
            <div class="icon">👥</div><div><div class="value">\${stats.uniqueEmails}</div><div class="label">Pessoas únicas</div></div>
        </div></div></div>
        <div class="col"><div class="card stat-tile h-100"><div class="card-body d-flex align-items-center gap-3">
            <div class="icon">🔤</div><div><div class="value">\${stats.totalTokens.toLocaleString('pt-BR')}</div><div class="label">Tokens (estimado)</div></div>
        </div></div></div>
        <div class="col"><div class="card stat-tile h-100"><div class="card-body d-flex align-items-center gap-3">
            <div class="icon">💰</div><div><div class="value">\${stats.totalCredits.toFixed(3)}</div><div class="label">Créditos (estimado)</div></div>
        </div></div></div>
        <div class="col"><div class="card stat-tile h-100"><div class="card-body d-flex align-items-center gap-3">
            <div class="icon">🚫</div><div><div class="value">\${stats.optedOutCount}</div><div class="label">Desativaram telemetria</div></div>
        </div></div></div>\`;

    document.getElementById('personRows').innerHTML = stats.byPerson.map(([email, p]) => \`
        <tr data-email="\${escapeHtml(email.toLowerCase())}">
            <td>\${escapeHtml(email)}</td>
            <td>\${p.events}</td>
            <td>\${p.tokens}</td>
            <td>\${p.credits.toFixed(3)}</td>
            <td>\${escapeHtml(p.lastSeen ? p.lastSeen.replace('T', ' ').slice(0, 16) : '-')}</td>
            <td>\${p.optedOut ? '<span class="badge bg-secondary">Sim</span>' : '<span class="badge" style="background:var(--status-good)">Não</span>'}</td>
        </tr>\`).join('');

    document.getElementById('stackRows').innerHTML = stats.byStack.map(([stack, v]) => \`
        <tr><td>\${escapeHtml(stack)}</td><td>\${v.events}</td><td>\${v.tokens}</td><td>\${v.credits.toFixed(3)}</td></tr>\`).join('');

    const stackLabels = stats.byStack.map(([k]) => k);
    const stackColors = stackLabels.map((_, i) => colorFor(i));
    const stackEventCounts = stats.byStack.map(([, v]) => v.events);
    const stackTokenCounts = stats.byStack.map(([, v]) => v.tokens);
    const dayLabels = stats.byDay.map(([k]) => k);
    const dayCounts = stats.byDay.map(([, v]) => v);
    const eventTypeLabels = stats.byEventType.map(([k]) => k);
    const eventTypeCounts = stats.byEventType.map(([, v]) => v);
    const eventTypeColors = eventTypeLabels.map((_, i) => colorFor(i));
    const commandLabels = stats.topCommands.map(([k]) => k);
    const commandCounts = stats.topCommands.map(([, v]) => v);

    upsertChart('stackEvents', 'chartStackEvents', {
        type: 'bar',
        data: { labels: stackLabels, datasets: [{ label: 'Eventos', data: stackEventCounts, backgroundColor: stackColors, borderRadius: 4, maxBarThickness: 28 }] },
        options: BAR_OPTS_BASE
    });

    upsertChart('stackTokens', 'chartStackTokens', {
        type: 'bar',
        data: { labels: stackLabels, datasets: [{ label: 'Tokens', data: stackTokenCounts, backgroundColor: stackColors, borderRadius: 4, maxBarThickness: 28 }] },
        options: BAR_OPTS_BASE
    });

    upsertChart('eventTypes', 'chartEventTypes', {
        type: 'bar',
        data: { labels: eventTypeLabels, datasets: [{ label: 'Eventos', data: eventTypeCounts, backgroundColor: eventTypeColors, borderRadius: 4, maxBarThickness: 22 }] },
        options: HBAR_OPTS_BASE
    });

    upsertChart('topCommands', 'chartTopCommands', {
        type: 'bar',
        data: { labels: commandLabels, datasets: [{ label: 'Usos', data: commandCounts, backgroundColor: cssVar('--s-blue'), borderRadius: 4, maxBarThickness: 22 }] },
        options: HBAR_OPTS_BASE
    });

    upsertChart('timeline', 'chartTimeline', {
        type: 'line',
        data: { labels: dayLabels, datasets: [{
            label: 'Eventos', data: dayCounts, borderColor: cssVar('--s-blue'), backgroundColor: cssVar('--s-blue') + '1a',
            fill: true, tension: 0.25, borderWidth: 2, pointRadius: 4, pointBackgroundColor: cssVar('--s-blue'),
            pointBorderColor: cssVar('--surface'), pointBorderWidth: 2
        }] },
        options: {
            responsive: true,
            plugins: { legend: { display: false }, datalabels: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: TEXT_MUTED } },
                y: { beginAtZero: true, grid: { color: GRIDLINE }, ticks: { color: TEXT_MUTED, precision: 0 } }
            }
        }
    });
}

document.querySelectorAll('[data-toggle-table]').forEach(btn => {
    btn.addEventListener('click', () => {
        const el = document.getElementById(btn.dataset.toggleTable);
        const showing = el.style.display === 'block';
        el.style.display = showing ? 'none' : 'block';
        btn.textContent = showing ? 'Ver tabela' : 'Ocultar tabela';
    });
});

document.getElementById('personFilter').addEventListener('input', (e) => {
    const term = e.target.value.trim().toLowerCase();
    document.querySelectorAll('#personRows tr').forEach(tr => {
        tr.style.display = tr.dataset.email.includes(term) ? '' : 'none';
    });
});

async function fetchFreshEvents(token) {
    const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json' };
    const listRes = await fetch('https://api.github.com/repos/' + REPO + '/contents/', { headers });
    if (!listRes.ok) throw new Error('Falha ao listar arquivos (' + listRes.status + '). Verifique o token.');
    const entries = await listRes.json();
    const eventFiles = entries.filter(e => /^events-\\d{4}-\\d{2}\\.jsonl$/.test(e.name));

    const events = [];
    for (const file of eventFiles) {
        const fileRes = await fetch('https://api.github.com/repos/' + REPO + '/contents/' + file.name, { headers });
        if (!fileRes.ok) throw new Error('Falha ao ler ' + file.name + ' (' + fileRes.status + ')');
        const fileData = await fileRes.json();
        const content = decodeURIComponent(escape(atob(fileData.content)));
        for (const line of content.split('\\n')) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try { events.push(JSON.parse(trimmed)); } catch { /* linha inválida ignorada */ }
        }
    }
    return events;
}

document.getElementById('refreshBtn').addEventListener('click', async () => {
    const status = document.getElementById('refreshStatus');

    status.textContent = 'Buscando dados...';
    document.getElementById('refreshBtn').disabled = true;
    try {
        const events = await fetchFreshEvents(embeddedToken);
        renderDashboard(events);
        document.getElementById('sourceInfo').textContent =
            'Atualizado agora (' + new Date().toLocaleString('pt-BR') + ') — fonte: repositório - Foursys HUB — ' + events.length + ' evento(s)';
        status.textContent = 'Atualizado com sucesso.';
    } catch (err) {
        status.textContent = 'Erro: ' + err.message;
    } finally {
        document.getElementById('refreshBtn').disabled = false;
    }
});

renderDashboard(embeddedEvents);
</script>
</body>
</html>`;
}

async function main() {
    console.log(`Buscando eventos de ${REPO}...`);
    const events = await fetchAllEvents();
    console.log(`${events.length} evento(s) encontrado(s).`);

    const html = renderHtml(events);

    const outPath = path.join(__dirname, 'report.html');
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`Relatório gerado em: ${outPath}`);
}

main().catch((err) => {
    console.error('Erro ao gerar o relatório:', err.message);
    process.exit(1);
});
