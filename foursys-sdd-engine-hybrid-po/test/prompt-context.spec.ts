import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { readProjectMap, readCoverageReport } from '../src/engine/prompt-context';

function escrever(root: string, relativo: string, conteudo = ''): void {
    const full = path.join(root, relativo);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, conteudo);
}

describe('prompt-context.ts', () => {
    let tmpRoot: string;

    beforeEach(() => {
        tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'foursys-ctx-test-'));
    });

    afterEach(() => {
        fs.rmSync(tmpRoot, { recursive: true, force: true });
    });

    describe('readProjectMap', () => {
        it('retorna vazio quando o projeto nao tem src/', () => {
            assert.strictEqual(readProjectMap(tmpRoot, 'spring_boot'), '');
        });

        // Regressao do teste E2E ESCRI_19223: com so a lista de pastas, a fase Tasks viu
        // adapter/exception/handler/ "vazia" e propos criar um GlobalExceptionHandler, sem
        // enxergar os handlers que ja existiam ali.
        it('lista os nomes ja existentes em cada pasta, nao so o caminho', () => {
            escrever(tmpRoot, 'src/main/java/br/com/x/adapter/exception/handler/RestExceptionHandler.java');
            escrever(tmpRoot, 'src/main/java/br/com/x/adapter/exception/handler/BusinessExceptionHandler.java');

            const mapa = readProjectMap(tmpRoot, 'spring_boot');

            assert.ok(mapa.includes('src/main/java/br/com/x/adapter/exception/handler'));
            assert.ok(mapa.includes('RestExceptionHandler'), 'deveria citar o handler existente');
            assert.ok(mapa.includes('BusinessExceptionHandler'), 'deveria citar o handler existente');
            assert.ok(!mapa.includes('.java'), 'nome vai sem extensao, para economizar token');
        });

        // O limite de profundidade era 8, mas src/main/java/br/com/empresa/proj/ ja gasta 7
        // niveis so de prefixo: o mapa morria em .../adapter e nunca listava
        // .../adapter/exception/handler. A pasta nem chegava no prompt.
        it('alcanca pacote Java profundo, alem do prefixo src/main/java/br/com/...', () => {
            escrever(tmpRoot, 'src/main/java/br/com/bradesco/kit/srv/adapter/exception/handler/RestExceptionHandler.java');
            escrever(tmpRoot, 'src/main/java/br/com/bradesco/kit/srv/adapter/input/boleto/api/dto/mapper/BoletoMapper.java');

            const mapa = readProjectMap(tmpRoot, 'spring_boot');

            assert.ok(mapa.includes('adapter/exception/handler'), 'pasta profunda deveria aparecer');
            assert.ok(mapa.includes('RestExceptionHandler'));
            assert.ok(mapa.includes('BoletoMapper'), 'pasta ainda mais profunda deveria aparecer');
        });

        it('nao gasta linha com pasta de passagem que nao tem arquivo (br/, com/, ...)', () => {
            escrever(tmpRoot, 'src/main/java/br/com/x/Servico.java');

            const mapa = readProjectMap(tmpRoot, 'spring_boot');
            const linhasDePasta = mapa.split('\n').filter(l => l.startsWith('  src'));

            assert.strictEqual(linhasDePasta.length, 1, 'so a pasta que tem conteudo vira linha');
            assert.ok(linhasDePasta[0].includes('src/main/java/br/com/x'));
        });

        it('manda instrucao explicita de reusar o que ja existe antes de criar arquivo novo', () => {
            escrever(tmpRoot, 'src/main/java/br/com/x/Application.java');
            const mapa = readProjectMap(tmpRoot, 'spring_boot');
            assert.ok(/REUSE o existente/.test(mapa));
        });

        it('em Angular, colapsa o trio .ts/.html/.scss num unico nome', () => {
            escrever(tmpRoot, 'src/app/boleto/boleto.component.ts');
            escrever(tmpRoot, 'src/app/boleto/boleto.component.html');
            escrever(tmpRoot, 'src/app/boleto/boleto.component.scss');

            const mapa = readProjectMap(tmpRoot, 'angular');
            const ocorrencias = mapa.split('boleto.component').length - 1;

            assert.strictEqual(ocorrencias, 1, 'o mesmo componente nao deve aparecer tres vezes');
        });

        it('ignora arquivo de extensao que nao pertence a stack', () => {
            escrever(tmpRoot, 'src/main/java/br/com/x/Servico.java');
            escrever(tmpRoot, 'src/main/java/br/com/x/anotacao.txt');

            const mapa = readProjectMap(tmpRoot, 'spring_boot');

            assert.ok(mapa.includes('Servico'));
            assert.ok(!mapa.includes('anotacao'));
        });

        it('pega o groupId do projeto no pom.xml, nao o do <parent>', () => {
            escrever(tmpRoot, 'src/main/java/br/com/x/Application.java');
            escrever(tmpRoot, 'pom.xml', [
                '<project>',
                '  <parent>',
                '    <groupId>org.springframework.boot</groupId>',
                '    <artifactId>spring-boot-starter-parent</artifactId>',
                '  </parent>',
                '  <groupId>br.com.bradesco.kit</groupId>',
                '</project>',
            ].join('\n'));

            const mapa = readProjectMap(tmpRoot, 'spring_boot');

            assert.ok(mapa.includes('br.com.bradesco.kit'));
            assert.ok(!mapa.includes('org.springframework.boot'));
        });

        it('nao entra em node_modules nem em pastas ocultas', () => {
            escrever(tmpRoot, 'src/app/real/servico.ts');
            escrever(tmpRoot, 'src/node_modules/lixo/index.ts');
            escrever(tmpRoot, 'src/.cache/tmp.ts');

            const mapa = readProjectMap(tmpRoot, 'angular');

            assert.ok(mapa.includes('servico'));
            assert.ok(!mapa.includes('node_modules'));
            assert.ok(!mapa.includes('.cache'));
        });
    });

    // A cobertura do Angular tem tres degraus: coverage-summary.json, lcov.info e, sem nenhum
    // dos dois, o aviso de "nao afirme percentual". So o terceiro tinha sido exercitado — o
    // ambiente do cliente esta com o npm install travado no Nexus, entao nunca houve arquivo real
    // para ler. Numero errado e PIOR que numero nenhum aqui: o texto injetado manda a IA usar o
    // valor sem recalcular, entao um erro de soma vira percentual errado afirmado com autoridade.
    describe('readCoverageReport — leitura de cobertura JS', () => {
        it('soma LF/LH e BRF/BRH de TODOS os registros do lcov, nao so do primeiro', () => {
            escrever(tmpRoot, 'coverage/lcov.info', [
                'TN:', 'SF:src/a.ts', 'LF:100', 'LH:85', 'BRF:20', 'BRH:15', 'end_of_record',
                'TN:', 'SF:src/b.ts', 'LF:50', 'LH:40', 'BRF:10', 'BRH:8', 'end_of_record',
                'TN:', 'SF:src/c.ts', 'LF:50', 'LH:25', 'BRF:10', 'BRH:2', 'end_of_record',
            ].join(String.fromCharCode(10)));

            const saida = readCoverageReport(tmpRoot, 'angular');

            // 150/200 linhas e 25/40 branches
            assert.ok(saida.includes('75.00%'), `esperava 75.00% de linha, veio: ${saida}`);
            assert.ok(saida.includes('62.50%'), `esperava 62.50% de branch, veio: ${saida}`);
            assert.ok(saida.includes('lcov.info'), 'deveria citar a fonte lida');
        });

        it('prefere coverage-summary.json quando existe, e usa os pct de la', () => {
            escrever(tmpRoot, 'coverage/coverage-summary.json', JSON.stringify({
                total: { lines: { pct: 91.5 }, branches: { pct: 88.25 } }
            }));
            // lcov com numeros DIFERENTES: se a saida trouxer estes, a precedencia esta invertida
            escrever(tmpRoot, 'coverage/lcov.info',
                ['SF:src/a.ts', 'LF:10', 'LH:1', 'BRF:10', 'BRH:1', 'end_of_record'].join(String.fromCharCode(10)));

            const saida = readCoverageReport(tmpRoot, 'angular');

            assert.ok(saida.includes('91.50%'), `esperava 91.50% do summary, veio: ${saida}`);
            assert.ok(saida.includes('88.25%'), `esperava 88.25% do summary, veio: ${saida}`);
            assert.ok(!saida.includes('10.00%'), 'nao podia ter usado o lcov havendo summary');
        });

        it('acha o lcov aninhado por nome de projeto, como o Karma escreve', () => {
            escrever(tmpRoot, 'coverage/meu-projeto/lcov.info',
                ['SF:src/a.ts', 'LF:200', 'LH:100', 'BRF:0', 'BRH:0', 'end_of_record'].join(String.fromCharCode(10)));

            const saida = readCoverageReport(tmpRoot, 'angular');

            assert.ok(saida.includes('50.00%'), `esperava 50.00% de linha, veio: ${saida}`);
        });

        it('diz que branch nao foi reportado quando BRF e zero, em vez de dividir por zero', () => {
            escrever(tmpRoot, 'coverage/lcov.info',
                ['SF:src/a.ts', 'LF:80', 'LH:60', 'BRF:0', 'BRH:0', 'end_of_record'].join(String.fromCharCode(10)));

            const saida = readCoverageReport(tmpRoot, 'angular');

            assert.ok(saida.includes('75.00%'), 'linha deveria sair normal');
            assert.ok(!saida.includes('NaN'), 'nao pode vazar NaN para o prompt');
            assert.ok(/nao reportado|não reportado/i.test(saida), `esperava aviso de branch ausente, veio: ${saida}`);
        });

        it('sem relatorio legivel, avisa para NAO afirmar percentual e nao inventa numero', () => {
            const saida = readCoverageReport(tmpRoot, 'angular');

            assert.ok(/NAO afirme|NÃO afirme/i.test(saida), 'deveria proibir afirmar percentual');
            assert.ok(!/\d+[.,]\d+%/.test(saida), `nao podia conter percentual nenhum: ${saida}`);
        });

        it('nao dispara para spring_boot — o caminho do Maven segue intocado', () => {
            escrever(tmpRoot, 'coverage/lcov.info',
                ['SF:src/a.ts', 'LF:100', 'LH:99', 'BRF:0', 'BRH:0', 'end_of_record'].join(String.fromCharCode(10)));

            const saida = readCoverageReport(tmpRoot, 'spring_boot');

            assert.ok(!saida.includes('99.00%'), 'spring_boot nao pode ler lcov de projeto JS');
        });
    });

});
