# Update Database Connection String
$env:PATH += ";C:\Program Files\nodejs"

Write-Host "=== Updating Database Connection ===" -ForegroundColor Cyan
Write-Host ""

$connectionString = "postgresql://neondb_owner:npg_05otOXNWUEYm@ep-curly-fog-a49qg3ja-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

$envFile = "backend\.env"

if (-not (Test-Path $envFile)) {
    Write-Host "✗ .env file not found" -ForegroundColor Red
    exit 1
}

# Read and update .env file
$lines = Get-Content $envFile
$updated = $false
$newLines = @()

foreach ($line in $lines) {
    if ($line -match '^DATABASE_URL=') {
        $newLines += "DATABASE_URL=`"$connectionString`""
        $updated = $true
    } else {
        $newLines += $line
    }
}

if (-not $updated) {
    $newLines += "DATABASE_URL=`"$connectionString`""
}

Set-Content -Path $envFile -Value ($newLines -join "`n")
Write-Host "✓ Updated DATABASE_URL in backend/.env" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Stop the backend server (Ctrl+C)" -ForegroundColor White
Write-Host "2. Run: cd backend && npm run prisma:migrate" -ForegroundColor White
Write-Host "3. Run: cd backend && npm run prisma:seed" -ForegroundColor White
Write-Host "4. Restart backend: cd backend && npm run dev" -ForegroundColor White

