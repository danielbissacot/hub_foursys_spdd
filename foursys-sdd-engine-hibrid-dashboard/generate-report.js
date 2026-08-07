#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO || 'danielbissacot/sdd-telemetry-data';
const WORKER_URL = process.env.TELEMETRY_WORKER_URL || 'https://foursys-sdd-telemetry.foursys-sdd.workers.dev';
// Opcional: valor de DASHBOARD_READ_SECRET configurado no Worker (ver telemetry-worker/worker.js).
// Só é usado para o botão "Atualizar dados" no navegador — NUNCA é o GITHUB_TOKEN, então mesmo se
// esse valor vazar, quem tiver não ganha acesso de escrita nem consegue navegar o repositório: só
// consegue reler o mesmo snapshot que este script já embute no report.html.
const DASHBOARD_READ_SECRET = process.env.DASHBOARD_READ_SECRET || '';

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
    const hasLiveRefresh = !!DASHBOARD_READ_SECRET;

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
  .squad-detail-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 1050;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  }
  .squad-detail-content {
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    max-width: 640px; width: 100%; max-height: 80vh; overflow-y: auto; padding: 1.25rem;
    box-shadow: 0 8px 32px rgba(0,0,0,.5);
  }
  .squad-person-row { cursor: pointer; padding: .5rem .25rem; border-bottom: 1px solid var(--gridline); }
  .squad-person-row:hover { background: rgba(255,107,0,.06); }
</style>
</head>
<body>
<div class="topbar py-3 mb-4">
  <div class="container d-flex flex-wrap align-items-center justify-content-between gap-2">
    <div>
      <h1 class="h4 mb-0">Foursys SDD Hybrid — Dashboard de Telemetria</h1>
      <p class="text-muted small mb-0" id="sourceInfo">Snapshot gerado em ${generatedAt} — fonte: repositório - Foursys HUB</p>
    </div>
    <div class="d-flex align-items-center gap-2">
      ${hasLiveRefresh ? `
      <span id="refreshStatus" class="text-muted small"></span>
      <button id="refreshBtn" class="btn btn-primary btn-sm">🔄 Atualizar dados</button>
      ` : `
      <span class="text-muted small">Rode <code>node generate-report.js</code> novamente para atualizar o snapshot.</span>
      `}
    </div>
  </div>
</div>

<div class="container pb-5">
    <div class="card mb-4"><div class="card-body">
        <div class="d-flex flex-wrap align-items-end gap-3">
            <div>
                <label class="form-label small text-muted mb-1" for="filterStack">Stack</label>
                <select id="filterStack" class="form-select form-select-sm" style="min-width:160px"><option value="">Todas as stacks</option></select>
            </div>
            <div>
                <label class="form-label small text-muted mb-1" for="filterEventType">Tipo de evento</label>
                <select id="filterEventType" class="form-select form-select-sm" style="min-width:200px"><option value="">Todos os tipos</option></select>
            </div>
            <div>
                <label class="form-label small text-muted mb-1" for="filterFrom">De</label>
                <input type="date" id="filterFrom" class="form-control form-control-sm">
            </div>
            <div>
                <label class="form-label small text-muted mb-1" for="filterTo">Até</label>
                <input type="date" id="filterTo" class="form-control form-control-sm">
            </div>
            <button id="clearFiltersBtn" class="btn btn-outline-secondary btn-sm">Limpar filtros</button>
            <button id="exportCsvBtn" class="btn btn-primary btn-sm ms-auto">⬇️ Exportar CSV</button>
        </div>
    </div></div>

    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 mb-4" id="summaryCards"></div>

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
                <h2 class="card-title mb-1">Top Comandos / Skills</h2>
                <p class="text-muted small mb-2">Pra skills/playbooks, mostra se a execução veio de um clique na sidebar/Painel PO ou de <code>/skill</code> digitado direto no chat (inferido por correlação de tempo — pode errar em casos raros). Fases SDD (constitution, specify...) não têm essa distinção hoje.</p>
                <canvas id="chartTopCommands" height="240"></canvas>
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

    <div class="row g-4 mb-4">
        <div class="col-12">
            <div class="card"><div class="card-body">
                <h2 class="card-title mb-2">Eventos por Versão da Extensão</h2>
                <canvas id="chartVersionEvents" height="120"></canvas>
            </div></div>
        </div>
    </div>

    <div class="card mb-4">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <h2 class="card-title mb-0">Ranking de Pessoas</h2>
              <input type="search" id="personFilter" class="form-control form-control-sm" style="max-width:220px" placeholder="Filtrar por e-mail...">
            </div>
            <p class="text-muted small mb-2">Em quantos dias diferentes cada pessoa usou o Hub no período filtrado (frequência de acesso, não volume de trabalho), do maior para o menor (top 10). O filtro de e-mail acima também se aplica à tabela "Uso por Dia" logo abaixo.</p>
            <div style="height:260px" class="mb-3"><canvas id="chartPersonRank"></canvas></div>
            <button id="personRankViewAllBtn" class="btn btn-outline-secondary btn-sm">📋 Ver lista completa</button>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-lg-4">
            <div class="card h-100"><div class="card-body">
                <h2 class="card-title mb-1">Curto Prazo — Acessos por Squad Tribo</h2>
                <p class="text-muted small mb-2">Quantas pessoas de cada Squad Tribo usaram o Hub no período filtrado. Clique numa fatia pra ver as pessoas do squad e os dias exatos de acesso.</p>
                <div style="height:220px" class="mb-2"><canvas id="chartCurtoPrazoSquad"></canvas></div>
                <button id="curtoPrazoNaoAcessouBtn" class="btn btn-outline-secondary btn-sm">👥 Ver quem não acessou</button>
            </div></div>
        </div>
        <div class="col-lg-4">
            <div class="card h-100"><div class="card-body">
                <h2 class="card-title mb-1">Longo Prazo — Acessos por Squad Tribo</h2>
                <p class="text-muted small mb-2">Mesma lógica do Curto Prazo, com o roster de Longo Prazo.</p>
                <div id="longoPrazoEmpty" class="text-muted small py-4 text-center">Aguardando lista de pessoas do Longo Prazo.</div>
                <div id="longoPrazoChartWrap" style="height:220px" class="mb-2 hidden-table"><canvas id="chartLongoPrazoSquad"></canvas></div>
                <button id="longoPrazoNaoAcessouBtn" class="btn btn-outline-secondary btn-sm hidden-table">👥 Ver quem não acessou</button>
            </div></div>
        </div>
        <div class="col-lg-4">
            <div class="card h-100"><div class="card-body">
                <h2 class="card-title mb-1">Outros</h2>
                <p class="text-muted small mb-2">Pessoas que usaram o Hub e não estão nos rosters de Curto/Longo Prazo — sem agrupamento por squad. Clique numa fatia pra ver os dias exatos de acesso.</p>
                <div id="outrosEmpty" class="text-muted small py-4 text-center">Ninguém fora dos rosters no período filtrado.</div>
                <div id="outrosChartWrap" style="height:220px" class="mb-2 hidden-table"><canvas id="chartOutros"></canvas></div>
            </div></div>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-lg-6">
            <div class="card h-100"><div class="card-body">
                <h2 class="card-title mb-1">Fora do padrão @foursys.com.br</h2>
                <p class="text-muted small mb-2">E-mails que apareceram na telemetria com outro domínio (ambiente de cliente detectou outro e-mail, ou erro de digitação). Fica separado do Ranking/Outros até confirmar quem é cada um.</p>
                <div id="outroDominioEmpty" class="text-muted small py-4 text-center">Todo mundo apareceu com @foursys.com.br no período filtrado.</div>
                <div id="outroDominioChartWrap" style="height:220px" class="mb-2 hidden-table"><canvas id="chartOutroDominio"></canvas></div>
            </div></div>
        </div>
    </div>

    <div id="squadDetailModal" class="squad-detail-overlay" style="display:none">
        <div class="squad-detail-content">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 id="squadDetailTitle" class="h5 mb-0"></h3>
                <button id="squadDetailClose" class="btn btn-outline-secondary btn-sm">Fechar ✕</button>
            </div>
            <div id="squadDetailBody"></div>
        </div>
    </div>

    <div class="card mb-4">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <h2 class="card-title mb-0">Uso por Dia</h2>
            </div>
            <p class="text-muted small mb-2">A coluna "Pessoas" conta quem usou em cada dia — quem aparece em mais de um dia soma mais de uma vez aqui, então o total das linhas pode passar o card "Pessoas desde {data}" no topo (que conta cada pessoa só 1x no período todo).</p>
            <div class="table-responsive">
                <table class="table table-striped table-hover table-sm">
                    <thead><tr><th>Dia</th><th>Pessoas</th><th>Eventos</th><th>Tokens</th><th>Créditos (estimado)</th><th>Opt-out</th></tr></thead>
                    <tbody id="dayRows"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
<script>
const REPO = ${JSON.stringify(REPO)};
const WORKER_URL = ${JSON.stringify(WORKER_URL)};
const embeddedReadToken = ${JSON.stringify(DASHBOARD_READ_SECRET)};

// Período de testes internos antes do lançamento oficial (sem uso real de ninguém
// ainda) — excluído do relatório em vez de apagado na fonte, pra não perder o dado
// bruto no repositório caso precise auditar depois. Aplicado aqui (não só no embed
// inicial) pra também valer quando "Atualizar dados" busca eventos frescos do Worker.
const TEST_PERIOD_END = '2026-07-16';
function excludeTestPeriod(events) {
    return events.filter(ev => (ev.ts || '').slice(0, 10) > TEST_PERIOD_END);
}

let embeddedEvents = excludeTestPeriod(${embeddedEvents});
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

// Roster de Curto Prazo fornecido pelo usuario em 07/08/2026, agrupado por Squad Tribo.
// Mateus Henrique Esteves ficou de fora da lista original: sem e-mail cadastrado, sem
// como cruzar com a telemetria (que so identifica pessoa por e-mail).
const CURTO_PRAZO_ROSTER = [
    { nome: 'Alexandre Machado Hoepner', squad: 'OPTINMGT', email: 'alexandre.hoepner@foursys.com.br' },
    { nome: 'Andre Alves Pinto', squad: 'AGENDAREC', email: 'andre.pinto@foursys.com.br' },
    { nome: 'Bruno Da Silva Costa', squad: 'PNLRECPDPJ', email: 'bruno.costa@foursys.com.br' },
    { nome: 'Caio Vinicius Alves de Souza', squad: 'OPTINMGT', email: 'caio.alves@foursys.com.br' },
    { nome: 'Carlos Henrique Policastro Bispo', squad: 'ESTAUTCOD0', email: 'carlos.policastro@foursys.com.br' },
    { nome: 'Danilo Santos dos Santos', squad: 'ESTAUTCOD0', email: 'danilo.santos@foursys.com.br' },
    { nome: 'Demian Parenti Quirino', squad: 'AGENDAREC', email: 'demian.quirino@foursys.com.br' },
    { nome: 'Dirceu Santos Gonçalves', squad: 'ESTAUTCOD0', email: 'dirceu.goncalves@foursys.com.br' },
    { nome: 'Elimara Cecilia Santos Fortes Pires', squad: 'Alecrim', email: 'elimara.santos@foursys.com.br' },
    { nome: 'Fabio Monteiro Amorim', squad: 'REGISDUP', email: 'fabio.amorim@foursys.com.br' },
    { nome: 'Fabio Victor da Silva Almeida', squad: 'PNLRECPDPJ', email: 'fabio.silva@foursys.com.br' },
    { nome: 'Felipe Monteiro Carneiro', squad: 'Visão Sacado', email: 'felipe.carneiro@foursys.com.br' },
    { nome: 'Felipe Sampaio Marques Souza', squad: 'OPTINMGT', email: 'felipe.souza@foursys.com.br' },
    { nome: 'Gabriel Handriel Kelm', squad: 'REGISDUP', email: 'gabriel.kelm@foursys.com.br' },
    { nome: 'Guilherme Pereira', squad: 'AGENDAREC', email: 'guilherme.pereira@foursys.com.br' },
    { nome: 'Joao Pedro da Silva Pereira dos Santos', squad: 'JORNAUTD0', email: 'joao.pereira@foursys.com.br' },
    { nome: 'Leonardo Arantes Di Nizo', squad: 'AGENDAREC', email: 'leonardo.nizo@foursys.com.br' },
    { nome: 'Leonardo Gabriel De Oliveira', squad: 'HABMGTSERV', email: 'leonardo.gabriel@foursys.com.br' },
    { nome: 'Leticia Aparecida De Souza Scalco', squad: 'ESTAUTCOD0', email: 'leticia.souza@foursys.com.br' },
    { nome: 'Lincon Roberto Do Nascimento', squad: 'PNLRECPDPJ', email: 'lincon.nascimento@foursys.com.br' },
    { nome: 'Lucas Alves De Abreu', squad: 'HABMGTSERV', email: 'lucas.abreu@foursys.com.br' },
    { nome: 'Lucas Medina Cavalcanti', squad: 'HABMGTSERV', email: 'lucas.cavalcanti@foursys.com.br' },
    { nome: 'Luis Miguel Giomo', squad: 'HABMGTSERV', email: 'luis.giomo@foursys.com.br' },
    { nome: 'Luiz Augusto Gomes', squad: 'OPTINMGT', email: 'luiz.augusto@foursys.com.br' },
    { nome: 'Marcia Cristina Marinho', squad: 'PNLRECPDPJ', email: 'marcia.marinho@foursys.com.br' },
    { nome: 'Natalia De Almeida Silva', squad: 'HABMGTSERV', email: 'natalia.silva@foursys.com.br' },
    { nome: 'Rafael Casanova Matos', squad: 'ESTAUTCOD0', email: 'rafael.matos@foursys.com.br' },
    { nome: 'Rafael Pereira Freitas', squad: 'JORNAUTD0', email: 'rafael.freitas@foursys.com.br' },
    { nome: 'Ramon Messias Correa De Andrade', squad: 'LIQCONTRAT', email: 'ramon.correa@foursys.com.br' },
    { nome: 'Sanzio De Oliveira Carmo', squad: 'REGISDUP', email: 'sanzio.carmo@foursys.com.br' },
    { nome: 'Sergio Diogo Antonio', squad: 'PNLRECPDPJ', email: 'sergio.diogo@foursys.com.br' },
    { nome: 'Tiago Silva Martins', squad: 'REGISDUP', email: 'tiago.martins@foursys.com.br' },
    { nome: 'Vitor Fernando Crispim Arfelli', squad: 'LIQCONTRAT', email: 'vitor.arfelli@foursys.com.br' },
    { nome: 'Wanderson Pinho Da Silva De Jesus', squad: 'JORNAUTD0', email: 'wanderson.silva@foursys.com.br' },
    { nome: 'Wellington Correia Martins', squad: 'REGISDUP', email: 'wellington.martins@foursys.com.br' },
    { nome: 'Yago Do Nascimento Ferreira', squad: 'Visão Sacado', email: 'yago.ferreira@foursys.com.br' },
    { nome: 'Yuri Cesar Almeida Dos Santos', squad: 'Visão Sacado', email: 'yuri.almeida@foursys.com.br' },
];

// Roster de Longo Prazo — ainda nao recebido. Preencher no mesmo formato do
// CURTO_PRAZO_ROSTER acima ({ nome, squad, email }) quando a lista chegar.
const LONGO_PRAZO_ROSTER = [];

// Cruza o roster (nome + squad) com stats.byPerson (chave = e-mail vindo da telemetria).
// Por squad: quantas pessoas do roster usaram o Hub pelo menos 1 vez (no periodo filtrado)
// vs. total de pessoas do squad. Por pessoa: as datas exatas de acesso (nao só a contagem),
// pra dar o drill-down "cliquei no nome e vi os dias que ele usou".
function aggregateBySquad(roster, byPersonEntries) {
    const lookup = new Map(byPersonEntries.map(([email, p]) => [email.toLowerCase(), p]));
    const bySquad = new Map();
    for (const person of roster) {
        const p = lookup.get(person.email.toLowerCase());
        const days = p ? [...p.days].sort() : [];
        if (!bySquad.has(person.squad)) { bySquad.set(person.squad, { totalPeople: 0, usedPeople: 0, people: [] }); }
        const s = bySquad.get(person.squad);
        s.totalPeople += 1;
        if (days.length > 0) { s.usedPeople += 1; }
        s.people.push({ nome: person.nome, email: person.email, days, version: p ? p.lastVersion : '' });
    }
    for (const s of bySquad.values()) { s.people.sort((a, b) => b.days.length - a.days.length); }
    return [...bySquad.entries()].sort((a, b) => b[1].usedPeople - a[1].usedPeople);
}

// MANTER EM SINCRONIA com os nomes de evento emitidos em
// foursys-sdd-engine-hybrid-po/src/telemetry.ts (grep -rn "event: '" src/*.ts nessa pasta
// para conferir a lista atual). Um evento novo adicionado lá e não refletido aqui é
// contado incorretamente (nem rotulado, nem classificado como clique-vs-conclusão).
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
// MANTER EM SINCRONIA com EVENT_TYPE_LABELS acima e com telemetry.ts (ver nota acima).
const CLICK_ONLY_EVENTS = new Set(['command_executed', 'skill_clicked', 'playbook_clicked']);

// skill_clicked/playbook_clicked só existem quando a ação começou por um clique na UI
// (sidebar/Painel PO) — quando alguém digita "/skill <slug>" direto no chat do Copilot,
// esse evento de clique nunca é disparado, só o skill_completed/playbook_completed no
// final. Correlacionando cada conclusão com o clique mais próximo do mesmo e-mail+comando
// (até ORIGIN_WINDOW_MS antes), dá pra inferir a origem sem precisar de nenhum campo novo
// no payload de telemetria nem mudança na extensão — é só uma heurística por proximidade
// de tempo, então pode errar em casos raros (ex: dois cliques do mesmo comando muito
// próximos), mas na prática deve acertar a grande maioria.
const ORIGIN_WINDOW_MS = 15 * 60 * 1000;

function annotateOrigins(events) {
    const clicksByKey = new Map();
    for (const ev of events) {
        if (ev.event !== 'skill_clicked' && ev.event !== 'playbook_clicked') { continue; }
        const key = (ev.email || '') + '|' + (ev.command || '');
        if (!clicksByKey.has(key)) { clicksByKey.set(key, []); }
        clicksByKey.get(key).push({ ts: Date.parse(ev.ts || ''), used: false });
    }
    for (const list of clicksByKey.values()) { list.sort((a, b) => a.ts - b.ts); }

    for (const ev of events) {
        if (ev.event !== 'skill_completed' && ev.event !== 'playbook_completed') { continue; }
        const key = (ev.email || '') + '|' + (ev.command || '');
        const list = clicksByKey.get(key);
        const evTime = Date.parse(ev.ts || '');
        let origin = 'chat';
        if (list && !isNaN(evTime)) {
            let bestIdx = -1;
            let bestDelta = Infinity;
            for (let i = 0; i < list.length; i++) {
                const c = list[i];
                if (c.used || isNaN(c.ts)) { continue; }
                const delta = evTime - c.ts;
                if (delta >= 0 && delta <= ORIGIN_WINDOW_MS && delta < bestDelta) {
                    bestDelta = delta;
                    bestIdx = i;
                }
            }
            if (bestIdx >= 0) {
                list[bestIdx].used = true;
                origin = 'ui';
            }
        }
        ev.__origin = origin;
    }
}

annotateOrigins(embeddedEvents);

// Versoes de build/dev que nunca foram lancadas no Hub (1.3.0/1.3.1) ou eventos de outra
// ferramenta que vazaram nesse campo (personal-copilot-sync, nao e versao do Hub) —
// excluidas do grafico "Eventos por Versao" pra nao confundir com releases reais.
const EXCLUDED_VERSIONS = new Set(['1.3.0', '1.3.1', 'personal-copilot-sync']);

// Mesma pessoa, e-mails diferentes (ex: usou o Hub num ambiente de cliente que detectou
// outro e-mail de git config) — mapeia alias -> e-mail canonico, pra nao aparecer como
// duas pessoas em nenhum grafico/tabela do relatorio.
const EMAIL_ALIASES = {
    'daniel.bissacot@bradesco.com.br': 'daniel.bissacot@foursys.com.br'
};
function canonicalEmail(email) {
    const lower = (email || '').toLowerCase();
    return EMAIL_ALIASES[lower] || email;
}

// Todo mundo deveria aparecer como @foursys.com.br — quem não bate (bradesco.com.br,
// foursys.com sem ".br", etc.) vai pra um card separado em vez de entrar no Ranking/Outros,
// já que não dá pra saber com certeza quem é quem sem confirmar caso a caso.
function isFoursysEmail(email) {
    return (email || '').toLowerCase().endsWith('@foursys.com.br');
}

function aggregate(events) {
    const byStack = new Map();
    const byVersion = new Map();
    const byPerson = new Map();
    const byDay = new Map();
    const byDayPerson = new Map();
    const byEventType = new Map();
    const byCommand = new Map();
    const uniqueEmails = new Set();
    let totalTokens = 0;
    let totalCredits = 0;
    let volumeEventCount = 0;

    for (const ev of events) {
        const email = canonicalEmail(ev.email) || 'desconhecido';
        const stack = ev.stack || 'unknown';
        const tokens = Number(ev.tokens) || 0;
        const credits = Number(ev.credits) || 0;
        const day = (ev.ts || '').slice(0, 10);
        const isVolumeEvent = !CLICK_ONLY_EVENTS.has(ev.event);

        if (!byPerson.has(email)) byPerson.set(email, { events: 0, tokens: 0, credits: 0, lastSeen: '', lastVersion: '', optedOut: false, days: new Set() });
        const p = byPerson.get(email);
        // lastVersion segue o mesmo evento mais recente que define lastSeen — assim
        // "versão que a pessoa está usando" é sempre a da última vez que ela apareceu,
        // não a primeira nem uma mistura de versões antigas e novas.
        if (ev.ts && ev.ts > p.lastSeen) { p.lastSeen = ev.ts; p.lastVersion = ev.version || p.lastVersion; }
        if (ev.event === 'telemetry_opted_out') p.optedOut = true;

        const typeLabel = EVENT_TYPE_LABELS[ev.event] || ev.event || 'desconhecido';
        byEventType.set(typeLabel, (byEventType.get(typeLabel) || 0) + 1);

        // uniqueEmails só conta quem teve pelo menos 1 evento "volume" (não-clique) —
        // mesmo critério do byDayPerson abaixo. Se contasse cliques sem conclusão
        // (command_executed/skill_clicked/playbook_clicked isolados), "Pessoas únicas"
        // podia mostrar gente que nunca aparece em nenhuma linha de "Uso por Dia".
        if (!isVolumeEvent) { continue; }

        uniqueEmails.add(email);
        volumeEventCount += 1;
        totalTokens += tokens;
        totalCredits += credits;
        p.events += 1;
        p.tokens += tokens;
        p.credits += credits;
        if (day) { p.days.add(day); }

        if (!byStack.has(stack)) byStack.set(stack, { events: 0, tokens: 0, credits: 0 });
        const s = byStack.get(stack);
        s.events += 1;
        s.tokens += tokens;
        s.credits += credits;

        const version = ev.version || 'desconhecida';
        if (!EXCLUDED_VERSIONS.has(version)) {
            byVersion.set(version, (byVersion.get(version) || 0) + 1);
        }

        if (day) {
            byDay.set(day, (byDay.get(day) || 0) + 1);

            if (!byDayPerson.has(day)) byDayPerson.set(day, new Map());
            const dayPeople = byDayPerson.get(day);
            if (!dayPeople.has(email)) dayPeople.set(email, { events: 0, tokens: 0, credits: 0, optedOut: false });
            const dp = dayPeople.get(email);
            dp.events += 1;
            dp.tokens += tokens;
            dp.credits += credits;
            dp.optedOut = p.optedOut;
        }

        if (ev.command) {
            if (!byCommand.has(ev.command)) { byCommand.set(ev.command, { total: 0, ui: 0, chat: 0, na: 0 }); }
            const c = byCommand.get(ev.command);
            c.total += 1;
            if (ev.__origin === 'ui') { c.ui += 1; }
            else if (ev.__origin === 'chat') { c.chat += 1; }
            else { c.na += 1; }
        }
    }

    const byDayDetail = [...byDayPerson.entries()]
        .map(([day, people]) => ({
            day,
            events: [...people.values()].reduce((s, v) => s + v.events, 0),
            tokens: [...people.values()].reduce((s, v) => s + v.tokens, 0),
            credits: [...people.values()].reduce((s, v) => s + v.credits, 0),
            people: [...people.entries()].sort((a, b) => b[1].events - a[1].events)
        }))
        .sort((a, b) => b.day.localeCompare(a.day));

    return {
        totalEvents: volumeEventCount,
        uniqueEmails: uniqueEmails.size,
        totalTokens,
        totalCredits,
        optedOutCount: [...byPerson.values()].filter(p => p.optedOut).length,
        byStack: [...byStack.entries()].sort((a, b) => b[1].events - a[1].events),
        byVersion: [...byVersion.entries()].sort((a, b) => a[0].localeCompare(b[0])),
        // Ranking de pessoas usa dias distintos de uso (frequência de acesso), não total
        // de ações concluídas (volume de trabalho) — são perguntas diferentes: "quem vem
        // mais vezes" vs. "quem produz mais". Tokens/Créditos na tabela continuam somando
        // o total do período, só o critério de ORDEM que muda.
        byPerson: [...byPerson.entries()].sort((a, b) => b[1].days.size - a[1].days.size),
        byDay: [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0])),
        byDayDetail,
        byEventType: [...byEventType.entries()].sort((a, b) => b[1] - a[1]),
        topCommands: [...byCommand.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 8)
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

const STACKED_HBAR_OPTS = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
        legend: { display: true, position: 'bottom', labels: { color: TEXT_MUTED, boxWidth: 12, font: { size: 10 } } },
        datalabels: { display: false }
    },
    scales: {
        x: { stacked: true, beginAtZero: true, grid: { color: GRIDLINE }, ticks: { color: TEXT_MUTED, precision: 0 } },
        y: { stacked: true, grid: { display: false }, ticks: { color: TEXT_MUTED } }
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

    // "Pessoas únicas" = total do período filtrado (equivalente a "usuários únicos" em
    // qualquer analytics). O card de "ativos no dia mais recente" existe à parte porque
    // esse total NÃO é comparável com a coluna "Pessoas" da tabela "Uso por Dia" (que é
    // por dia, tipo DAU) — ver nota acima da tabela. Mostrar a data no rótulo deixa
    // explícito que é um recorte de 1 dia, evitando a pergunta "por que os números não batem".
    const latestDay = stats.byDayDetail[0];
    const latestDayLabel = latestDay ? latestDay.day.split('-').reverse().join('/') : '—';
    const latestDayPeople = latestDay ? latestDay.people.length : 0;
    const firstDay = stats.byDay[0];
    const firstDayLabel = firstDay ? firstDay[0].split('-').reverse().join('/') : '—';

    document.getElementById('summaryCards').innerHTML = \`
        <div class="col"><div class="card stat-tile h-100"><div class="card-body d-flex align-items-center gap-3">
            <div class="icon">📊</div><div><div class="value">\${stats.totalEvents}</div><div class="label">Ações concluídas</div></div>
        </div></div></div>
        <div class="col"><div class="card stat-tile h-100"><div class="card-body d-flex align-items-center gap-3">
            <div class="icon">👥</div><div><div class="value">\${stats.uniqueEmails}</div><div class="label">Pessoas desde \${firstDayLabel}</div></div>
        </div></div></div>
        <div class="col"><div class="card stat-tile h-100"><div class="card-body d-flex align-items-center gap-3">
            <div class="icon">📅</div><div><div class="value">\${latestDayPeople}</div><div class="label">Ativos em \${latestDayLabel}</div></div>
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

    const optedOutBadge = (optedOut) => optedOut
        ? '<span class="badge bg-secondary">Sim</span>'
        : '<span class="badge" style="background:var(--status-good)">Não</span>';

    // Pizza por pessoa (sem agrupamento de squad): 1 fatia por pessoa, clique na fatia
    // mostra os dias exatos de acesso dela no modal (openPersonDetail, definido mais abaixo
    // junto com openSquadDetail — precisa existir antes do clique acontecer, não antes desta
    // chamada, já que é só registrado como callback do Chart.js).
    function renderPersonPieChart(chartKey, canvasId, peopleEntries) {
        upsertChart(chartKey, canvasId, {
            type: 'pie',
            data: {
                labels: peopleEntries.map(([email, p]) => \`\${email} (\${p.days.size})\`),
                datasets: [{
                    data: peopleEntries.map(([, p]) => p.days.size),
                    backgroundColor: peopleEntries.map((_, i) => colorFor(i)),
                    borderColor: cssVar('--surface'),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: TEXT_MUTED, boxWidth: 12, font: { size: 10 } } },
                    datalabels: { color: '#fff', font: { weight: '600' }, formatter: (val) => val > 0 ? val : '' }
                },
                onClick: (evt, elements) => {
                    if (!elements.length) { return; }
                    const [email, p] = peopleEntries[elements[0].index];
                    openPersonDetail(email, p);
                }
            }
        });
    }

    // Ranking/Outros só consideram @foursys.com.br — quem tem outro domínio vai pro card
    // "Fora do padrão" separado (ver mais abaixo), não entra misturado aqui.
    const foursysByPerson = stats.byPerson.filter(([email]) => isFoursysEmail(email));
    const outroDominioByPerson = stats.byPerson.filter(([email]) => !isFoursysEmail(email));

    // Ranking = comparação de magnitude entre pessoas (top 10 por dias de acesso no período).
    const topPeople = foursysByPerson.slice(0, 10);
    renderPersonPieChart('personRank', 'chartPersonRank', topPeople);

    // Lista completa (todo mundo, não só top 10) só aparece dentro do popup — mantém a
    // página principal do relatório mais curta, igual ao botão "quem não acessou".
    document.getElementById('personRankViewAllBtn').onclick = () => {
        document.getElementById('squadDetailTitle').textContent = \`Ranking de Pessoas — \${foursysByPerson.length} pessoa(s)\`;
        document.getElementById('squadDetailBody').innerHTML = foursysByPerson.map(([email, p]) => {
            const lastSeen = p.lastSeen ? p.lastSeen.slice(0, 10).split('-').reverse().join('/') : '—';
            return \`
                <div class="squad-person-row" style="cursor:default">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>\${escapeHtml(email)}</span>
                        <span class="text-muted small">\${p.days.size} dia(s)</span>
                    </div>
                    <div class="text-muted small">Último acesso: \${lastSeen}</div>
                </div>\`;
        }).join('');
        document.getElementById('squadDetailModal').style.display = 'flex';
    };

    // Curto/Longo Prazo: quantas pessoas de cada Squad Tribo usaram o Hub no período
    // filtrado (não soma de dias — "cobertura" do squad), cruzando o roster fixo com
    // stats.byPerson. Pizza mostra só quem está usando (fatia = usedPeople); clicar na
    // fatia abre o modal com a lista de pessoas daquele squad e, clicando na pessoa, os
    // dias exatos de acesso.
    function renderSquadPieChart(chartKey, canvasId, bySquad) {
        upsertChart(chartKey, canvasId, {
            type: 'pie',
            data: {
                labels: bySquad.map(([squad, v]) => \`\${squad} (\${v.usedPeople}/\${v.totalPeople})\`),
                datasets: [{
                    data: bySquad.map(([, v]) => v.usedPeople),
                    backgroundColor: bySquad.map((_, i) => colorFor(i)),
                    borderColor: cssVar('--surface'),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: TEXT_MUTED, boxWidth: 12, font: { size: 11 } } },
                    datalabels: { color: '#fff', font: { weight: '600' }, formatter: (val) => val > 0 ? val : '' }
                },
                onClick: (evt, elements) => {
                    if (!elements.length) { return; }
                    openSquadDetail(bySquad[elements[0].index]);
                }
            }
        });
    }

    // Lista, achatada, de quem tem 0 dias de acesso em todos os squads de um roster —
    // usado pelo botão "Ver quem não acessou" (modal sem drill-down, já é a lista final).
    function openNaoAcessouModal(bySquad, rosterLabel) {
        const semAcesso = bySquad.flatMap(([squad, v]) =>
            v.people.filter(p => p.days.length === 0).map(p => ({ ...p, squad }))
        );
        document.getElementById('squadDetailTitle').textContent = \`\${rosterLabel} — \${semAcesso.length} pessoa(s) sem acesso\`;
        document.getElementById('squadDetailBody').innerHTML = semAcesso.length
            ? semAcesso.map(p => \`
                <div class="squad-person-row" style="cursor:default">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>\${escapeHtml(p.nome)}</span>
                        <span class="text-muted small">\${escapeHtml(p.squad)}</span>
                    </div>
                    <div class="text-muted small">\${escapeHtml(p.email)}</div>
                </div>\`).join('')
            : '<div class="text-muted small">Todo mundo do roster já acessou no período filtrado.</div>';
        document.getElementById('squadDetailModal').style.display = 'flex';
    }

    const curtoPrazoBySquad = aggregateBySquad(CURTO_PRAZO_ROSTER, stats.byPerson);
    renderSquadPieChart('curtoPrazoSquad', 'chartCurtoPrazoSquad', curtoPrazoBySquad);
    document.getElementById('curtoPrazoNaoAcessouBtn').onclick = () => openNaoAcessouModal(curtoPrazoBySquad, 'Curto Prazo');

    // Longo Prazo: roster ainda nao recebido — some o placeholder e mostra o grafico so
    // quando LONGO_PRAZO_ROSTER (perto do CURTO_PRAZO_ROSTER, no topo do arquivo) tiver gente.
    const longoPrazoEmpty = document.getElementById('longoPrazoEmpty');
    const longoPrazoChartWrap = document.getElementById('longoPrazoChartWrap');
    const longoPrazoNaoAcessouBtn = document.getElementById('longoPrazoNaoAcessouBtn');
    if (LONGO_PRAZO_ROSTER.length > 0) {
        longoPrazoEmpty.classList.add('hidden-table');
        longoPrazoChartWrap.classList.remove('hidden-table');
        longoPrazoNaoAcessouBtn.classList.remove('hidden-table');
        const longoPrazoBySquad = aggregateBySquad(LONGO_PRAZO_ROSTER, stats.byPerson);
        renderSquadPieChart('longoPrazoSquad', 'chartLongoPrazoSquad', longoPrazoBySquad);
        longoPrazoNaoAcessouBtn.onclick = () => openNaoAcessouModal(longoPrazoBySquad, 'Longo Prazo');
    } else {
        longoPrazoEmpty.classList.remove('hidden-table');
        longoPrazoChartWrap.classList.add('hidden-table');
        longoPrazoNaoAcessouBtn.classList.add('hidden-table');
    }

    // Outros: quem usou o Hub no período e não está em nenhum dos dois rosters — sem
    // squad conhecido, então mostra direto por pessoa (mesma pizza do Ranking acima).
    const rosterEmails = new Set(
        [...CURTO_PRAZO_ROSTER, ...LONGO_PRAZO_ROSTER].map(p => p.email.toLowerCase())
    );
    const outrosByPerson = foursysByPerson.filter(([email]) => !rosterEmails.has(email.toLowerCase()));
    const outrosEmpty = document.getElementById('outrosEmpty');
    const outrosChartWrap = document.getElementById('outrosChartWrap');
    if (outrosByPerson.length > 0) {
        outrosEmpty.classList.add('hidden-table');
        outrosChartWrap.classList.remove('hidden-table');
        renderPersonPieChart('outros', 'chartOutros', outrosByPerson);
    } else {
        outrosEmpty.classList.remove('hidden-table');
        outrosChartWrap.classList.add('hidden-table');
    }

    // Fora do padrão @foursys.com.br: gente que apareceu na telemetria com outro domínio
    // (ex: ambiente de cliente detectou outro e-mail, ou erro de digitação no domínio).
    // Fica isolado aqui em vez de entrar no Ranking/Outros, porque não dá pra saber com
    // certeza quem é essa pessoa sem confirmar caso a caso.
    const outroDominioEmpty = document.getElementById('outroDominioEmpty');
    const outroDominioChartWrap = document.getElementById('outroDominioChartWrap');
    if (outroDominioByPerson.length > 0) {
        outroDominioEmpty.classList.add('hidden-table');
        outroDominioChartWrap.classList.remove('hidden-table');
        renderPersonPieChart('outroDominio', 'chartOutroDominio', outroDominioByPerson);
    } else {
        outroDominioEmpty.classList.remove('hidden-table');
        outroDominioChartWrap.classList.add('hidden-table');
    }

    function openPersonDetail(email, p) {
        const datesLabel = [...p.days].sort().map(d => d.split('-').reverse().join('/')).join(', ');
        const versionLabel = p.lastVersion ? \`Versão do Hub: \${escapeHtml(p.lastVersion)}\` : 'Versão do Hub: desconhecida';
        document.getElementById('squadDetailTitle').textContent = \`\${email} — \${p.days.size} dia(s) de acesso\`;
        document.getElementById('squadDetailBody').innerHTML = \`
            <div class="text-muted small mb-2">\${versionLabel}</div>
            <div class="text-muted small">\${datesLabel || 'Sem acesso no período'}</div>\`;
        document.getElementById('squadDetailModal').style.display = 'flex';
    }

    function openSquadDetail([squad, v]) {
        document.getElementById('squadDetailTitle').textContent = \`\${squad} — \${v.usedPeople} de \${v.totalPeople} usando\`;
        document.getElementById('squadDetailBody').innerHTML = v.people.map(p => {
            const hasAccess = p.days.length > 0;
            const datesLabel = p.days.map(d => d.split('-').reverse().join('/')).join(', ');
            const versionLabel = p.version ? \`Versão do Hub: \${escapeHtml(p.version)}\` : 'Versão do Hub: desconhecida';
            return \`
                <div class="squad-person-row" \${hasAccess ? 'data-person-toggle="true"' : ''}>
                    <div class="d-flex justify-content-between align-items-center">
                        <span>\${hasAccess ? '<span class="toggle-icon-person">▸</span> ' : ''}\${escapeHtml(p.nome)}</span>
                        <span class="text-muted small">\${hasAccess ? p.days.length + ' dia(s)' : 'sem acesso no período'}</span>
                    </div>
                    \${hasAccess ? \`<div class="person-days-detail text-muted small mt-1" style="display:none">\${versionLabel}<br>Dias de acesso: \${datesLabel}</div>\` : ''}
                </div>\`;
        }).join('');
        document.querySelectorAll('#squadDetailBody [data-person-toggle]').forEach(row => {
            row.addEventListener('click', () => {
                const icon = row.querySelector('.toggle-icon-person');
                const detail = row.querySelector('.person-days-detail');
                const expanding = detail.style.display === 'none';
                detail.style.display = expanding ? 'block' : 'none';
                icon.textContent = expanding ? '▾' : '▸';
            });
        });
        document.getElementById('squadDetailModal').style.display = 'flex';
    }

    document.getElementById('squadDetailClose').onclick = () => {
        document.getElementById('squadDetailModal').style.display = 'none';
    };
    document.getElementById('squadDetailModal').onclick = (e) => {
        if (e.target.id === 'squadDetailModal') { e.currentTarget.style.display = 'none'; }
    };

    document.getElementById('dayRows').innerHTML = stats.byDayDetail.map(({ day, events, tokens, credits, people }, i) => {
        const groupId = 'day-group-' + i;
        const optedOutCount = people.filter(([, p]) => p.optedOut).length;
        const dayRow = \`
            <tr class="day-header-row" data-day-toggle="\${groupId}" style="cursor:pointer">
                <td><span class="toggle-icon">▸</span> \${escapeHtml(day)}</td>
                <td>\${people.length}</td>
                <td>\${events}</td>
                <td>\${tokens}</td>
                <td>\${credits.toFixed(3)}</td>
                <td>\${optedOutCount > 0 ? optedOutCount : '-'}</td>
            </tr>\`;
        const personRows = people.map(([email, p]) => \`
            <tr class="day-person-row hidden-table" data-day-group="\${groupId}" data-email="\${escapeHtml(email.toLowerCase())}">
                <td class="ps-4 text-muted">\${escapeHtml(email)}</td>
                <td></td>
                <td>\${p.events}</td>
                <td>\${p.tokens}</td>
                <td>\${p.credits.toFixed(3)}</td>
                <td>\${optedOutBadge(p.optedOut)}</td>
            </tr>\`).join('');
        return dayRow + personRows;
    }).join('');

    document.querySelectorAll('[data-day-toggle]').forEach(row => {
        row.addEventListener('click', () => {
            const groupId = row.dataset.dayToggle;
            const icon = row.querySelector('.toggle-icon');
            const expanding = icon.textContent === '▸';
            icon.textContent = expanding ? '▾' : '▸';
            document.querySelectorAll(\`[data-day-group="\${groupId}"]\`).forEach(personRow => {
                personRow.style.display = expanding ? 'table-row' : 'none';
            });
        });
    });

    document.getElementById('stackRows').innerHTML = stats.byStack.map(([stack, v]) => \`
        <tr><td>\${escapeHtml(stack)}</td><td>\${v.events}</td><td>\${v.tokens}</td><td>\${v.credits.toFixed(3)}</td></tr>\`).join('');

    const stackLabels = stats.byStack.map(([k]) => k);
    const stackColors = stackLabels.map((_, i) => colorFor(i));
    const stackEventCounts = stats.byStack.map(([, v]) => v.events);
    const stackTokenCounts = stats.byStack.map(([, v]) => v.tokens);
    const dayLabels = stats.byDay.map(([k]) => k);
    const dayCounts = stats.byDay.map(([, v]) => v);
    const versionLabels = stats.byVersion.map(([k]) => k);
    const versionColors = versionLabels.map((_, i) => colorFor(i));
    const versionCounts = stats.byVersion.map(([, v]) => v);
    const eventTypeLabels = stats.byEventType.map(([k]) => k);
    const eventTypeCounts = stats.byEventType.map(([, v]) => v);
    const eventTypeColors = eventTypeLabels.map((_, i) => colorFor(i));
    const commandLabels = stats.topCommands.map(([k]) => k);
    const commandUi = stats.topCommands.map(([, v]) => v.ui);
    const commandChat = stats.topCommands.map(([, v]) => v.chat);
    const commandNa = stats.topCommands.map(([, v]) => v.na);

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
        data: {
            labels: commandLabels,
            datasets: [
                { label: 'Via UI (clique)', data: commandUi, backgroundColor: cssVar('--s-orange'), borderRadius: 4, maxBarThickness: 22 },
                { label: 'Via chat direto', data: commandChat, backgroundColor: cssVar('--s-teal'), borderRadius: 4, maxBarThickness: 22 },
                { label: 'Fases SDD (sem distinção)', data: commandNa, backgroundColor: TEXT_MUTED, borderRadius: 4, maxBarThickness: 22 }
            ]
        },
        options: STACKED_HBAR_OPTS
    });

    upsertChart('versionEvents', 'chartVersionEvents', {
        type: 'bar',
        data: { labels: versionLabels, datasets: [{ label: 'Eventos', data: versionCounts, backgroundColor: versionColors, borderRadius: 4, maxBarThickness: 36 }] },
        options: BAR_OPTS_BASE
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

    document.querySelectorAll('.day-header-row').forEach(headerRow => {
        const groupId = headerRow.dataset.dayToggle;
        const personRows = [...document.querySelectorAll(\`[data-day-group="\${groupId}"]\`)];
        const icon = headerRow.querySelector('.toggle-icon');
        if (!term) {
            headerRow.style.display = '';
            personRows.forEach(pr => { pr.style.display = 'none'; });
            icon.textContent = '▸';
            return;
        }
        const matches = personRows.filter(pr => pr.dataset.email.includes(term));
        headerRow.style.display = matches.length > 0 ? '' : 'none';
        personRows.forEach(pr => {
            pr.style.display = pr.dataset.email.includes(term) ? 'table-row' : 'none';
        });
        icon.textContent = matches.length > 0 ? '▾' : '▸';
    });
});

function uniqueSorted(values) {
    return [...new Set(values)].filter(Boolean).sort();
}

// Repopula os selects de filtro a partir dos eventos atuais, preservando a seleção
// corrente quando o valor ainda existe. Chamada no load e depois de um refresh ao vivo
// (que pode trazer stacks/tipos de evento novos desde a última geração do snapshot).
function populateFilterOptions(events) {
    const stackSel = document.getElementById('filterStack');
    const typeSel = document.getElementById('filterEventType');
    const prevStack = stackSel.value;
    const prevType = typeSel.value;

    const allStacks = uniqueSorted(events.map(ev => ev.stack || 'unknown'));
    const allTypes = uniqueSorted(events.map(ev => ev.event));

    stackSel.innerHTML = '<option value="">Todas as stacks</option>' +
        allStacks.map(s => \`<option value="\${escapeHtml(s)}">\${escapeHtml(s)}</option>\`).join('');
    typeSel.innerHTML = '<option value="">Todos os tipos</option>' +
        allTypes.map(t => \`<option value="\${escapeHtml(t)}">\${escapeHtml(EVENT_TYPE_LABELS[t] || t)}</option>\`).join('');

    if (allStacks.includes(prevStack)) { stackSel.value = prevStack; }
    if (allTypes.includes(prevType)) { typeSel.value = prevType; }
}

populateFilterOptions(embeddedEvents);

function applyFilters(events) {
    const stack = document.getElementById('filterStack').value;
    const eventType = document.getElementById('filterEventType').value;
    const from = document.getElementById('filterFrom').value;
    const to = document.getElementById('filterTo').value;
    return events.filter(ev => {
        if (stack && (ev.stack || 'unknown') !== stack) { return false; }
        if (eventType && ev.event !== eventType) { return false; }
        const day = (ev.ts || '').slice(0, 10);
        if (from && day && day < from) { return false; }
        if (to && day && day > to) { return false; }
        return true;
    });
}

function refresh() {
    renderDashboard(applyFilters(embeddedEvents));
}

['filterStack', 'filterEventType', 'filterFrom', 'filterTo'].forEach(id => {
    document.getElementById(id).addEventListener('change', refresh);
});

document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    document.getElementById('filterStack').value = '';
    document.getElementById('filterEventType').value = '';
    document.getElementById('filterFrom').value = '';
    document.getElementById('filterTo').value = '';
    refresh();
});

function toCsv(events) {
    const headers = ['email', 'event', 'command', 'stack', 'tokens', 'credits', 'version', 'ts'];
    const escapeCsv = (v) => {
        const s = String(v == null ? '' : v);
        return /[",\\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const lines = [headers.join(',')];
    for (const ev of events) {
        lines.push(headers.map(h => escapeCsv(ev[h])).join(','));
    }
    return lines.join('\\n');
}

document.getElementById('exportCsvBtn').addEventListener('click', () => {
    const csv = toCsv(applyFilters(embeddedEvents));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'foursys-sdd-telemetria-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});

async function fetchFreshEvents() {
    const res = await fetch(WORKER_URL, { headers: { 'X-Foursys-Token': embeddedReadToken } });
    if (!res.ok) {
        throw new Error('Falha ao buscar eventos (' + res.status + '). Verifique o DASHBOARD_READ_SECRET.');
    }
    return res.json();
}

const refreshBtn = document.getElementById('refreshBtn');
async function doLiveRefresh() {
    const status = document.getElementById('refreshStatus');
    if (status) status.textContent = 'Buscando dados...';
    if (refreshBtn) refreshBtn.disabled = true;
    try {
        embeddedEvents = excludeTestPeriod(await fetchFreshEvents());
        annotateOrigins(embeddedEvents);
        populateFilterOptions(embeddedEvents);
        refresh();
        document.getElementById('sourceInfo').textContent =
            'Atualizado agora (' + new Date().toLocaleString('pt-BR') + ') — fonte: repositório - Foursys HUB — ' + embeddedEvents.length + ' evento(s)';
        if (status) status.textContent = 'Atualizado com sucesso.';
    } catch (err) {
        if (status) status.textContent = 'Erro: ' + err.message;
    } finally {
        if (refreshBtn) refreshBtn.disabled = false;
    }
}
if (refreshBtn) {
    refreshBtn.addEventListener('click', doLiveRefresh);
}

refresh();
// Busca dados frescos do Worker automaticamente ao abrir a página, pra não depender
// de clique manual em "Atualizar dados" nem mostrar o snapshot velho embutido no F5.
if (refreshBtn) {
    doLiveRefresh();
}
</script>
</body>
</html>`;
}

async function main() {
    if (!GITHUB_TOKEN) {
        console.error('Erro: defina a variável de ambiente GITHUB_TOKEN antes de rodar.');
        console.error('Exemplo (PowerShell): $env:GITHUB_TOKEN="seu_token"; node generate-report.js');
        process.exit(1);
    }
    if (!DASHBOARD_READ_SECRET) {
        console.warn('Aviso: DASHBOARD_READ_SECRET não definido — o relatório será gerado sem o botão "Atualizar dados" (snapshot estático).');
    }

    console.log(`Buscando eventos de ${REPO}...`);
    const events = await fetchAllEvents();
    console.log(`${events.length} evento(s) encontrado(s).`);

    const html = renderHtml(events);

    const outPath = path.join(__dirname, 'report.html');
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`Relatório gerado em: ${outPath}`);
}

module.exports = { renderHtml };

if (require.main === module) {
    main().catch((err) => {
        console.error('Erro ao gerar o relatório:', err.message);
        process.exit(1);
    });
}
