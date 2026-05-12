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
    if (!fs.existsSync(userStoryPath)) return null;
    const content = fs.readFileSync(userStoryPath, 'utf8');
    const techHeaderRegex = /Tecnologia\s*[:\-]\s*([^\r\n]*)/i;
    const match = content.match(techHeaderRegex);
    let techToAnalyze = match && match[1] ? match[1].toLowerCase() : content.toLowerCase();
    techToAnalyze = techToAnalyze.replace(/[\[\]\(\)]/g, '').replace(/informe[:\s]*/i, '').trim();
    if (techToAnalyze.includes('angular')) return 'angular';
    if (techToAnalyze.includes('java') || techToAnalyze.includes('spring')) return 'spring_boot';
    if (techToAnalyze.includes('cobol')) return 'cobol';
    return null;
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

    const folders = fs.readdirSync(skillsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
            const folderName = dirent.name;
            const label = folderName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const agentFile = path.join(skillsPath, folderName, `AGENTE_${folderName.toUpperCase()}_FOURSYS.md`);
            return {
                label: `Agente ${label}`,
                path: fs.existsSync(agentFile) ? agentFile : path.join(skillsPath, folderName) // Fallback para a pasta
            };
        });

    return folders;
}
