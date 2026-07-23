// Mock minimo do modulo 'vscode' para testes unitarios fora do host da extensao.
// So implementa o que o codigo sob teste realmente CHAMA em runtime — tipos como
// vscode.ExtensionContext sao apagados na compilacao TS e nao precisam de implementacao aqui.
// Os testes usam sinon.stub(vscode.window, 'showInputBox') etc. para controlar o retorno.
module.exports = {
    window: {
        showInputBox: async () => undefined,
        showWarningMessage: async () => undefined,
        showOpenDialog: async () => undefined,
        showInformationMessage: async () => undefined,
        showQuickPick: async () => undefined,
        showTextDocument: async () => undefined,
    },
    workspace: {
        openTextDocument: async () => undefined,
    }
};
