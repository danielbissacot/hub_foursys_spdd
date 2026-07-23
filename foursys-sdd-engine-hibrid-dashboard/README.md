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

O `GITHUB_TOKEN` nunca é salvo em disco nem embutido no `report.html` — só existe enquanto o comando roda, e é usado apenas aqui no terminal pra buscar os eventos.

## Botão "Atualizar dados" (opcional)

Se você também definir `DASHBOARD_READ_SECRET` (o mesmo valor configurado como secret `DASHBOARD_READ_SECRET` no Worker — ver `telemetry-worker/DEPLOY.md`), o relatório gerado ganha um botão **"🔄 Atualizar dados"** que busca os eventos mais recentes direto do navegador, sem precisar rodar o script de novo.

```bash
GITHUB_TOKEN=seu_token_aqui DASHBOARD_READ_SECRET=seu_read_secret_aqui node generate-report.js
```

Esse botão **não usa o `GITHUB_TOKEN`** — ele chama um endpoint próprio do Worker (que guarda o `GITHUB_TOKEN` em segredo do lado do servidor) autenticado com o `DASHBOARD_READ_SECRET`, um valor separado e de escopo bem mais limitado: só serve pra reler os mesmos eventos que já estão no `report.html`, não dá acesso de escrita nem navegação livre no repositório. Sem `DASHBOARD_READ_SECRET` definido, o relatório é gerado sem o botão (modo estático, como sempre foi).

## Resultado

Gera `report.html` nesta mesma pasta (não versionado — contém e-mails reais de colegas). Abra esse arquivo direto no navegador — já mostra o snapshot do momento em que foi gerado.

Dentro do relatório é possível filtrar por stack, tipo de evento e intervalo de datas, além de exportar os dados filtrados em CSV — tudo processado localmente no navegador.

⚠️ **Atenção**: o `report.html` contém e-mails reais de colegas (e, se você gerou com o botão de atualização, um `DASHBOARD_READ_SECRET` de escopo limitado). **Nunca compartilhe, envie por e-mail, publique ou faça upload desse arquivo em nenhum lugar.** O `.gitignore` da pasta já impede o `report.html` de ir pro controle de versão, mas a responsabilidade de não compartilhar o arquivo manualmente é sua.
