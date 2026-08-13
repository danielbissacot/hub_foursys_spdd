# BradAsync

É um utilitário que fornece métodos para operações assíncronas comuns, incluindo delays, carregamento de scripts/CSS externos e execução com tentativas (retry).

# Métodos Disponíveis

| Método | Descrição |
| --- | --- |
| `wait(timeInMs)` | Aguarda um tempo específico em milissegundos |
| `retries(fn).retry(count, delay, shouldRetry)` | Executa função com tentativas automáticas |

# Método `wait()`

Cria um delay assíncrono para pausar a execução por um tempo determinado.

```
await BradAsync.wait();
```
Uso com tempo específico
```
await BradAsync.wait(1000);
```
Exemplo em sequência
```
console.log('Início');
await BradAsync.wait(500);
console.log('Meio');
await BradAsync.wait(500);
console.log('Fim');
```
## Método retries()

Encapsula uma função assíncrona para permitir execução com tentativas automáticas em caso de falha.

# Execução básica
```
const result = await BradAsync.retries(() => fetch('/api/data'))
.retry();
```
Configuração personalizada
```
const data = await BradAsync.retries(() => fetch('/api/data'))
.retry(
  5,                                    // 5 tentativas
  2000,                                 // 2s de delay entre tentativas
  (err) => err.status === 503,          // Só retenta se erro 503
  (err, attempt) => {                   // Callback após cada falha
    console.log(`Tentativa ${attempt + 1} falhou: ${err.message}`);
  }
);
```
Exemplos Práticos
API com Retry Inteligente
```
async function fetchUserData(userId) {
  return BradAsync.retries(() =>
fetch(`/api/users/${userId}`)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
).retry(5, 1000, (err) => {
  return err.message.includes('fetch') || err.message.includes('500') || err.message.includes('503');
},
async (err, attempt) => {
  console.warn(`Tentativa ${attempt + 1} falhou: ${err.message}`);.
      if (attempt > 0) {
        await BradAsync.wait(1000 * Math.pow(2, attempt));
      }
    }
);
}
```
## Cenários de Uso

| Cenário | Método Recomendado | Exemplo |
| --- | --- | --- |
| Delay simples | wait() | Aguardar animação, debounce |
| APIs instáveis | retries() | Requests com falhas intermitentes |