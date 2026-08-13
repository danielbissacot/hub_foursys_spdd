import * as assert from 'assert';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { readProjectMap } from '../src/engine/prompt-context';

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
});
