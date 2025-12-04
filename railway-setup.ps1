# Railway Setup Script - Complete the deployment
Write-Host "=== Railway Backend Setup ===" -ForegroundColor Cyan
Write-Host ""

$env:PATH += ";$env:APPDATA\npm"

# Check if linked
Write-Host "Checking Railway project link..." -ForegroundColor Yellow
$linkCheck = railway status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Linking to Railway project..." -ForegroundColor Yellow
    Write-Host "Please select your project when prompted" -ForegroundColor White
    railway link
}

Write-Host ""
Write-Host "=== Next Steps to Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. CONFIGURE SERVICE (in Railway web interface):" -ForegroundColor Yellow
Write-Host "   - Go to: https://railway.com/project/1d6dfb2d-5bba-4d80-8e3f-58b0860810c2" -ForegroundColor White
Write-Host "   - Click on your service" -ForegroundColor White
Write-Host "   - Go to Settings tab" -ForegroundColor White
Write-Host "   - Set Root Directory to: backend" -ForegroundColor White
Write-Host ""
Write-Host "2. ADD POSTGRESQL DATABASE:" -ForegroundColor Yellow
Write-Host "   - In Railway project, click '+ New'" -ForegroundColor White
Write-Host "   - Select 'Database' → 'Add PostgreSQL'" -ForegroundColor White
Write-Host ""
Write-Host "3. ADD ENVIRONMENT VARIABLES:" -ForegroundColor Yellow
Write-Host "   Go to your service → Variables tab → Add these:" -ForegroundColor White
Write-Host ""
Write-Host "   DATABASE_URL: Reference Variable → Select Postgres → DATABASE_URL" -ForegroundColor Gray
Write-Host "   NODE_ENV=production" -ForegroundColor Gray
Write-Host "   PORT=3001" -ForegroundColor Gray
Write-Host "   JWT_SECRET=omniclass-ai-jwt-secret-production-2024" -ForegroundColor Gray
Write-Host "   JWT_EXPIRES_IN=7d" -ForegroundColor Gray
Write-Host "   JWT_REFRESH_SECRET=omniclass-ai-refresh-secret-production-2024" -ForegroundColor Gray
Write-Host "   JWT_REFRESH_EXPIRES_IN=30d" -ForegroundColor Gray
Write-Host "   OPENAI_API_KEY=your-openai-api-key-here" -ForegroundColor Gray
Write-Host "   STORAGE_TYPE=local" -ForegroundColor Gray
Write-Host "   STORAGE_PATH=./uploads" -ForegroundColor Gray
Write-Host "   STUDENT_SUBSCRIPTION_PRICE=10" -ForegroundColor Gray
Write-Host "   INSTRUCTOR_SUBSCRIPTION_PRICE=20" -ForegroundColor Gray
Write-Host "   SUBSCRIPTION_BILLING_PERIOD=monthly" -ForegroundColor Gray
Write-Host "   CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app" -ForegroundColor Gray
Write-Host ""
Write-Host "4. GET BACKEND URL:" -ForegroundColor Yellow
Write-Host "   - Service → Settings → Networking → Generate Domain" -ForegroundColor White
Write-Host ""
Write-Host "5. RUN MIGRATIONS:" -ForegroundColor Yellow
Write-Host "   After adding variables, run this command:" -ForegroundColor White
Write-Host "   railway run npx prisma migrate deploy" -ForegroundColor Cyan
Write-Host "   railway run npx prisma db seed" -ForegroundColor Cyan
Write-Host ""

$continue = Read-Host "Have you completed steps 1-3? (y/n)"
if ($continue -eq "y") {
    Write-Host ""
    Write-Host "Running database migrations..." -ForegroundColor Yellow
    railway run npx prisma migrate deploy
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Seeding database..." -ForegroundColor Yellow
        railway run npx prisma db seed
    }
    
    Write-Host ""
    Write-Host "=== Deployment Status ===" -ForegroundColor Cyan
    railway status
    
    Write-Host ""
    Write-Host "✓ Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Update Vercel frontend with your Railway backend URL" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Please complete steps 1-3 in Railway web interface first." -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
}

