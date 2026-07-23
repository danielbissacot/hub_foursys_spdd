// Config compartilhada do Mend Advise, usada por extension.ts e sidebar-provider.ts.
// MEND_LICENSE_KEY é uma chave de trial compartilhada (não é segredo por usuário) —
// mantida aqui para não duplicar o literal em dois arquivos-fonte.
export const MEND_EXTENSION_ID = 'mend.mend-advise';
export const MEND_LICENSE_SECRET = 'foursys.mendLicenseKey';
export const MEND_LICENSE_KEY = 'ef149a32-1038-40b2-9917-436a1266ed17';
export const MEND_API_TOKEN = Buffer.from(
    JSON.stringify({ url: 'https://dss-appsec.mend.io/api', token: MEND_LICENSE_KEY })
).toString('base64');
