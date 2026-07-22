# Foursys Personal Copilot Sync — instalador de um comando
#
# O que faz: baixa so as pastas necessarias do repositorio (catalog/, os playbooks
# do SDD, e este proprio script) para uma pasta de cache local, e roda a sincronizacao.
# Nao precisa clonar o repositorio inteiro, nao precisa saber git.
#
# Requisito: Node.js instalado (o mesmo que o Copilot CLI ja exige).
#
# Uso: cole este comando no PowerShell:
#   irm https://raw.githubusercontent.com/danielbissacot/hub_foursys_spdd/main/foursys-personal-copilot-sync/install.ps1 | iex

$ErrorActionPreference = 'Stop'

$dest = Join-Path $env:USERPROFILE '.foursys-copilot-sync'

Write-Host "Foursys Personal Copilot Sync — instalador"
Write-Host "Pasta de cache: $dest"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERRO: Node.js nao encontrado. Instale antes de continuar: https://nodejs.org (ou 'winget install OpenJS.NodeJS.LTS')" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERRO: git nao encontrado. Instale antes de continuar: https://git-scm.com" -ForegroundColor Red
    exit 1
}

if (Test-Path $dest) {
    Write-Host "Atualizando cache existente..."
    Push-Location $dest
    git fetch origin main
    git reset --hard origin/main
} else {
    Write-Host "Baixando pela primeira vez..."
    git clone --filter=blob:none --no-checkout --depth 1 --branch main https://github.com/danielbissacot/hub_foursys_spdd.git $dest
    Push-Location $dest
    git sparse-checkout init --cone
    git sparse-checkout set catalog foursys-sdd-engine-hybrid-po/catalog/sdd foursys-personal-copilot-sync
    git checkout main
}

Write-Host "`nRodando sincronizacao..."
node (Join-Path $dest 'foursys-personal-copilot-sync\sync.js')

Pop-Location

Write-Host "`nPronto! Recarregue a janela do VS Code (Ctrl+Shift+P -> Developer: Reload Window) para ver as novidades." -ForegroundColor Green
