// Testes unitarios rodam em Node puro, fora do host da extensao — o modulo 'vscode' so existe
// em runtime dentro do VS Code. Este hook intercepta `require('vscode')`/`import 'vscode'` e
// redireciona pro mock em test/mocks/vscode.js, carregado antes dos testes via
// `mocha --require test/register-vscode-mock.js`.
const Module = require('module');
const path = require('path');

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
    if (request === 'vscode') {
        return path.join(__dirname, 'mocks', 'vscode.js');
    }
    return originalResolveFilename.call(this, request, ...args);
};
