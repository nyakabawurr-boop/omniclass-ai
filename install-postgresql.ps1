# PostgreSQL Installation Helper Script
Write-Host "=== PostgreSQL Setup for OmniClass AI ===" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is already installed
$pgPath = Get-ChildItem "C:\Program Files" -Filter "*PostgreSQL*" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1

if ($pgPath) {
    Write-Host "PostgreSQL found at: $($pgPath.FullName)" -ForegroundColor Green
    $psqlPath = Join-Path $pgPath.FullName "bin\psql.exe"
    if (Test-Path $psqlPath) {
        Write-Host "psql found at: $psqlPath" -ForegroundColor Green
        Write-Host ""
        Write-Host "To create the database, run:" -ForegroundColor Yellow
        Write-Host "  & '$psqlPath' -U postgres -c 'CREATE DATABASE omniclass_ai;'" -ForegroundColor White
    }
} else {
    Write-Host "PostgreSQL not found. Installation options:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Download and Install PostgreSQL" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "  2. Download the installer" -ForegroundColor White
    Write-Host "  3. Run the installer with default settings" -ForegroundColor White
    Write-Host "  4. Remember the password for 'postgres' user" -ForegroundColor White
    Write-Host "  5. After installation, run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Use Docker (if Docker is installed)" -ForegroundColor Cyan
    Write-Host "  docker run --name omniclass-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=omniclass_ai -p 5432:5432 -d postgres:14" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3: Use a Cloud Database" -ForegroundColor Cyan
    Write-Host "  - Supabase (free tier): https://supabase.com" -ForegroundColor White
    Write-Host "  - Neon (free tier): https://neon.tech" -ForegroundColor White
    Write-Host "  - Update DATABASE_URL in backend/.env with connection string" -ForegroundColor White
}

Write-Host ""
Write-Host "After PostgreSQL is set up:" -ForegroundColor Yellow
Write-Host "  1. Update backend/.env with correct DATABASE_URL" -ForegroundColor White
Write-Host "  2. Run: cd backend && npm run prisma:migrate" -ForegroundColor White
Write-Host "  3. Run: cd backend && npm run prisma:seed" -ForegroundColor White

