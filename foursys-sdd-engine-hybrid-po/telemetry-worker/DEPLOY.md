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

5. **Publicar o Worker**:
   ```
   wrangler deploy
   ```
   Isso vai imprimir a URL pública, algo como `https://foursys-sdd-telemetry.<seu-usuario>.workers.dev`.

6. **Colar a URL na extensão**: abra `src/telemetry.ts` e defina:
   ```ts
   const TELEMETRY_ENDPOINT = 'https://foursys-sdd-telemetry.<seu-usuario>.workers.dev';
   ```
   Recompile a extensão (`npm run compile` ou `vsce package`).

## Testar

```
curl -X POST https://foursys-sdd-telemetry.<seu-usuario>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@foursys.com","event":"teste_manual","command":"specify","stack":"angular"}'
```

Depois, confira se apareceu um arquivo `events-AAAA-MM.jsonl` no repositório `sdd-telemetry-data`.
