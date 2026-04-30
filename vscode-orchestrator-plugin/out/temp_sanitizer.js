"use strict";
function sanitizeGeneratedCode(code) {
    // Angular: corrige QUALQUER variação de 'component' minúsculo em imports do @angular/core
    code = code.replace(/import\s*\{([^}]*)\}\s*from\s*['"]@angular\/core['"]/g, (match, imports) => {
        const fixed = imports.replace(/\bcomponent\b/gi, 'Component')
            .replace(/\bngmodule\b/gi, 'NgModule')
            .replace(/\binput\b/g, 'Input')
            .replace(/\boutput\b/g, 'Output')
            .replace(/\binjectable\b/gi, 'Injectable')
            .replace(/\bsignal\b/g, 'signal');
        return `import {${fixed}} from '@angular/core'`;
    });
    // Angular: corrige decorador com case errado
    code = code.replace(/@component\s*\(/gi, "@Component(");
    code = code.replace(/@ngmodule\s*\(/gi, "@NgModule(");
    code = code.replace(/@injectable\s*\(/gi, "@Injectable(");
    // Angular: corrige acesso a $event.target.value para evitar erro de tipo
    code = code.replace(/\(\$event\.target\)\.value/g, "($any($event.target)).value");
    code = code.replace(/\$event\.target\.value/g, "$any($event.target).value");
    // Angular: garante import de ChangeDetectionStrategy se usado
    if (code.includes("ChangeDetectionStrategy.OnPush") && !code.includes("ChangeDetectionStrategy")) {
        code = code.replace(/import\s*\{([^}]*)\}\s*from\s*['"]@angular\/core['"]/, (m, i) => `import {${i}, ChangeDetectionStrategy} from '@angular/core'`);
    }
    // Angular: remove modificador 'private' de propriedades para garantir acesso pelo template
    code = code.replace(/\bprivate\b\s+((?!readonly|async|constructor)\w+)/g, "public $1");
    // Angular: corrige @for com 'let' (sintaxe inválida no Angular 18+)
    code = code.replace(/@for\s*\(\s*let\s+(\w+)\s+of\s+/g, "@for ($1 of ");
    // Angular: adiciona 'track' apenas se ele REALMENTE estiver ausente
    code = code.replace(/@for\s*\(\s*(\w+)\s+of\s+([^;{]+)\)\s*\{/g, (match, item, list) => {
        const listContent = list.trim();
        if (listContent.includes(';') || listContent.includes('track ')) {
            return match;
        }
        let cleanList = listContent;
        if (cleanList.endsWith(')')) {
            const openCount = (match.match(/\(/g) || []).length;
            const closeCount = (match.match(/\)/g) || []).length;
            if (closeCount > openCount) {
                cleanList = cleanList.substring(0, cleanList.length - 1);
            }
        }
        return `@for (${item} of ${cleanList.trim()}; track ${item}) {`;
    });
    // Angular: converte *ngIf para @if
    code = code.replace(/<(\w+)\s+[^>]*\*ngIf="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g, '@if ($2) {\n$& \n}');
    code = code.replace(/\*ngIf="([^"]+)"/g, "");
    // Angular/TS: Declara tipos desconhecidos (ex: signal<Vendas>) como any se não estiverem definidos
    const typeMatches = code.match(/<([A-Z]\w+)>/g);
    if (typeMatches) {
        const typesToDeclare = new Set();
        typeMatches.forEach(tag => {
            const typeName = tag.slice(1, -1);
            const defined = new RegExp(`(interface|class|type|enum)\\s+${typeName}\\b`).test(code);
            if (!defined && !['string', 'number', 'boolean', 'any', 'void'].includes(typeName.toLowerCase())) {
                typesToDeclare.add(typeName);
            }
        });
        typesToDeclare.forEach(typeName => {
            code = `type ${typeName} = any;\n` + code;
        });
    }
    // Angular: força a classe a se chamar AppComponent (obrigatório para app.component.ts)
    code = code.replace(/export\s+class\s+\w+Component/g, "export class AppComponent");
    code = code.replace(/selector:\s*'[^']+'/g, "selector: 'app-root'");
    if (!code.includes("standalone")) {
        code = code.replace(/selector:\s*'app-root'/, "selector: 'app-root',\n  standalone: true");
    }
    // Angular: garante FormsModule se usar ngModel
    if (code.includes("ngModel") && !code.includes("FormsModule")) {
        if (!code.includes("@angular/forms")) {
            code = "import { FormsModule } from '@angular/forms';\n" + code;
        }
        if (code.includes("imports: [")) {
            code = code.replace(/imports:\s*\[/, "imports: [FormsModule, ");
        }
        else {
            code = code.replace(/standalone:\s*true/, "standalone: true,\n  imports: [FormsModule]");
        }
    }
    // Angular/TS: Evita erros de "Cannot find name 'X'" declarando globais comuns como any
    const commonGlobals = ['Chart', 'google', 'FB', 'bootstrap', 'd3'];
    commonGlobals.forEach(global => {
        if (code.toLowerCase().includes(global.toLowerCase()) && !code.includes(`declare var ${global}`)) {
            const importRegex = new RegExp(`import\\s+.*from\\s+['"].*${global}.*['"]\\s*;?`, 'gi');
            code = code.replace(importRegex, `// [Hub] Import de ${global} removido para evitar quebra de build`);
            if (code.includes(`new ${global}`) || code.includes(`${global}.`)) {
                code = `declare var ${global}: any;\n` + code;
            }
        }
    });
    return code;
}
//# sourceMappingURL=temp_sanitizer.js.map