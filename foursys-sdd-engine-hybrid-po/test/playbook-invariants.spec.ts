import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

const SDD = path.join(process.cwd(), 'catalog', 'sdd');
const STACKS = fs.readdirSync(SDD).filter(d => fs.statSync(path.join(SDD, d)).isDirectory());

/**
 * Em 14/08/2026 a correcao do @pendente-po foi escrita em generic/foursys-qa-test-plan.md e
 * falhou QUATRO rodadas seguidas. O motivo nao era a IA: loadPlaybookForStack procura
 * `<stack>/foursys-<fase>.md` PRIMEIRO e so cai no generic como fallback. Como existe um
 * spring_boot/foursys-qa-test-plan.md, o generic nunca foi lido em projeto Java.
 *
 * Este teste trava a armadilha: se uma regra vive no generic de uma fase que TEM versao por
 * stack, ela e invisivel para aquela stack. O teste falha e diz onde falta.
 */
describe('invariantes dos playbooks', () => {
    // Fase -> marcadores que a regra precisa ter, em TODA pasta que sobrescreve o generic.
    const REGRAS: Record<string, string[]> = {
        'qa-test-plan': ['pendente-po', 'Suposições'],
    };

    for (const [fase, marcadores] of Object.entries(REGRAS)) {
        for (const stack of STACKS) {
            const arquivo = path.join(SDD, stack, `foursys-${fase}.md`);
            if (!fs.existsSync(arquivo)) { continue; }  // stack usa o generic: nada a checar
            it(`${stack}/foursys-${fase}.md tem as regras do generic`, () => {
                const texto = fs.readFileSync(arquivo, 'utf-8');
                for (const m of marcadores) {
                    assert.ok(
                        texto.includes(m),
                        `"${m}" falta em ${stack}/foursys-${fase}.md. Esse arquivo SOBRESCREVE o generic ` +
                        `para a stack ${stack} — escrever a regra so no generic nao tem efeito nenhum aqui.`
                    );
                }
            });
        }
    }

    it('toda pasta de stack tem playbook lido, nao orfao', () => {
        for (const stack of STACKS.filter(s => s !== 'generic')) {
            for (const f of fs.readdirSync(path.join(SDD, stack)).filter(f => f.startsWith('foursys-'))) {
                const fase = f.replace('foursys-', '').replace('.md', '');
                assert.ok(
                    !['tasks', 'specify'].includes(fase),
                    `${stack}/${f} nunca e carregado: a fase "${fase}" le SEMPRE o generic ` +
                    `(ver loadPlaybookForStack). Editar este arquivo nao surte efeito.`
                );
            }
        }
    });
});
