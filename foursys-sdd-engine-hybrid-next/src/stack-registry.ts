import * as fs from 'fs';
import * as path from 'path';

export interface StackConfig {
    id: string;
    displayName: string;
    fileExtensions: string[];
    workspaceMarkers: string[];
    detectionKeywords: string[];
    playbookFolder: string;
    skillsFolder: string;
    agentFileName: string;
    implementSkillTag: string;
    globalFilesExample: string;
}

export interface StackDetectionResult {
    stackId: string;
    confidence: 'declared' | 'manual' | 'workspace' | 'heuristic' | 'unknown';
    source: string;
}

export const STACK_REGISTRY: Record<string, StackConfig> = {
    angular: {
        id: 'angular',
        displayName: 'Angular 18+',
        fileExtensions: ['.ts', '.html', '.scss', '.css'],
        workspaceMarkers: ['angular.json'],
        detectionKeywords: ['angular', '@angular/core', 'component', 'standalone', 'signals'],
        playbookFolder: 'angular',
        skillsFolder: 'agents_skills/angular',
        agentFileName: 'AGENTE_ANGULAR_FOURSYS.md',
        implementSkillTag: '#agente-angular-foursys',
        globalFilesExample: '| `app.config.ts` | Adicionar providers (provideHttpClient, provideRouter) | Descrição da mudança |\n| `app.routes.ts` | Registrar rota da feature | Descrição da mudança |\n| `index.html` | Adicionar fonte/biblioteca global | Descrição da mudança |'
    },
    // Android ANTES do spring_boot: usa marker exclusivo (AndroidManifest.xml), sem conflito com build.gradle
    android: {
        id: 'android',
        displayName: 'Android — Kotlin / Gradle',
        fileExtensions: ['.kt', '.kts', '.java', '.xml', '.gradle'],
        workspaceMarkers: ['app/src/main/AndroidManifest.xml'],
        detectionKeywords: ['android', 'kotlin', 'gradle', 'androidmanifest', 'activity', 'fragment', 'jetpack', 'compose', 'viewmodel', 'room'],
        playbookFolder: 'android',
        skillsFolder: 'agents_skills/skills',
        agentFileName: 'AGENTE_ANDROID_FOURSYS.md',
        implementSkillTag: '#agente-android-foursys',
        globalFilesExample: '| `app/build.gradle.kts` | Adicionar dependência (Retrofit, Room, Hilt, etc.) | Descrição da mudança |\n| `app/src/main/AndroidManifest.xml` | Declarar permissão ou Activity/Service | Descrição da mudança |\n| `app/src/main/res/values/strings.xml` | Adicionar string de recurso | Descrição da mudança |'
    },
    spring_boot: {
        id: 'spring_boot',
        displayName: 'Java 21 + Spring Boot',
        fileExtensions: ['.java', '.yml', '.yaml', '.xml', '.properties'],
        workspaceMarkers: ['pom.xml', 'build.gradle'],
        detectionKeywords: ['spring', 'springboot', 'java', 'maven', 'gradle', '@restcontroller', '@service'],
        playbookFolder: 'spring_boot',
        skillsFolder: 'agents_skills/spring_boot',
        agentFileName: 'AGENTE_SPRING_FOURSYS.md',
        implementSkillTag: '#agente-spring-foursys',
        globalFilesExample: '| `pom.xml` | Adicionar dependência (Feign/Kafka/MongoDB) | Descrição da mudança |\n| `src/main/resources/application.yml` | Configurar datasource, kafka, resilience4j | Descrição da mudança |\n| `src/main/java/.../config/[Nome]Config.java` | Declarar @Bean, habilitar @EnableFeignClients | Descrição da mudança |'
    },
    node: {
        id: 'node',
        displayName: 'Node.js / NestJS',
        fileExtensions: ['.ts', '.js', '.json'],
        workspaceMarkers: ['package.json'],
        detectionKeywords: ['nestjs', '@nestjs', 'express', 'fastify', 'node', 'nodejs', '@module', '@controller', '@injectable'],
        playbookFolder: 'node',
        skillsFolder: 'agents_skills/node',
        agentFileName: 'AGENTE_NODE_FOURSYS.md',
        implementSkillTag: '#agente-node-foursys',
        globalFilesExample: '| `package.json` | Adicionar dependência (prisma, class-validator, etc.) | Descrição da mudança |\n| `src/app.module.ts` | Registrar módulo da feature | Descrição da mudança |\n| `src/main.ts` | Configurar pipes globais, prefixos de rota | Descrição da mudança |'
    },
    cobol: {
        id: 'cobol',
        displayName: 'COBOL',
        fileExtensions: ['.cbl', '.cobol', '.cob', '.jcl'],
        workspaceMarkers: [],
        detectionKeywords: ['cobol', 'identification division', 'data division', 'procedure division', 'working-storage', 'copybook', 'jcl', 'cics'],
        playbookFolder: 'cobol',
        skillsFolder: 'agents_skills/cobol',
        agentFileName: 'AGENTE_COBOL_FOURSYS.md',
        implementSkillTag: '#agente-cobol-foursys',
        globalFilesExample: '| `JCL/[NOME].jcl` | Adicionar step de execução do programa | Descrição da mudança |\n| `COPY/[NOME].cpy` | Definir estrutura de dados compartilhada (copybook) | Descrição da mudança |\n| `PROC/[NOME].prc` | Procedure de execução batch | Descrição da mudança |'
    },
    ios: {
        id: 'ios',
        displayName: 'iOS — Swift / Xcode',
        fileExtensions: ['.swift', '.m', '.h', '.storyboard', '.xib', '.plist'],
        workspaceMarkers: ['Podfile', 'Package.swift'],
        detectionKeywords: ['ios', 'swift', 'xcode', 'cocoapods', 'swiftui', 'uikit', 'appdelegate', 'viewcontroller', 'xcodeproj'],
        playbookFolder: 'ios',
        skillsFolder: 'agents_skills/skills',
        agentFileName: 'AGENTE_IOS_FOURSYS.md',
        implementSkillTag: '#agente-ios-foursys',
        globalFilesExample: '| `[Projeto].xcodeproj` | Adicionar target / dependência Swift Package | Descrição da mudança |\n| `Info.plist` | Declarar permissão (câmera, notificações, localização) | Descrição da mudança |\n| `Podfile` | Adicionar pod de terceiro (pod install após) | Descrição da mudança |'
    },
    generic: {
        id: 'generic',
        displayName: 'Genérica (outra)',
        fileExtensions: ['.ts', '.js', '.py', '.java', '.cs', '.go', '.rs'],
        workspaceMarkers: [],
        detectionKeywords: [],
        playbookFolder: 'generic',
        skillsFolder: 'agents_skills/generic',
        agentFileName: 'AGENTE_GENERIC_FOURSYS.md',
        implementSkillTag: '#agente-generic-foursys',
        globalFilesExample: '| `[arquivo de configuração]` | Registrar nova dependência ou configuração | Descrição da mudança |\n| `[ponto de entrada principal]` | Inicializar módulo/feature | Descrição da mudança |'
    }
};

export function getAllStacks(): StackConfig[] {
    return Object.values(STACK_REGISTRY);
}

export function getStackConfig(stackId: string): StackConfig {
    return STACK_REGISTRY[stackId] ?? STACK_REGISTRY['generic'];
}

export function resolveStack(
    workspaceRoot: string | undefined,
    userStoryPath: string | undefined,
    savedStack: string | undefined
): StackDetectionResult {
    // Nível 1: declarado no user_story.md
    if (userStoryPath && fs.existsSync(userStoryPath)) {
        const content = fs.readFileSync(userStoryPath, 'utf-8').toLowerCase();
        const match = content.match(/\*\*tecnologia:\*\*\s*([^\n\r]+)/i);
        if (match) {
            const declared = match[1].trim().toLowerCase();
            const resolved = _matchKeywordToStack(declared);
            if (resolved !== 'generic') {
                return { stackId: resolved, confidence: 'declared', source: 'user_story.md' };
            }
        }
    }

    // Nível 2: seleção manual persistida
    if (savedStack && STACK_REGISTRY[savedStack]) {
        return { stackId: savedStack, confidence: 'manual', source: 'seleção manual' };
    }

    // Nível 3: workspace markers (arquivos que identificam a stack)
    if (workspaceRoot) {
        for (const [stackId, config] of Object.entries(STACK_REGISTRY)) {
            if (stackId === 'generic' || stackId === 'node') { continue; }
            for (const marker of config.workspaceMarkers) {
                if (fs.existsSync(path.join(workspaceRoot, marker))) {
                    return { stackId, confidence: 'workspace', source: marker };
                }
            }
        }

        // Node: package.json existe mas NÃO tem @angular/core
        const pkgPath = path.join(workspaceRoot, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
                const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
                if (!allDeps['@angular/core']) {
                    return { stackId: 'node', confidence: 'workspace', source: 'package.json' };
                }
            } catch {
                // package.json inválido — ignora
            }
        }

        // COBOL: presença de arquivos .cbl ou .cobol na raiz
        const files = fs.readdirSync(workspaceRoot).map(f => f.toLowerCase());
        if (files.some(f => f.endsWith('.cbl') || f.endsWith('.cobol') || f.endsWith('.cob'))) {
            return { stackId: 'cobol', confidence: 'workspace', source: 'arquivo .cbl detectado' };
        }

        // iOS: .xcodeproj e .xcworkspace têm nome dinâmico — varredura de diretórios na raiz
        if (files.some(f => f.endsWith('.xcodeproj') || f.endsWith('.xcworkspace'))) {
            return { stackId: 'ios', confidence: 'workspace', source: 'diretório .xcodeproj/.xcworkspace detectado' };
        }
    }

    // Nível 4: heurística por keywords no user_story.md
    if (userStoryPath && fs.existsSync(userStoryPath)) {
        const content = fs.readFileSync(userStoryPath, 'utf-8').toLowerCase();
        let bestMatch = '';
        let bestScore = 0;
        for (const [stackId, config] of Object.entries(STACK_REGISTRY)) {
            if (stackId === 'generic') { continue; }
            const score = config.detectionKeywords.filter(kw => content.includes(kw)).length;
            if (score > bestScore) { bestScore = score; bestMatch = stackId; }
        }
        if (bestScore >= 2) {
            return { stackId: bestMatch, confidence: 'heuristic', source: 'keywords no user_story.md' };
        }
    }

    return { stackId: 'unknown', confidence: 'unknown', source: 'não detectada' };
}

function _matchKeywordToStack(text: string): string {
    if (text.includes('angular')) { return 'angular'; }
    if (text.includes('spring') || text.includes('java')) { return 'spring_boot'; }
    if (text.includes('node') || text.includes('nestjs') || text.includes('express')) { return 'node'; }
    if (text.includes('cobol')) { return 'cobol'; }
    if (text.includes('ios') || text.includes('swift') || text.includes('xcode') || text.includes('swiftui')) { return 'ios'; }
    if (text.includes('android') || text.includes('kotlin') || text.includes('jetpack') || text.includes('compose')) { return 'android'; }
    return 'generic';
}
