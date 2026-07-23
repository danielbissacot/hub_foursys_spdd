import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import {
    slugifyStoryName,
    parseUserStoryBlocks,
    listStoryFolders,
    listPendingPoStories,
    getActiveStorySlug,
    setActiveStorySlug,
    resolveStoryDocPath,
    ensureNewStorySlug,
    importPoStory,
    createBlankUserStory,
} from '../src/utils';

function createFakeContext(): vscode.ExtensionContext {
    const store: Record<string, unknown> = {};
    return {
        workspaceState: {
            get: (key: string) => store[key],
            update: async (key: string, value: unknown) => { store[key] = value; }
        }
    } as unknown as vscode.ExtensionContext;
}

describe('utils.ts', () => {
    let tmpRoot: string;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'foursys-utils-test-'));
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
        fs.rmSync(tmpRoot, { recursive: true, force: true });
    });

    describe('slugifyStoryName', () => {
        it('normaliza acentos, maiusculas e espacos', () => {
            assert.strictEqual(slugifyStoryName('Login e Autenticação'), 'login-e-autenticacao');
        });

        it('remove caracteres especiais e colapsa hifens', () => {
            assert.strictEqual(slugifyStoryName('  Checkout!! #2 (novo) '), 'checkout-2-novo');
        });

        it('cai em "historia" quando o resultado fica vazio', () => {
            assert.strictEqual(slugifyStoryName('###'), 'historia');
            assert.strictEqual(slugifyStoryName('   '), 'historia');
        });
    });

    describe('parseUserStoryBlocks', () => {
        it('extrai multiplos blocos US-XXX com titulo e conteudo', () => {
            const raw = [
                '# User Stories',
                '',
                '## US-001: Detalhar objetivo',
                'Conteudo da primeira historia.',
                'Mais uma linha.',
                '',
                '## US-002: Mapear cenario atual',
                'Conteudo da segunda historia.',
                '',
                '## Resumo do Backlog',
                '| ID | Titulo |',
            ].join('\n');

            const blocks = parseUserStoryBlocks(raw);

            assert.strictEqual(blocks.length, 2);
            assert.strictEqual(blocks[0].id, 'US-001');
            assert.strictEqual(blocks[0].titulo, 'Detalhar objetivo');
            assert.ok(blocks[0].conteudo.includes('Conteudo da primeira historia.'));
            assert.ok(!blocks[0].conteudo.includes('US-002'));
            assert.strictEqual(blocks[1].id, 'US-002');
            assert.strictEqual(blocks[1].titulo, 'Mapear cenario atual');
            assert.ok(!blocks[1].conteudo.includes('Resumo do Backlog'));
        });

        it('retorna lista vazia quando nao ha bloco US-XXX', () => {
            assert.deepStrictEqual(parseUserStoryBlocks('# Sem historias ainda\nSó um rascunho.'), []);
        });

        it('retorna lista vazia para texto vazio', () => {
            assert.deepStrictEqual(parseUserStoryBlocks(''), []);
        });

        it('fecha o ultimo bloco no fim do arquivo quando nao ha "Resumo do Backlog"', () => {
            const raw = '## US-005: Ultima historia\nConteudo final sem secao de resumo.';
            const blocks = parseUserStoryBlocks(raw);
            assert.strictEqual(blocks.length, 1);
            assert.strictEqual(blocks[0].id, 'US-005');
            assert.ok(blocks[0].conteudo.includes('Conteudo final sem secao de resumo.'));
        });
    });

    describe('listStoryFolders', () => {
        it('retorna vazio quando doc_projeto/ nao existe', () => {
            assert.deepStrictEqual(listStoryFolders(tmpRoot), []);
        });

        it('lista subpastas de doc_projeto/ em ordem alfabetica, excluindo qa/screens', () => {
            const docFolder = path.join(tmpRoot, 'doc_projeto');
            for (const name of ['US-002', 'US-001', 'qa', 'screens', 'login']) {
                fs.mkdirSync(path.join(docFolder, name), { recursive: true });
            }
            assert.deepStrictEqual(listStoryFolders(tmpRoot), ['US-001', 'US-002', 'login']);
        });

        it('ignora arquivos soltos na raiz de doc_projeto/ (ex: user_stories.md)', () => {
            const docFolder = path.join(tmpRoot, 'doc_projeto');
            fs.mkdirSync(docFolder, { recursive: true });
            fs.writeFileSync(path.join(docFolder, 'user_stories.md'), '## US-001: X\nY');
            assert.deepStrictEqual(listStoryFolders(tmpRoot), []);
        });
    });

    describe('listPendingPoStories', () => {
        it('retorna vazio quando user_stories.md nao existe', () => {
            assert.deepStrictEqual(listPendingPoStories(tmpRoot, []), []);
        });

        it('retorna os blocos que ainda nao tem pasta propria', () => {
            const docFolder = path.join(tmpRoot, 'doc_projeto');
            fs.mkdirSync(docFolder, { recursive: true });
            fs.writeFileSync(
                path.join(docFolder, 'user_stories.md'),
                '## US-001: Ja especificada\nConteudo A\n\n## US-002: Ainda pendente\nConteudo B'
            );
            const pending = listPendingPoStories(tmpRoot, ['US-001']);
            assert.strictEqual(pending.length, 1);
            assert.strictEqual(pending[0].id, 'US-002');
        });

        it('retorna vazio quando user_stories.md existe mas esta vazio', () => {
            const docFolder = path.join(tmpRoot, 'doc_projeto');
            fs.mkdirSync(docFolder, { recursive: true });
            fs.writeFileSync(path.join(docFolder, 'user_stories.md'), '   ');
            assert.deepStrictEqual(listPendingPoStories(tmpRoot, []), []);
        });
    });

    describe('getActiveStorySlug / setActiveStorySlug', () => {
        it('retorna undefined antes de qualquer set', () => {
            const context = createFakeContext();
            assert.strictEqual(getActiveStorySlug(context), undefined);
        });

        it('guarda e devolve o slug definido', async () => {
            const context = createFakeContext();
            await setActiveStorySlug(context, 'checkout');
            assert.strictEqual(getActiveStorySlug(context), 'checkout');
        });
    });

    describe('resolveStoryDocPath', () => {
        it('sem slug ativo, resolve (e cria) doc_projeto/ direto na raiz', () => {
            const context = createFakeContext();
            const docPath = resolveStoryDocPath(tmpRoot, context);
            assert.strictEqual(docPath, path.join(tmpRoot, 'doc_projeto'));
            assert.ok(fs.existsSync(docPath));
        });

        it('com slug ativo, resolve (e cria) a subpasta doc_projeto/<slug>', async () => {
            const context = createFakeContext();
            await setActiveStorySlug(context, 'checkout');
            const docPath = resolveStoryDocPath(tmpRoot, context);
            assert.strictEqual(docPath, path.join(tmpRoot, 'doc_projeto', 'checkout'));
            assert.ok(fs.existsSync(docPath));
        });
    });

    describe('ensureNewStorySlug', () => {
        it('usa o nome sugerido sem perguntar nada ao usuario', async () => {
            const context = createFakeContext();
            const showInputBox = sandbox.stub(vscode.window, 'showInputBox').resolves('nao deveria ser chamado');
            const docPath = await ensureNewStorySlug(tmpRoot, context, 'US-001');
            assert.strictEqual(docPath, path.join(tmpRoot, 'doc_projeto', 'us-001'));
            assert.strictEqual(getActiveStorySlug(context), 'us-001');
            assert.ok(fs.existsSync(docPath));
            assert.strictEqual(showInputBox.called, false);
        });

        it('sem nome sugerido, pergunta ao usuario e usa a resposta', async () => {
            const context = createFakeContext();
            sandbox.stub(vscode.window, 'showInputBox').resolves('Meu Checkout');
            const docPath = await ensureNewStorySlug(tmpRoot, context);
            assert.strictEqual(docPath, path.join(tmpRoot, 'doc_projeto', 'meu-checkout'));
            assert.strictEqual(getActiveStorySlug(context), 'meu-checkout');
        });

        it('se o usuario cancelar o prompt, cai num slug com timestamp', async () => {
            const context = createFakeContext();
            sandbox.stub(vscode.window, 'showInputBox').resolves(undefined);
            const docPath = await ensureNewStorySlug(tmpRoot, context);
            const slug = getActiveStorySlug(context)!;
            assert.match(slug, /^historia-\d{12}$/);
            assert.strictEqual(docPath, path.join(tmpRoot, 'doc_projeto', slug));
        });
    });

    describe('importPoStory', () => {
        const story = { id: 'US-003', titulo: 'Formalizar KPI', conteudo: '## US-003: Formalizar KPI\nDetalhe da historia.' };

        it('grava o arquivo direto quando ainda nao existe', async () => {
            const context = createFakeContext();
            const showWarning = sandbox.stub(vscode.window, 'showWarningMessage');
            const targetDocPath = await importPoStory(tmpRoot, context, story);
            assert.ok(targetDocPath);
            const written = fs.readFileSync(path.join(targetDocPath!, 'user_story.md'), 'utf8');
            assert.ok(written.includes('Origem: user_stories.md (PO Agent) — US-003'));
            assert.ok(written.includes('Detalhe da historia.'));
            assert.strictEqual(showWarning.called, false);
        });

        it('sobrescreve sem perguntar se o conteudo existente e so o template vazio', async () => {
            const context = createFakeContext();
            const docPath = await ensureNewStorySlug(tmpRoot, context, story.id);
            fs.writeFileSync(path.join(docPath, 'user_story.md'), '# User Story\nDESCREVA AQUI o que voce precisa.');
            const showWarning = sandbox.stub(vscode.window, 'showWarningMessage');

            const targetDocPath = await importPoStory(tmpRoot, context, story);

            assert.ok(targetDocPath);
            assert.strictEqual(showWarning.called, false);
            const written = fs.readFileSync(path.join(targetDocPath!, 'user_story.md'), 'utf8');
            assert.ok(written.includes('Detalhe da historia.'));
        });

        it('pede confirmacao quando ja ha conteudo real, e respeita "Sobrescrever"', async () => {
            const context = createFakeContext();
            const docPath = await ensureNewStorySlug(tmpRoot, context, story.id);
            const existingReal = 'A'.repeat(150);
            fs.writeFileSync(path.join(docPath, 'user_story.md'), existingReal);
            sandbox.stub(vscode.window, 'showWarningMessage').resolves('Sobrescrever' as unknown as vscode.MessageItem);

            const targetDocPath = await importPoStory(tmpRoot, context, story);

            assert.ok(targetDocPath);
            const written = fs.readFileSync(path.join(targetDocPath!, 'user_story.md'), 'utf8');
            assert.ok(written.includes('Detalhe da historia.'));
        });

        it('pede confirmacao e preserva o arquivo quando o usuario cancela', async () => {
            const context = createFakeContext();
            const docPath = await ensureNewStorySlug(tmpRoot, context, story.id);
            const existingReal = 'B'.repeat(150);
            fs.writeFileSync(path.join(docPath, 'user_story.md'), existingReal);
            sandbox.stub(vscode.window, 'showWarningMessage').resolves('Cancelar' as unknown as vscode.MessageItem);

            const targetDocPath = await importPoStory(tmpRoot, context, story);

            assert.strictEqual(targetDocPath, undefined);
            const preserved = fs.readFileSync(path.join(docPath, 'user_story.md'), 'utf8');
            assert.strictEqual(preserved, existingReal);
        });
    });

    describe('createBlankUserStory', () => {
        it('sem historia ativa, pergunta o nome e cria pasta + template + technical_spec', async () => {
            const context = createFakeContext();
            sandbox.stub(vscode.window, 'showInputBox').resolves('Nova Feature');

            const targetDocPath = await createBlankUserStory(tmpRoot, context, 'Java 21 + Spring Boot');

            assert.strictEqual(targetDocPath, path.join(tmpRoot, 'doc_projeto', 'nova-feature'));
            const story = fs.readFileSync(path.join(targetDocPath, 'user_story.md'), 'utf8');
            assert.ok(story.includes('DESCREVA AQUI'));
            assert.ok(story.includes('Java 21 + Spring Boot'));
            assert.ok(fs.existsSync(path.join(targetDocPath, 'technical_spec.md')));
        });

        it('com historia ja ativa, reaproveita a mesma pasta sem perguntar nada', async () => {
            const context = createFakeContext();
            await setActiveStorySlug(context, 'checkout');
            const showInputBox = sandbox.stub(vscode.window, 'showInputBox');

            const targetDocPath = await createBlankUserStory(tmpRoot, context, 'Angular 18+');

            assert.strictEqual(targetDocPath, path.join(tmpRoot, 'doc_projeto', 'checkout'));
            assert.strictEqual(showInputBox.called, false);
        });

        it('nao sobrescreve technical_spec.md se ja existir', async () => {
            const context = createFakeContext();
            await setActiveStorySlug(context, 'checkout');
            const docPath = resolveStoryDocPath(tmpRoot, context);
            fs.writeFileSync(path.join(docPath, 'technical_spec.md'), 'conteudo tecnico ja preenchido');

            await createBlankUserStory(tmpRoot, context, 'Angular 18+');

            const techSpec = fs.readFileSync(path.join(docPath, 'technical_spec.md'), 'utf8');
            assert.strictEqual(techSpec, 'conteudo tecnico ja preenchido');
        });
    });
});
