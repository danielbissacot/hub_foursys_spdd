# Deploy do Worker de Telemetria

Passos manuais (exigem sua conta Cloudflare — gratuita — e o token do GitHub):

1. **Gerar o token do GitHub** (se ainda não tiver): em `github.com/settings/tokens` → "Fine-grained tokens" → "Generate new token".
   - Repository access: apenas `danielbissacot/sdd-telemetry-data`.
   - Permissions: `Contents` → `Read and write`. Nada além disso.

2. **Instalar o Wrangler** (CLI da Cloudflare), se ainda não tiver:
   ```
   npm install -g wrangler
   ```

3. **Login na Cloudflare**:
   ```
   wrangler login
   ```

4. **Configurar o token como secret** (dentro desta pasta `telemetry-worker/`):
   ```
   wrangler secret put GITHUB_TOKEN
   ```
   Cole o token gerado no passo 1 quando pedido.

5. **Configurar o freio de autenticação simples (escrita)**:
   ```bash
   wrangler secret put SHARED_SECRET
   ```
   Use o mesmo valor que está em `TELEMETRY_SHARED_SECRET` (`src/telemetry.ts`). Sem essa variável configurada, o Worker aceita POSTs sem checar o header — mantenha os dois em sincronia sempre que trocar o valor.

6. **Configurar o token de leitura pro botão "Atualizar dados" do dashboard (opcional)**:
   ```bash
   wrangler secret put DASHBOARD_READ_SECRET
   ```
   Escolha um valor **diferente** do `SHARED_SECRET` (um protege escrita, o outro leitura). Esse valor precisa ser o mesmo passado como `DASHBOARD_READ_SECRET` ao rodar `node generate-report.js` (ver `foursys-sdd-engine-hibrid-dashboard/README.md`). Sem essa variável configurada, o endpoint GET fica sempre bloqueado (401) — é seguro por padrão, já que devolve e-mails reais.

7. **Publicar o Worker**:
   ```bash
   wrangler deploy
   ```
   Isso vai imprimir a URL pública, algo como `https://foursys-sdd-telemetry.<seu-usuario>.workers.dev`.

8. **Colar a URL na extensão**: abra `src/telemetry.ts` e defina:
   ```ts
   const TELEMETRY_ENDPOINT = 'https://foursys-sdd-telemetry.<seu-usuario>.workers.dev';
   ```
   Recompile a extensão (`npm run compile` ou `vsce package`).

## Testar

Escrita (POST — usado pela extensão):
```bash
curl -X POST https://foursys-sdd-telemetry.<seu-usuario>.workers.dev \
  -H "Content-Type: application/json" \
  -H "X-Foursys-Token: <mesmo valor do SHARED_SECRET>" \
  -d '{"email":"teste@foursys.com","event":"teste_manual","command":"specify","stack":"angular"}'
```

Sem o header `X-Foursys-Token` correto (quando `SHARED_SECRET` está configurado), o Worker responde `401 Unauthorized`.

Leitura (GET — usado pelo botão "Atualizar dados" do dashboard):
```bash
curl https://foursys-sdd-telemetry.<seu-usuario>.workers.dev \
  -H "X-Foursys-Token: <mesmo valor do DASHBOARD_READ_SECRET>"
```

Sem o header correto (ou sem `DASHBOARD_READ_SECRET` configurado), o Worker sempre responde `401 Unauthorized` — esse endpoint nunca fica aberto por padrão.

Depois, confira se apareceu um arquivo `events-AAAA-MM.jsonl` no repositório `sdd-telemetry-data`.
