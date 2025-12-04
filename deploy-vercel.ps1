# Vercel Deployment Script
Write-Host "=== OmniClass AI - Vercel Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$env:PATH += ";C:\Program Files\nodejs"
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✓ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "=== Deploying Frontend ===" -ForegroundColor Cyan
Set-Location frontend

# Check if logged in
Write-Host "Checking Vercel login status..." -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    vercel login
}

Write-Host ""
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "Follow the prompts:" -ForegroundColor Yellow
Write-Host "  - Set up and deploy? Yes" -ForegroundColor White
Write-Host "  - Project name: omniclass-ai-frontend" -ForegroundColor White
Write-Host "  - Directory: ./frontend" -ForegroundColor White
Write-Host ""

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Frontend deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Note the deployment URL" -ForegroundColor White
    Write-Host "2. Go to Vercel dashboard to add environment variables:" -ForegroundColor White
    Write-Host "   - NEXT_PUBLIC_API_URL (your backend URL)" -ForegroundColor White
    Write-Host "3. Deploy backend separately or use Vercel serverless functions" -ForegroundColor White
} else {
    Write-Host "✗ Deployment failed" -ForegroundColor Red
}

Set-Location ..

