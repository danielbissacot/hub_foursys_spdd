import * as fs from 'fs';
import * as path from 'path';

export function loadPlaybook(filePath: string): string {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Playbook não encontrado: ${filePath}`);
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const frontmatterRegex = /^---[\s\S]*?---\s*/;
    return raw.replace(frontmatterRegex, '').trim();
}

export function detectTechnology(userStoryPath: string): string | null {
    if (!fs.existsSync(userStoryPath)) { return null; }
    const content = fs.readFileSync(userStoryPath, 'utf8');

    // Prioridade: campo de cabeçalho explícito "Tecnologia: X"
    const techHeaderRegex = /Tecnologia\s*[:\-]\s*([^\r\n]*)/i;
    const headerMatch = content.match(techHeaderRegex);
    if (headerMatch && headerMatch[1]) {
        const explicit = headerMatch[1].toLowerCase().replace(/[\[\]\(\)]/g, '').replace(/informe[:\s]*/i, '').trim();
        if (explicit.includes('angular')) { return 'angular'; }
        if (explicit.includes('java') || explicit.includes('spring')) { return 'spring_boot'; }
        if (explicit.includes('cobol')) { return 'cobol'; }
    }

    // Fallback: contagem de ocorrências no texto completo — evita falso positivo por primeiro match
    const text = content.toLowerCase();
    const scores: Record<string, number> = { angular: 0, spring_boot: 0, cobol: 0 };
    scores.angular     = (text.match(/\bangular\b/g) || []).length;
    scores.spring_boot = (text.match(/\b(java|spring)\b/g) || []).length;
    scores.cobol       = (text.match(/\bcobol\b/g) || []).length;

    const best = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (best[0][1] === 0) { return null; }
    // Empate → inconclusivo
    if (best[0][1] === best[1][1]) { return null; }
    return best[0][0];
}

export function findAgentSkill(catalogPath: string, technology: string): string | null {
    const agentMap: Record<string, string> = {
        'angular': 'agents_skills/angular/AGENTE_ANGULAR_FOURSYS.md',
        'spring_boot': 'agents_skills/spring_boot/AGENTE_SPRING_FOURSYS.md',
        'cobol': 'agents_skills/cobol/AGENTE_COBOL_FOURSYS.md',
    };
    const relativePath = agentMap[technology];
    if (!relativePath) return null;
    const fullPath = path.join(catalogPath, relativePath);
    return fs.existsSync(fullPath) ? fullPath : null;
}

export function findCatalogPath(workspaceRoot: string, globalStoragePath: string): string | null {
    const localCatalog = path.join(workspaceRoot, 'catalog');
    if (fs.existsSync(localCatalog)) return localCatalog;
    const workspaceCatalog = path.join(workspaceRoot, 'agentes_foursys', 'catalog');
    if (fs.existsSync(workspaceCatalog)) return workspaceCatalog;
    const globalCatalog = path.join(globalStoragePath, 'agentes_foursys', 'catalog');
    if (fs.existsSync(globalCatalog)) return globalCatalog;
    return null;
}

export function listAvailableSkills(catalogPath: string): { label: string, path: string }[] {
    const skillsPath = path.join(catalogPath, 'agents_skills');
    if (!fs.existsSync(skillsPath)) return [];

    // Mapa explícito de nomes de agente por tecnologia — evita geração incorreta via toUpperCase()
    const agentFileMap: Record<string, string> = {
        'spring_boot': 'AGENTE_SPRING_FOURSYS.md',
        'angular':     'AGENTE_ANGULAR_FOURSYS.md',
        'cobol':       'AGENTE_COBOL_FOURSYS.md',
    };

    const folders = fs.readdirSync(skillsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
            const folderName = dirent.name;
            const label = folderName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const agentFileName = agentFileMap[folderName] || `AGENTE_${folderName.toUpperCase()}_FOURSYS.md`;
            const agentFile = path.join(skillsPath, folderName, agentFileName);
            return {
                label: `Agente ${label}`,
                path: fs.existsSync(agentFile) ? agentFile : path.join(skillsPath, folderName)
            };
        });

    return folders;
}

/**
 * Busca todas as skills (arquivos SKILL_*.md) disponiveis para uma tecnologia
 */
export function getAvailableSkills(catalogPath: string, technology: string): string[] {
    const techPath = path.join(catalogPath, 'agents_skills', technology);
    if (!fs.existsSync(techPath)) return [];

    const skills: string[] = [];
    const walkSync = (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walkSync(fullPath);
            } else if (file.startsWith('SKILL_') && file.endsWith('.md')) {
                skills.push(file.replace('.md', ''));
            }
        }
    };

    walkSync(techPath);
    return skills;
}

/**
 * Localiza o caminho completo de um playbook de skill pelo nome (ex: SKILL_ANGULAR_SIGNALS)
 */
export function findSkillPlaybook(catalogPath: string, skillName: string): string | null {
    const skillsRoot = path.join(catalogPath, 'agents_skills');
    if (!fs.existsSync(skillsRoot)) return null;

    let foundPath: string | null = null;
    const walkSync = (dir: string) => {
        if (foundPath) return;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walkSync(fullPath);
            } else if (file.toUpperCase() === `${skillName.toUpperCase()}.md`) {
                foundPath = fullPath;
                return;
            }
        }
    };

    walkSync(skillsRoot);
    return foundPath;
}
