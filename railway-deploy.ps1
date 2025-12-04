# Railway Deployment Helper Script for Windows
# Run this after setting up services in Railway dashboard

Write-Host "=== Railway Deployment Helper ===" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue

if (-not $railwayInstalled) {
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm i -g @railway/cli
}

Write-Host "1. Login to Railway (will open browser)..." -ForegroundColor Green
railway login

Write-Host ""
Write-Host "2. Link to your project..." -ForegroundColor Green
railway link

Write-Host ""
Write-Host "3. Running database migrations..." -ForegroundColor Green
railway run npm run prisma:migrate

Write-Host ""
Write-Host "4. Seeding database..." -ForegroundColor Green
railway run npm run prisma:seed

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your app should be live at:" -ForegroundColor Cyan
Write-Host "- Check Railway dashboard for URLs" -ForegroundColor White
Write-Host ""

