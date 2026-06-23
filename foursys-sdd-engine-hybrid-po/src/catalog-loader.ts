import * as fs from 'fs';
import * as path from 'path';
import { getStackConfig, resolveStack, StackDetectionResult } from './stack-registry';

function _stripFrontmatter(raw: string): string {
    return raw.replace(/^---[\s\S]*?---\s*/, '').trim();
}

function _readPlaybookFile(filePath: string): string | null {
    if (!fs.existsSync(filePath)) { return null; }
    return _stripFrontmatter(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Carrega o playbook correto para a stack e o comando solicitado.
 *
 * - constitution / plan → busca [stack]/foursys-[cmd].md, fallback para generic/
 * - specify → generic/foursys-specify.md (Etapas 1+2) concatenado com [stack]/foursys-specify-tech.md (Etapa 3)
 * - tasks → generic/foursys-tasks.md com [STACK_GLOBAL_FILES_EXAMPLE] substituído
 */
export function loadPlaybookForStack(
    command: string,
    stackId: string,
    builtinCatalogPath: string,
    externalCatalogPath: string | null
): string {
    const stackConfig = getStackConfig(stackId);
    const sddFolder = (base: string) => path.join(base, 'sdd');

    function findFile(relativePath: string): string | null {
        // Prioridade: catálogo externo do workspace
        if (externalCatalogPath) {
            const ext = _readPlaybookFile(path.join(sddFolder(externalCatalogPath), relativePath));
            if (ext) { return ext; }
        }
        // Fallback: catálogo embutido no plugin
        return _readPlaybookFile(path.join(sddFolder(builtinCatalogPath), relativePath));
    }

    if (command === 'specify') {
        const base = findFile('generic/foursys-specify.md');
        const tech = findFile(`${stackConfig.playbookFolder}/foursys-specify-tech.md`);
        if (!base) { throw new Error('Playbook generic/foursys-specify.md não encontrado.'); }
        return tech ? `${base}\n\n${tech}` : base;
    }

    if (command === 'tasks') {
        const raw = findFile('generic/foursys-tasks.md');
        if (!raw) { throw new Error('Playbook generic/foursys-tasks.md não encontrado.'); }
        return raw.replace('[STACK_GLOBAL_FILES_EXAMPLE]', stackConfig.globalFilesExample);
    }

    // constitution, plan e outros: busca na pasta da stack, fallback generic
    const stackFile = findFile(`${stackConfig.playbookFolder}/foursys-${command}.md`);
    if (stackFile) { return stackFile; }
    const genericFile = findFile(`generic/foursys-${command}.md`);
    if (genericFile) { return genericFile; }

    throw new Error(`Playbook para '${command}' (stack: ${stackId}) não encontrado.`);
}

export function findAgentSkill(catalogPath: string, stackId: string): string | null {
    const config = getStackConfig(stackId);
    const fullPath = path.join(catalogPath, config.skillsFolder, config.agentFileName);
    return fs.existsSync(fullPath) ? fullPath : null;
}

export function findCatalogPath(workspaceRoot: string, globalStoragePath: string): string | null {
    const localCatalog = path.join(workspaceRoot, 'catalog');
    if (fs.existsSync(localCatalog)) { return localCatalog; }
    const workspaceCatalog = path.join(workspaceRoot, 'agentes_foursys', 'catalog');
    if (fs.existsSync(workspaceCatalog)) { return workspaceCatalog; }
    const globalCatalog = path.join(globalStoragePath, 'agentes_foursys', 'catalog');
    if (fs.existsSync(globalCatalog)) { return globalCatalog; }
    return null;
}

export function detectTechnology(
    userStoryPath: string,
    workspaceRoot: string | undefined,
    savedStack: string | undefined
): StackDetectionResult {
    return resolveStack(workspaceRoot, userStoryPath, savedStack);
}

export function listAvailableSkills(catalogPath: string): { label: string, path: string }[] {
    const skillsPath = path.join(catalogPath, 'agents_skills');
    if (!fs.existsSync(skillsPath)) { return []; }

    return fs.readdirSync(skillsPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => {
            const config = getStackConfig(d.name);
            const agentFile = path.join(skillsPath, d.name, config.agentFileName);
            return {
                label: `Agente ${config.displayName}`,
                path: fs.existsSync(agentFile) ? agentFile : path.join(skillsPath, d.name)
            };
        });
}

export function getAvailableSkills(catalogPath: string, stackId: string): string[] {
    const techPath = path.join(catalogPath, 'agents_skills', stackId);
    if (!fs.existsSync(techPath)) { return []; }
    const skills: string[] = [];
    const walk = (dir: string) => {
        for (const file of fs.readdirSync(dir)) {
            const full = path.join(dir, file);
            if (fs.statSync(full).isDirectory()) { walk(full); }
            else if (file.startsWith('SKILL_') && file.endsWith('.md')) {
                skills.push(file.replace('.md', ''));
            }
        }
    };
    walk(techPath);
    return skills;
}

export function findSkillPlaybook(catalogPath: string, skillName: string): string | null {
    const skillsRoot = path.join(catalogPath, 'agents_skills');
    if (!fs.existsSync(skillsRoot)) { return null; }
    let found: string | null = null;
    const walk = (dir: string) => {
        if (found) { return; }
        for (const file of fs.readdirSync(dir)) {
            const full = path.join(dir, file);
            if (fs.statSync(full).isDirectory()) { walk(full); }
            else if (file.toUpperCase() === `${skillName.toUpperCase()}.md`) { found = full; return; }
        }
    };
    walk(skillsRoot);
    return found;
}
