# Railway Deployment Helper Script
Write-Host "=== Railway Backend Deployment Helper ===" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
Write-Host "Checking Railway CLI..." -ForegroundColor Yellow
$env:PATH += ";$env:APPDATA\npm"
try {
    $railwayVersion = railway --version 2>&1
    Write-Host "✓ Railway CLI found: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install Railway CLI" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install manually:" -ForegroundColor Yellow
        Write-Host "  npm install -g @railway/cli" -ForegroundColor White
        Write-Host ""
        Write-Host "Or deploy via Railway web interface:" -ForegroundColor Yellow
        Write-Host "  1. Go to https://railway.app" -ForegroundColor White
        Write-Host "  2. Login with GitHub" -ForegroundColor White
        Write-Host "  3. New Project → Deploy from GitHub" -ForegroundColor White
        Write-Host "  4. Select: nyakabawurr-boop/omniclass-ai" -ForegroundColor White
        exit 1
    }
}

Write-Host ""
Write-Host "Checking Railway login..." -ForegroundColor Yellow
$loginCheck = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Railway:" -ForegroundColor Yellow
    railway login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Login failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=== Deployment Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Railway CLI can help, but some steps need the web interface:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create project (via web):" -ForegroundColor White
Write-Host "   - Go to https://railway.app" -ForegroundColor Gray
Write-Host "   - New Project → Deploy from GitHub" -ForegroundColor Gray
Write-Host "   - Select: nyakabawurr-boop/omniclass-ai" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Configure service:" -ForegroundColor White
Write-Host "   - Set Root Directory: backend" -ForegroundColor Gray
Write-Host "   - Add PostgreSQL database" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Add environment variables (see RAILWAY_DEPLOY.md)" -ForegroundColor White
Write-Host ""
Write-Host "4. Run migrations:" -ForegroundColor White
Write-Host "   railway run --service your-service-name npx prisma migrate deploy" -ForegroundColor Gray
Write-Host ""

$continue = Read-Host "Have you created the project in Railway web interface? (y/n)"
if ($continue -ne "y") {
    Write-Host ""
    Write-Host "Please create the project first at https://railway.app" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Linking to Railway project..." -ForegroundColor Yellow
railway link

Write-Host ""
Write-Host "Deploying..." -ForegroundColor Yellow
railway up

Write-Host ""
Write-Host "✓ Deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add environment variables in Railway dashboard" -ForegroundColor White
Write-Host "2. Add PostgreSQL database" -ForegroundColor White
Write-Host "3. Run migrations: railway run npx prisma migrate deploy" -ForegroundColor White
Write-Host "4. Get your backend URL from Railway dashboard" -ForegroundColor White
Write-Host "5. Update Vercel frontend with backend URL" -ForegroundColor White

