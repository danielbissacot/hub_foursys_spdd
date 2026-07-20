import * as fs from 'fs';
import * as path from 'path';
import { resolveStack, getStackConfig, getAllStacks } from './stack-registry';
import { findCatalogPath, loadPlaybookForStack, getAvailableSkills } from './catalog-loader';
import { assembleFinalPrompt } from './prompt-context';

/**
 * Ponto de entrada de linha de comando para o motor headless — permite que hosts fora do
 * Node (como um plugin IntelliJ escrito em Kotlin) chamem a mesma logica de negocio que a
 * extensao VS Code usa, via subprocesso, trocando dados em JSON por stdout.
 *
 * Uso: node cli.js <comando> [args...]
 *   resolve-stack <workspaceRoot>
 *   load-playbook <command> <stackId> <builtinCatalogPath> [externalCatalogPath]
 *   build-prompt <command> <stackId> <workspaceRoot> <builtinCatalogPath> [externalCatalogPath]
 *   list-skills <catalogPath> <stackId>
 *   save-response <outputPath>   (conteudo lido do stdin)
 */
function main(): void {
    const [, , command, ...args] = process.argv;

    try {
        switch (command) {
            case 'resolve-stack': {
                const [workspaceRoot] = args;
                const detection = resolveStack(workspaceRoot, undefined, undefined);
                const config = getStackConfig(detection.stackId);
                print({ ...detection, displayName: config.displayName });
                break;
            }
            case 'list-stacks': {
                print(getAllStacks().map(s => ({ id: s.id, displayName: s.displayName })));
                break;
            }
            case 'load-playbook': {
                const [phaseCommand, stackId, builtinCatalogPath, externalCatalogPath] = args;
                const content = loadPlaybookForStack(phaseCommand, stackId, builtinCatalogPath, externalCatalogPath || null);
                print({ content });
                break;
            }
            case 'find-catalog': {
                const [workspaceRoot, globalStoragePath] = args;
                print({ catalogPath: findCatalogPath(workspaceRoot, globalStoragePath || '') });
                break;
            }
            case 'build-prompt': {
                const [phaseCommand, stackId, workspaceRoot, builtinCatalogPath, externalCatalogPath] = args;
                const resourcesPath = path.join(builtinCatalogPath, '..', 'resources');
                const assembled = assembleFinalPrompt({
                    command: phaseCommand,
                    stackId,
                    workspaceRoot,
                    builtinCatalogPath,
                    externalCatalogPath: externalCatalogPath || null,
                    resourcesPath
                });
                print(assembled);
                break;
            }
            case 'list-skills': {
                const [catalogPath, stackId] = args;
                print({ skills: getAvailableSkills(catalogPath, stackId) });
                break;
            }
            case 'save-response': {
                const [outputPath] = args;
                const content = fs.readFileSync(0, 'utf8');
                const outputDir = path.dirname(outputPath);
                if (!fs.existsSync(outputDir)) { fs.mkdirSync(outputDir, { recursive: true }); }
                fs.writeFileSync(outputPath, content);
                print({ savedTo: outputPath, bytes: Buffer.byteLength(content, 'utf8') });
                break;
            }
            default:
                printError(`Comando desconhecido: '${command}'. Use resolve-stack, list-stacks, load-playbook, find-catalog, build-prompt, list-skills ou save-response.`);
                process.exit(1);
        }
    } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
}

function print(data: unknown): void {
    process.stdout.write(JSON.stringify(data));
}

function printError(message: string): void {
    process.stderr.write(JSON.stringify({ error: message }));
}

main();
