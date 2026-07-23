// Precisa rodar ANTES de "ts-node/register" no array "require" do .mocharc.json — aponta o
// ts-node pro tsconfig de testes (rootDir diferente do tsconfig principal, que so cobre src/).
process.env.TS_NODE_PROJECT = require('path').join(__dirname, 'tsconfig.json');
process.env.TS_NODE_TRANSPILE_ONLY = 'true';
