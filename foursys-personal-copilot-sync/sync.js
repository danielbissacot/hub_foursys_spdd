#!/usr/bin/env node
'use strict';

// Script de sincronizacao do catalogo Foursys SDD para os locais PESSOAIS do Copilot
// (~/.copilot/skills, ~/.copilot/agents) -- nunca escreve dentro de nenhum repositorio
// de cliente. Roda com: node sync.js [--dry-run]
//
// Fonte de verdade: catalog/agents_skills/** (skills tecnicas) e
// foursys-sdd-engine-hybrid-po/catalog/sdd/<stack>/** (playbooks do SDD).
// Nada aqui altera esses arquivos-fonte, so le e copia/adapta.

const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO_ROOT = path.resolve(__dirname, '..');
const CATALOG = path.join(REPO_ROOT, 'catalog');
const SDD_ROOT = path.join(REPO_ROOT, 'foursys-sdd-engine-hybrid-po', 'catalog', 'sdd');
const COPILOT_HOME = path.join(os.homedir(), '.copilot');
const SKILLS_DIR = path.join(COPILOT_HOME, 'skills');
const AGENTS_DIR = path.join(COPILOT_HOME, 'agents');

const DRY_RUN = process.argv.includes('--dry-run');

// Mesma configuracao de foursys-sdd-engine-hybrid-po/src/engine/stack-registry.ts
const STACKS = {
    angular: {
        displayName: 'Angular 18+',
        personaFile: 'angular/AGENTE_ANGULAR_FOURSYS.md',
        globalFilesExample: '| `app.config.ts` | Adicionar providers (provideHttpClient, provideRouter) | Descrição da mudança |\n| `app.routes.ts` | Registrar rota da feature | Descrição da mudança |\n| `index.html` | Adicionar fonte/biblioteca global | Descrição da mudança |'
    },
    spring_boot: {
        displayName: 'Java 21 + Spring Boot',
        personaFile: 'spring_boot/AGENTE_SPRING_FOURSYS.md',
        globalFilesExample: '| `pom.xml` | Adicionar dependência (Feign/Kafka/MongoDB) | Descrição da mudança |\n| `src/main/resources/application.yml` | Configurar datasource, kafka, resilience4j | Descrição da mudança |\n| `src/main/java/.../config/[Nome]Config.java` | Declarar @Bean, habilitar @EnableFeignClients | Descrição da mudança |'
    },
    node: {
        displayName: 'Node.js / NestJS',
        personaFile: null,
        globalFilesExample: '| `package.json` | Adicionar dependência (prisma, class-validator, etc.) | Descrição da mudança |\n| `src/app.module.ts` | Registrar módulo da feature | Descrição da mudança |\n| `src/main.ts` | Configurar pipes globais, prefixos de rota | Descrição da mudança |'
    },
    cobol: {
        displayName: 'COBOL',
        personaFile: 'cobol/AGENTE_COBOL_FOURSYS.md',
        globalFilesExample: '| `JCL/[NOME].jcl` | Adicionar step de execução do programa | Descrição da mudança |\n| `COPY/[NOME].cpy` | Definir estrutura de dados compartilhada (copybook) | Descrição da mudança |\n| `PROC/[NOME].prc` | Procedure de execução batch | Descrição da mudança |'
    },
    ios: {
        displayName: 'iOS — Swift / Xcode',
        personaFile: 'ios/AGENTE_IOS_FOURSYS.md',
        globalFilesExample: '| `[Projeto].xcodeproj` | Adicionar target / dependência Swift Package | Descrição da mudança |\n| `Info.plist` | Declarar permissão (câmera, notificações, localização) | Descrição da mudança |\n| `Podfile` | Adicionar pod de terceiro (pod install após) | Descrição da mudança |'
    },
    android: {
        displayName: 'Android — Kotlin / Gradle',
        personaFile: 'android/AGENTE_ANDROID_FOURSYS.md',
        globalFilesExample: '| `app/build.gradle.kts` | Adicionar dependência (Retrofit, Room, Hilt, etc.) | Descrição da mudança |\n| `app/src/main/AndroidManifest.xml` | Declarar permissão ou Activity/Service | Descrição da mudança |\n| `app/src/main/res/values/strings.xml` | Adicionar string de recurso | Descrição da mudança |'
    }
};

// ---------- helpers ----------

function log(msg) { console.log(msg); }

function ensureDir(dir) {
    if (!DRY_RUN) { fs.mkdirSync(dir, { recursive: true }); }
}

function stripFrontmatter(raw) {
    return raw.replace(/^---[\s\S]*?---\s*/, '').trim();
}

function readFrontmatterField(raw, field) {
    const match = raw.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
    if (!match) { return null; }
    return match[1].replace(/^["']|["']$/g, '').trim();
}

function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function writeSkillFile(slug, description, body) {
    const dir = path.join(SKILLS_DIR, slug);
    ensureDir(dir);
    const content = `---\nname: ${slug}\ndescription: ${JSON.stringify(description)}\n---\n\n${body}\n`;
    const dest = path.join(dir, 'SKILL.md');
    if (DRY_RUN) { log(`  [dry-run] ${dest}`); return; }
    fs.writeFileSync(dest, content, 'utf8');
}

function copyReferencesIfAny(srcDir, destSkillSlug) {
    const refSrc = path.join(srcDir, 'references');
    if (!fs.existsSync(refSrc)) { return; }
    const refDest = path.join(SKILLS_DIR, destSkillSlug, 'references');
    ensureDir(refDest);
    for (const f of fs.readdirSync(refSrc)) {
        if (DRY_RUN) { continue; }
        fs.copyFileSync(path.join(refSrc, f), path.join(refDest, f));
    }
}

function writeAgentFile(slug, description, body) {
    ensureDir(AGENTS_DIR);
    const content = `---\nname: ${slug}\ndescription: ${JSON.stringify(description)}\n---\n\n${body}\n`;
    const dest = path.join(AGENTS_DIR, `${slug}.agent.md`);
    if (DRY_RUN) { log(`  [dry-run] ${dest}`); return; }
    fs.writeFileSync(dest, content, 'utf8');
}

// ---------- 1. skills tecnicas (catalog/agents_skills/**) ----------

function resolveSkillMdFile(skillDir) {
    const entries = fs.readdirSync(skillDir, { withFileTypes: true });
    const directMd = entries.find(e => !e.isDirectory() && e.name.endsWith('.md') && e.name.toUpperCase() !== 'README.MD');
    if (directMd) { return path.join(skillDir, directMd.name); }
    const versionDirs = entries.filter(e => e.isDirectory() && /^\d+(\.\d+)*$/.test(e.name)).map(e => e.name);
    if (versionDirs.length === 0) { return null; }
    const compare = (a, b) => {
        const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
            const diff = (pa[i] || 0) - (pb[i] || 0);
            if (diff !== 0) { return diff; }
        }
        return 0;
    };
    const latest = versionDirs.sort(compare).pop();
    const versionPath = path.join(skillDir, latest);
    const md = fs.readdirSync(versionPath, { withFileTypes: true })
        .find(e => !e.isDirectory() && e.name.endsWith('.md') && e.name.toUpperCase() !== 'README.MD');
    return md ? path.join(versionPath, md.name) : null;
}

function walkForSkills(dir, seen) {
    if (!fs.existsSync(dir)) { return; }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory()) { continue; }
        if (entry.name === 'references' || entry.name.startsWith('AGENTE_')) { continue; }
        const full = path.join(dir, entry.name);
        const mdFile = resolveSkillMdFile(full);
        if (mdFile) {
            const slug = slugify(entry.name);
            if (seen.has(slug)) { continue; }
            seen.add(slug);
            const raw = fs.readFileSync(mdFile, 'utf8');
            const description = readFrontmatterField(raw, 'description') || `Skill ${slug}`;
            const body = stripFrontmatter(raw);
            writeSkillFile(slug, description, body);
            copyReferencesIfAny(path.dirname(mdFile), slug);
            copyReferencesIfAny(full, slug);
            log(`  skill: ${slug}`);
        } else {
            walkForSkills(full, seen);
        }
    }
}

function syncTechnicalSkills() {
    log('\n== Skills técnicas (catalog/agents_skills) ==');
    const skillsRoot = path.join(CATALOG, 'agents_skills');
    const seen = new Set();
    for (const cat of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
        if (cat.isDirectory()) { walkForSkills(path.join(skillsRoot, cat.name), seen); }
    }
}

// ---------- 2. playbooks do SDD, por stack, como Skill ----------

function readIfExists(p) {
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function syncSddSkills() {
    log('\n== Skills de fase do SDD (por stack) ==');
    for (const [stackId, cfg] of Object.entries(STACKS)) {
        const stackDir = path.join(SDD_ROOT, stackId);

        // constitution e plan: arquivo direto da stack, sem fallback -- se nao existir, pula
        for (const phase of ['constitution', 'plan']) {
            const raw = readIfExists(path.join(stackDir, `foursys-${phase}.md`));
            if (!raw) { log(`  (sem foursys-${phase}.md para ${stackId}, pulando)`); continue; }
            const slug = `foursys-${phase}-${stackId}`;
            const description = readFrontmatterField(raw, 'description') || `Fase ${phase} do SDD Foursys para ${cfg.displayName}`;
            writeSkillFile(slug, description, stripFrontmatter(raw));
            log(`  skill: ${slug}`);
        }

        // specify: generic (Etapas 1+2) + specify-tech da stack (Etapa 3), concatenados
        const genericSpecify = readIfExists(path.join(SDD_ROOT, 'generic', 'foursys-specify.md'));
        const techSpecify = readIfExists(path.join(stackDir, 'foursys-specify-tech.md'));
        if (genericSpecify && techSpecify) {
            const slug = `foursys-specify-${stackId}`;
            const combined = `${stripFrontmatter(genericSpecify)}\n\n${stripFrontmatter(techSpecify)}`;
            writeSkillFile(slug, `Especificação (Fase 1+2+3) do SDD Foursys para ${cfg.displayName}`, combined);
            log(`  skill: ${slug}`);
        }

        // tasks: generic com o placeholder de exemplos de arquivos substituido pelo da stack
        const genericTasks = readIfExists(path.join(SDD_ROOT, 'generic', 'foursys-tasks.md'));
        if (genericTasks) {
            const slug = `foursys-tasks-${stackId}`;
            const body = stripFrontmatter(genericTasks).replace('[STACK_GLOBAL_FILES_EXAMPLE]', cfg.globalFilesExample);
            writeSkillFile(slug, `Geração de Task List do SDD Foursys para ${cfg.displayName}`, body);
            log(`  skill: ${slug}`);
        }
    }
}

// ---------- 3. agentes-persona por stack ----------

function syncPersonaAgents() {
    log('\n== Agents (personas por stack) ==');
    for (const [stackId, cfg] of Object.entries(STACKS)) {
        if (!cfg.personaFile) { continue; }
        const raw = readIfExists(path.join(CATALOG, 'agents_skills', cfg.personaFile));
        if (!raw) { log(`  (persona nao encontrada para ${stackId}, pulando)`); continue; }
        const slug = `agente-${stackId}-foursys`;
        const description = readFrontmatterField(raw, 'description') || `Persona especialista Foursys em ${cfg.displayName}`;
        writeAgentFile(slug, description, stripFrontmatter(raw));
        log(`  agent: ${slug}`);
    }

    // Agente de negocio (nao e por stack)
    const negocioRaw = readIfExists(path.join(CATALOG, 'agents_skills', 'business', 'AGENTE_NEGOCIO_FOURSYS.md'));
    if (negocioRaw) {
        writeAgentFile('agente-negocio-foursys', readFrontmatterField(negocioRaw, 'description') || 'Persona de refinamento de negócio Foursys', stripFrontmatter(negocioRaw));
        log('  agent: agente-negocio-foursys');
    }
}

// ---------- 4. agente orquestrador do SDD (novo, escrito aqui) ----------

function syncOrchestratorAgent() {
    log('\n== Agent orquestrador do SDD (novo) ==');
    const stackList = Object.entries(STACKS)
        .map(([id, cfg]) => `- **${id}** (${cfg.displayName})`)
        .join('\n');

    const body = `# Foursys SDD Orchestrator

Você orquestra o fluxo Foursys SDD (Specification-Driven Development) neste projeto. Você não implementa as fases sozinho — você identifica a stack, descobre em que fase o projeto está, e invoca a Skill correta pra próxima fase.

## Passo 1 — Detectar a stack

Procure marcadores no workspace, nesta ordem:
${stackList}

Marcadores típicos: \`pom.xml\`/\`build.gradle\` → spring_boot, \`angular.json\` → angular, presença de \`.cbl\`/\`.cobol\` → cobol, \`.xcodeproj\`/\`.xcworkspace\` → ios, \`AndroidManifest.xml\` → android, \`package.json\` sem \`@angular/core\` → node. Se não for possível detectar com confiança, pergunte ao usuário qual stack usar.

## Passo 2 — Descobrir a fase atual

Verifique o que já existe em \`doc_projeto/\` (ou pasta equivalente de artefatos SDD do projeto):
1. Sem nenhum artefato → próxima fase é **constitution**.
2. Constituição existe, sem spec → próxima fase é **specify**.
3. Spec existe, sem plano técnico → próxima fase é **plan**.
4. Plano existe, sem task list → próxima fase é **tasks**.
5. Task list existe → fase de **implementação** (siga a task list diretamente, uma tarefa por vez).

## Passo 3 — Anunciar e invocar a Skill certa

Anuncie de forma direta e proativa, não apenas descritiva. Diga algo como "Vamos para a Fase **Specify** — vou usar a skill \`foursys-specify-angular\`" antes de agir, em vez de só relatar o status neutro ("a próxima fase seria..."). Você está guiando o usuário pela próxima ação, não só reportando um diagnóstico.

Use a Skill \`foursys-<fase>-<stack>\` correspondente (ex.: \`foursys-specify-angular\`, \`foursys-plan-spring_boot\`). Não invente conteúdo de fase — sempre delegue pra Skill. Se a fase exigir um insumo que falta (ex.: rascunho de história pra Specify), peça esse insumo especificamente, dentro do mesmo anúncio — não pare numa descrição genérica sem indicar o próximo passo concreto.

## Regras gerais

- Nunca pule fases sem o artefato anterior existir, a menos que o usuário peça explicitamente.
- Sempre anuncie proativamente em qual fase, stack e Skill você está atuando antes de prosseguir — não apenas descreva o estado, direcione a ação.
- Se o usuário pedir uma fase fora de ordem, confirme que ele está ciente antes de prosseguir.`;

    writeAgentFile('foursys-sdd-orchestrator', 'Orquestra o fluxo SDD da Foursys: detecta a stack, identifica a fase atual do projeto e invoca a Skill de fase correta (constitution/specify/plan/tasks).', body);
    log('  agent: foursys-sdd-orchestrator');
}

// ---------- main ----------

function main() {
    log(`Foursys Personal Copilot Sync ${DRY_RUN ? '(DRY RUN - nada sera escrito)' : ''}`);
    log(`Repo: ${REPO_ROOT}`);
    log(`Destino: ${COPILOT_HOME}`);

    syncTechnicalSkills();
    syncSddSkills();
    syncPersonaAgents();
    syncOrchestratorAgent();

    log('\nConcluído.');
}

main();
