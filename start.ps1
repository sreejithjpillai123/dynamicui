# ─────────────────────────────────────────────────────────
#  SpiceKart — Dynamic UI Blocks
#  Starts both Laravel backend + React frontend
# ─────────────────────────────────────────────────────────

$root = $PSScriptRoot

# Start Laravel backend (port 8000)
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
  "cd '$root\server'; php artisan serve"

# Wait for Laravel to boot
Start-Sleep -Seconds 3

# Start React frontend (port 3000)
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
  "cd '$root\client'; npm start"

Write-Host ""
Write-Host "=========================================="
Write-Host "  SpiceKart - Dynamic UI Blocks"
Write-Host "=========================================="
Write-Host "  Laravel API  → http://localhost:8000"
Write-Host "  React App    → http://localhost:3000"
Write-Host "=========================================="
Write-Host ""
Write-Host "Open http://localhost:3000 in your browser"
