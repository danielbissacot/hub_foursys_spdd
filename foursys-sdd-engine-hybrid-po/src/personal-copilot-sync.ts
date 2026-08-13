import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { STACK_REGISTRY } from './engine/stack-registry';
import { resolveSkillMdFile } from './engine/catalog-loader';
import { trackEvent } from './telemetry';

// Comando OPCIONAL e ADITIVO: sincroniza o mesmo catalogo ja usado pelo "Atualizar
// Hub" (skills tecnicas) e o catalogo de playbooks SDD embutido no proprio .vsix
// (constitution/specify/plan/tasks) para os locais PESSOAIS nativos do Copilot
// (~/.copilot/skills, ~/.copilot/agents) — funciona no VS Code, IntelliJ e Copilot
// CLI, sem depender do chat participant @foursys_sdd_po. Nao remove nem substitui
// nada do mecanismo atual (_injectCopilotCustomizations em sidebar-provider.ts).
// Espelha foursys-personal-copilot-sync/sync.js (fonte de referencia do projeto).

const COPILOT_HOME = path.join(os.homedir(), '.copilot');
const SKILLS_DIR = path.join(COPILOT_HOME, 'skills');
const AGENTS_DIR = path.join(COPILOT_HOME, 'agents');

function slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function stripFrontmatter(raw: string): string {
    return raw.replace(/^---[\s\S]*?---\s*/, '').trim();
}

function readFrontmatterField(raw: string, field: string): string | null {
    const match = raw.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
    if (!match) { return null; }
    return match[1].replace(/^["']|["']$/g, '').trim();
}

function readIfExists(p: string): string | null {
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function writeSkillFile(slug: string, description: string, body: string): void {
    const dir = path.join(SKILLS_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    const content = `---\nname: ${slug}\ndescription: ${JSON.stringify(description)}\n---\n\n${body}\n`;
    fs.writeFileSync(path.join(dir, 'SKILL.md'), content, 'utf8');
}

function copyReferencesIfAny(srcDir: string, destSkillSlug: string): void {
    const refSrc = path.join(srcDir, 'references');
    if (!fs.existsSync(refSrc)) { return; }
    const refDest = path.join(SKILLS_DIR, destSkillSlug, 'references');
    // cpSync recursivo (nao readdir + copyFileSync): skill com references em subpasta —
    // como o catalogo do Design System Liquid, que organiza por componente — fazia
    // copyFileSync receber um diretorio, lancar EISDIR e abortar o sync inteiro no meio.
    fs.cpSync(refSrc, refDest, { recursive: true });
}

function writeAgentFile(slug: string, description: string, body: string): void {
    fs.mkdirSync(AGENTS_DIR, { recursive: true });
    const content = `---\nname: ${slug}\ndescription: ${JSON.stringify(description)}\n---\n\n${body}\n`;
    fs.writeFileSync(path.join(AGENTS_DIR, `${slug}.agent.md`), content, 'utf8');
}

function walkForSkills(dir: string, seen: Set<string>, log: (msg: string) => void): void {
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
            writeSkillFile(slug, description, stripFrontmatter(raw));
            copyReferencesIfAny(path.dirname(mdFile), slug);
            copyReferencesIfAny(full, slug);
            log(`  skill: ${slug}`);
        } else {
            walkForSkills(full, seen, log);
        }
    }
}

function buildOrchestratorBody(): string {
    const stackList = Object.entries(STACK_REGISTRY)
        .map(([id, cfg]) => `- **${id}** (${cfg.displayName})`)
        .join('\n');

    return `# Foursys SDD Orchestrator

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
}

export async function syncPersonalCopilot(
    context: vscode.ExtensionContext,
    outputChannel: vscode.OutputChannel
): Promise<void> {
    const log = (msg: string) => outputChannel.appendLine(msg);
    outputChannel.show(true);
    log('=== Foursys: Sincronizar Skills Nativas do Copilot ===');

    const catalogPath = context.globalState.get<string>('catalogPath');
    if (!catalogPath || !fs.existsSync(catalogPath)) {
        vscode.window.showWarningMessage('Rode "Atualizar Hub" primeiro (botão na sidebar) antes de sincronizar as Skills nativas.');
        return;
    }

    const sddRoot = path.join(context.extensionUri.fsPath, 'catalog', 'sdd');

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Sincronizando Skills nativas do Copilot...',
        cancellable: false
    }, async () => {
        // 1. Skills técnicas (mesmo catálogo já clonado pelo "Atualizar Hub")
        const skillsRoot = path.join(catalogPath, 'agents_skills');
        const seen = new Set<string>();
        if (fs.existsSync(skillsRoot)) {
            for (const cat of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
                if (cat.isDirectory()) { walkForSkills(path.join(skillsRoot, cat.name), seen, log); }
            }
        }

        // 2. Playbooks do SDD por stack (catálogo embutido no próprio .vsix, sempre disponível offline)
        for (const [stackId, cfg] of Object.entries(STACK_REGISTRY)) {
            const stackDir = path.join(sddRoot, cfg.playbookFolder);

            for (const phase of ['constitution', 'plan'] as const) {
                const raw = readIfExists(path.join(stackDir, `foursys-${phase}.md`));
                if (!raw) { continue; }
                const slug = `foursys-${phase}-${stackId}`;
                const description = readFrontmatterField(raw, 'description') || `Fase ${phase} do SDD Foursys para ${cfg.displayName}`;
                writeSkillFile(slug, description, stripFrontmatter(raw));
                log(`  skill: ${slug}`);
            }

            const genericSpecify = readIfExists(path.join(sddRoot, 'generic', 'foursys-specify.md'));
            const techSpecify = readIfExists(path.join(stackDir, 'foursys-specify-tech.md'));
            if (genericSpecify && techSpecify) {
                const slug = `foursys-specify-${stackId}`;
                writeSkillFile(
                    slug,
                    `Especificação (Fase 1+2+3) do SDD Foursys para ${cfg.displayName}`,
                    `${stripFrontmatter(genericSpecify)}\n\n${stripFrontmatter(techSpecify)}`
                );
                log(`  skill: ${slug}`);
            }

            const genericTasks = readIfExists(path.join(sddRoot, 'generic', 'foursys-tasks.md'));
            if (genericTasks) {
                const slug = `foursys-tasks-${stackId}`;
                const body = stripFrontmatter(genericTasks).replace('[STACK_GLOBAL_FILES_EXAMPLE]', cfg.globalFilesExample);
                writeSkillFile(slug, `Geração de Task List do SDD Foursys para ${cfg.displayName}`, body);
                log(`  skill: ${slug}`);
            }
        }

        // 3. Personas por stack (do catálogo já clonado)
        for (const [stackId, cfg] of Object.entries(STACK_REGISTRY)) {
            const personaPath = path.join(catalogPath, 'agents_skills', cfg.playbookFolder, cfg.agentFileName);
            const raw = readIfExists(personaPath);
            if (!raw) { continue; }
            const slug = `agente-${stackId}-foursys`;
            writeAgentFile(slug, readFrontmatterField(raw, 'description') || `Persona especialista Foursys em ${cfg.displayName}`, stripFrontmatter(raw));
            log(`  agent: ${slug}`);
        }

        const negocioRaw = readIfExists(path.join(catalogPath, 'agents_skills', 'business', 'AGENTE_NEGOCIO_FOURSYS.md'));
        if (negocioRaw) {
            writeAgentFile('agente-negocio-foursys', readFrontmatterField(negocioRaw, 'description') || 'Persona de refinamento de negócio Foursys', stripFrontmatter(negocioRaw));
            log('  agent: agente-negocio-foursys');
        }

        // 4. Agente orquestrador do SDD
        writeAgentFile(
            'foursys-sdd-orchestrator',
            'Orquestra o fluxo SDD da Foursys: detecta a stack, identifica a fase atual do projeto e invoca a Skill de fase correta (constitution/specify/plan/tasks).',
            buildOrchestratorBody()
        );
        log('  agent: foursys-sdd-orchestrator');

        log('\nConcluído.');
    });

    vscode.window.showInformationMessage('✅ Skills nativas do Copilot sincronizadas! Recarregue a janela (Developer: Reload Window) para o Copilot reconhecer.');

    await trackEvent(context, outputChannel, { event: 'personal_copilot_sync_executed' });
}
