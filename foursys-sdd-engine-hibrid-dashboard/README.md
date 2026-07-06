# Dashboard de Telemetria — Foursys SDD Hybrid PO

Gera um relatório HTML local (Bootstrap + Chart.js) a partir dos eventos de uso salvos no repositório privado `sdd-telemetry-data`.

## Como rodar

Precisa de um GitHub fine-grained token com acesso de leitura ao repositório `sdd-telemetry-data` (o mesmo tipo de token usado pelo Worker, só que aqui usado apenas pra ler).

**PowerShell:**
```
$env:GITHUB_TOKEN="seu_token_aqui"
node generate-report.js
```

**Git Bash:**
```
GITHUB_TOKEN=seu_token_aqui node generate-report.js
```

O token nunca é salvo em disco — só existe enquanto o comando roda.

## Resultado

Gera `report.html` nesta mesma pasta (não versionado — contém e-mails reais de colegas). Abra esse arquivo direto no navegador — já mostra o snapshot do momento em que foi gerado.

## Atualizar dados sem rodar o script de novo

O `report.html` tem um botão **"🔄 Atualizar dados"** no topo da página — clique e ele busca os dados mais recentes direto do GitHub, no próprio navegador, sem precisar voltar ao terminal.

⚠️ **Atenção**: por decisão explícita, o token (só leitura) fica **gravado dentro do próprio arquivo `report.html`** gerado, pra esse botão funcionar sozinho. Isso significa:
- **Nunca compartilhe, envie por e-mail, publique ou faça upload desse arquivo em nenhum lugar** — quem tiver o arquivo ganha acesso de leitura ao repositório de telemetria (que contém e-mails de colegas).
- O `.gitignore` da pasta já impede o `report.html` de ir pro controle de versão, mas a responsabilidade de não compartilhar o arquivo manualmente é sua.
- Se o token vazar (por exemplo, se o arquivo for compartilhado sem querer), revogue-o no GitHub e gere um novo (mesmo processo de sempre), depois rode `generate-report.js` de novo pra gerar um `report.html` com o token atualizado.
