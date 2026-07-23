"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const sinon = __importStar(require("sinon"));
const vscode = __importStar(require("vscode"));
const utils_1 = require("../src/utils");
function createFakeContext() {
    const store = {};
    return {
        workspaceState: {
            get: (key) => store[key],
            update: async (key, value) => { store[key] = value; }
        }
    };
}
describe('utils.ts', () => {
    let tmpRoot;
    let sandbox;
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
            assert.strictEqual((0, utils_1.slugifyStoryName)('Login e Autenticação'), 'login-e-autenticacao');
        });
        it('remove caracteres especiais e colapsa hifens', () => {
            assert.strictEqual((0, utils_1.slugifyStoryName)('  Checkout!! #2 (novo) '), 'checkout-2-novo');
        });
        it('cai em "historia" quando o resultado fica vazio', () => {
            assert.strictEqual((0, utils_1.slugifyStoryName)('###'), 'historia');
            assert.strictEqual((0, utils_1.slugifyStoryName)('   '), 'historia');
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
            const blocks = (0, utils_1.parseUserStoryBlocks)(raw);
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
            assert.deepStrictEqual((0, utils_1.parseUserStoryBlocks)('# Sem historias ainda\nSó um rascunho.'), []);
        });
        it('retorna lista vazia para texto vazio', () => {
            assert.deepStrictEqual((0, utils_1.parseUserStoryBlocks)(''), []);
        });
        it('fecha o ultimo bloco no fim do arquivo quando nao ha "Resumo do Backlog"', () => {
            const raw = '## US-005: Ultima historia\nConteudo final sem secao de resumo.';
            const blocks = (0, utils_1.parseUserStoryBlocks)(raw);
            assert.strictEqual(blocks.length, 1);
            assert.strictEqual(blocks[0].id, 'US-005');
            assert.ok(blocks[0].conteudo.includes('Conteudo final sem secao de resumo.'));
        });
    });
    describe('listStoryFolders', () => {
        it('retorna vazio quando doc_projeto/ nao existe', () => {
            assert.deepStrictEqual((0, utils_1.listStoryFolders)(tmpRoot), []);
        });
        it('lista subpastas de doc_projeto/ em ordem alfabetica, excluindo qa/screens', () => {
            const docFolder = path.join(tmpRoot, 'doc_projeto');
            for (const name of ['US-002', 'US-001', 'qa', 'screens', 'login']) {
                fs.mkdirSync(path.join(docFolder, name), { recursive: true });
            }
            assert.deepStrictEqual((0, utils_1.listStoryFolders)(tmpRoot), ['US-001', 'US-002', 'login']);
        });
        it('ignora arquivos soltos na raiz de doc_projeto/ (ex: user_stories.md)', () => {
            const docFolder = path.join(tmpRoot, 'doc_projeto');
            fs.mkdirSync(docFolder, { recursive: true });
            fs.writeFileSync(path.join(docFolder, 'user_stories.md'), '## US-001: X\nY');
            assert.deepStrictEqual((0, utils_1.listStoryFolders)(tmpRoot), []);
        });
    });
    describe('listPendingPoStories', () => {
        it('retorna vazio quando user_stories.md nao existe', () => {
            assert.deepStrictEqual((0, utils_1.listPendingPoStories)(tmpRoot, []), []);
        });
        it('retorna os blocos que ainda nao tem pasta propria', () => {
            const docFolder = path.join(tmpRoot, 'doc_projeto');
            fs.mkdirSync(docFolder, { recursive: true });
            fs.writeFileSync(path.join(docFolder, 'user_stories.md'), '## US-001: Ja especificada\nConteudo A\n\n## US-002: Ainda pendente\nConteudo B');
            const pending = (0, utils_1.listPendingPoStories)(tmpRoot, ['US-001']);
            assert.strictEqual(pending.length, 1);
            assert.strictEqual(pending[0].id, 'US-002');
        });
        it('retorna vazio quando user_stories.md existe mas esta vazio', () => {
            const docFolder = path.join(tmpRoot, 'doc_projeto');
            fs.mkdirSync(docFolder, { recursive: true });
            fs.writeFileSync(path.join(docFolder, 'user_stories.md'), '   ');
            assert.deepStrictEqual((0, utils_1.listPendingPoStories)(tmpRoot, []), []);
        });
    });
    describe('getActiveStorySlug / setActiveStorySlug', () => {
        it('retorna undefined antes de qualquer set', () => {
            const context = createFakeContext();
            assert.strictEqual((0, utils_1.getActiveStorySlug)(context), undefined);
        });
        it('guarda e devolve o slug definido', async () => {
            const context = createFakeContext();
            await (0, utils_1.setActiveStorySlug)(context, 'checkout');
            assert.strictEqual((0, utils_1.getActiveStorySlug)(context), 'checkout');
        });
    });
    describe('resolveStoryDocPath', () => {
        it('sem slug ativo, resolve (e cria) doc_projeto/ direto na raiz', () => {
            const context = createFakeContext();
            const docPath = (0, utils_1.resolveStoryDocPath)(tmpRoot, context);
            assert.strictEqual(docPath, path.join(tmpRoot, 'doc_projeto'));
            assert.ok(fs.existsSync(docPath));
        });
        it('com slug ativo, resolve (e cria) a subpasta doc_projeto/<slug>', async () => {
            const context = createFakeContext();
            await (0, utils_1.setActiveStorySlug)(context, 'checkout');
            const docPath = (0, utils_1.resolveStoryDocPath)(tmpRoot, context);
            assert.strictEqual(docPath, path.join(tmpRoot, 'doc_projeto', 'checkout'));
            assert.ok(fs.existsSync(docPath));
        });
    });
    describe('ensureNewStorySlug', () => {
        it('usa o nome sugerido sem perguntar nada ao usuario', async () => {
            const context = createFakeContext();
            const showInputBox = sandbox.stub(vscode.window, 'showInputBox').resolves('nao deveria ser chamado');
            const docPath = await (0, utils_1.ensureNewStorySlug)(tmpRoot, context, 'US-001');
            assert.strictEqual(docPath, path.join(tmpRoot, 'doc_projeto', 'us-001'));
            assert.strictEqual((0, utils_1.getActiveStorySlug)(context), 'us-001');
            assert.ok(fs.existsSync(docPath));
            assert.strictEqual(showInputBox.called, false);
        });
        it('sem nome sugerido, pergunta ao usuario e usa a resposta', async () => {
            const context = createFakeContext();
            sandbox.stub(vscode.window, 'showInputBox').resolves('Meu Checkout');
            const docPath = await (0, utils_1.ensureNewStorySlug)(tmpRoot, context);
            assert.strictEqual(docPath, path.join(tmpRoot, 'doc_projeto', 'meu-checkout'));
            assert.strictEqual((0, utils_1.getActiveStorySlug)(context), 'meu-checkout');
        });
        it('se o usuario cancelar o prompt, cai num slug com timestamp', async () => {
            const context = createFakeContext();
            sandbox.stub(vscode.window, 'showInputBox').resolves(undefined);
            const docPath = await (0, utils_1.ensureNewStorySlug)(tmpRoot, context);
            const slug = (0, utils_1.getActiveStorySlug)(context);
            assert.match(slug, /^historia-\d{12}$/);
            assert.strictEqual(docPath, path.join(tmpRoot, 'doc_projeto', slug));
        });
    });
    describe('importPoStory', () => {
        const story = { id: 'US-003', titulo: 'Formalizar KPI', conteudo: '## US-003: Formalizar KPI\nDetalhe da historia.' };
        it('grava o arquivo direto quando ainda nao existe', async () => {
            const context = createFakeContext();
            const showWarning = sandbox.stub(vscode.window, 'showWarningMessage');
            const targetDocPath = await (0, utils_1.importPoStory)(tmpRoot, context, story);
            assert.ok(targetDocPath);
            const written = fs.readFileSync(path.join(targetDocPath, 'user_story.md'), 'utf8');
            assert.ok(written.includes('Origem: user_stories.md (PO Agent) — US-003'));
            assert.ok(written.includes('Detalhe da historia.'));
            assert.strictEqual(showWarning.called, false);
        });
        it('sobrescreve sem perguntar se o conteudo existente e so o template vazio', async () => {
            const context = createFakeContext();
            const docPath = await (0, utils_1.ensureNewStorySlug)(tmpRoot, context, story.id);
            fs.writeFileSync(path.join(docPath, 'user_story.md'), '# User Story\nDESCREVA AQUI o que voce precisa.');
            const showWarning = sandbox.stub(vscode.window, 'showWarningMessage');
            const targetDocPath = await (0, utils_1.importPoStory)(tmpRoot, context, story);
            assert.ok(targetDocPath);
            assert.strictEqual(showWarning.called, false);
            const written = fs.readFileSync(path.join(targetDocPath, 'user_story.md'), 'utf8');
            assert.ok(written.includes('Detalhe da historia.'));
        });
        it('pede confirmacao quando ja ha conteudo real, e respeita "Sobrescrever"', async () => {
            const context = createFakeContext();
            const docPath = await (0, utils_1.ensureNewStorySlug)(tmpRoot, context, story.id);
            const existingReal = 'A'.repeat(150);
            fs.writeFileSync(path.join(docPath, 'user_story.md'), existingReal);
            sandbox.stub(vscode.window, 'showWarningMessage').resolves('Sobrescrever');
            const targetDocPath = await (0, utils_1.importPoStory)(tmpRoot, context, story);
            assert.ok(targetDocPath);
            const written = fs.readFileSync(path.join(targetDocPath, 'user_story.md'), 'utf8');
            assert.ok(written.includes('Detalhe da historia.'));
        });
        it('pede confirmacao e preserva o arquivo quando o usuario cancela', async () => {
            const context = createFakeContext();
            const docPath = await (0, utils_1.ensureNewStorySlug)(tmpRoot, context, story.id);
            const existingReal = 'B'.repeat(150);
            fs.writeFileSync(path.join(docPath, 'user_story.md'), existingReal);
            sandbox.stub(vscode.window, 'showWarningMessage').resolves('Cancelar');
            const targetDocPath = await (0, utils_1.importPoStory)(tmpRoot, context, story);
            assert.strictEqual(targetDocPath, undefined);
            const preserved = fs.readFileSync(path.join(docPath, 'user_story.md'), 'utf8');
            assert.strictEqual(preserved, existingReal);
        });
    });
    describe('createBlankUserStory', () => {
        it('sem historia ativa, pergunta o nome e cria pasta + template + technical_spec', async () => {
            const context = createFakeContext();
            sandbox.stub(vscode.window, 'showInputBox').resolves('Nova Feature');
            const targetDocPath = await (0, utils_1.createBlankUserStory)(tmpRoot, context, 'Java 21 + Spring Boot');
            assert.strictEqual(targetDocPath, path.join(tmpRoot, 'doc_projeto', 'nova-feature'));
            const story = fs.readFileSync(path.join(targetDocPath, 'user_story.md'), 'utf8');
            assert.ok(story.includes('DESCREVA AQUI'));
            assert.ok(story.includes('Java 21 + Spring Boot'));
            assert.ok(fs.existsSync(path.join(targetDocPath, 'technical_spec.md')));
        });
        it('com historia ja ativa, reaproveita a mesma pasta sem perguntar nada', async () => {
            const context = createFakeContext();
            await (0, utils_1.setActiveStorySlug)(context, 'checkout');
            const showInputBox = sandbox.stub(vscode.window, 'showInputBox');
            const targetDocPath = await (0, utils_1.createBlankUserStory)(tmpRoot, context, 'Angular 18+');
            assert.strictEqual(targetDocPath, path.join(tmpRoot, 'doc_projeto', 'checkout'));
            assert.strictEqual(showInputBox.called, false);
        });
        it('nao sobrescreve technical_spec.md se ja existir', async () => {
            const context = createFakeContext();
            await (0, utils_1.setActiveStorySlug)(context, 'checkout');
            const docPath = (0, utils_1.resolveStoryDocPath)(tmpRoot, context);
            fs.writeFileSync(path.join(docPath, 'technical_spec.md'), 'conteudo tecnico ja preenchido');
            await (0, utils_1.createBlankUserStory)(tmpRoot, context, 'Angular 18+');
            const techSpec = fs.readFileSync(path.join(docPath, 'technical_spec.md'), 'utf8');
            assert.strictEqual(techSpec, 'conteudo tecnico ja preenchido');
        });
    });
});
//# sourceMappingURL=utils.spec.js.map