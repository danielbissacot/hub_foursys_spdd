import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { detectarPlaceholders } from '../src/engine/prompt-context';

const SDD = path.join(process.cwd(), 'catalog', 'sdd');

/**
 * O achado que motivou estes testes: em 17/08/2026 eu adicionei ao playbook de Tasks o placeholder
 * `<PASTA DA HISTÓRIA ATIVA, ...>` e, no mesmo dia, o detector nao o pegava — tinha 67 caracteres e
 * o regex parava em 60. Um teste de tres linhas teria visto na hora.
 *
 * Os dois lados importam:
 *  - todo placeholder que os playbooks escrevem tem de ser DETECTADO se sobreviver no documento;
 *  - nenhum documento correto pode disparar alarme, senao o aviso vira ruido e ninguem le.
 */
describe('detectarPlaceholders — guarda dos dois lados', () => {
    const tasks = fs.readFileSync(path.join(SDD, 'generic', 'foursys-tasks.md'), 'utf-8');

    // Extrai do proprio playbook os placeholders que ele usa, em vez de manter lista a mao.
    const doPlaybook = [...new Set([
        ...(tasks.match(/<[^<>\n]{3,120}>/g) ?? []),
        ...(tasks.match(/\[[A-ZÀ-Ú][^\]\n]{3,120}\](?!\()/g) ?? []),
    ])].filter(p => !/^\[!/.test(p));  // [!CAUTION] e sintaxe de alerta, nao lacuna

    it('o playbook de Tasks realmente tem placeholders para checar', () => {
        assert.ok(doPlaybook.length >= 3, `esperava >= 3, achei ${doPlaybook.length}`);
    });

    for (const ph of doPlaybook) {
        it(`detecta "${ph.slice(0, 45)}" se sobrar no documento`, () => {
            const achado = detectarPlaceholders(`- Arquivo impactado: ${ph}\n`, tasks);
            assert.ok(achado.includes(ph), `"${ph}" existe no playbook mas o detector nao acusa`);
        });
    }

    it('Tarefa ZZ/XX/NN sempre acusa, e numero real nunca', () => {
        for (const p of ['ZZ', 'XX', 'NN']) {
            assert.ok(detectarPlaceholders(`**Tarefa ${p}: X**`).includes(`Tarefa ${p}`));
        }
        assert.strictEqual(detectarPlaceholders('**Tarefa 11: X**'), '');
    });

    it('nao acusa conteudo legitimo dos nossos documentos', () => {
        const legitimo = [
            '- **[Atualização por Operação Elegível]** → Se X → Y',   // nome de regra: texto livre
            '- **C1 — [SUPOSIÇÃO S1]** entrada REST',                  // marcacao da correcao 9
            '- **Status:** [AJUSTADA]',                                // status INVEST
            '> [!CAUTION]',                                            // alerta GitHub
            '- [x] feito  /  - [ ] aberto',                            // checkbox
            'Usa `List<Boleto>`, `Optional<String>` e `Map<String, Object>`',  // generics
            'Veja o [plano de testes](docs/PLANO.md)',                  // link markdown
        ].join('\n');
        assert.strictEqual(detectarPlaceholders(legitimo, tasks), '', 'documento legitimo disparou alarme');
    });

    it('sem o texto do playbook, nao arrisca falso positivo em < > e [ ]', () => {
        assert.strictEqual(detectarPlaceholders('- Arquivo: <pasta-da-história>/x.md'), '');
        assert.ok(detectarPlaceholders('**Tarefa ZZ: X**').includes('Tarefa ZZ'));
    });
});
