# OmniClass AI Setup Script for Windows
# Prerequisites: Node.js 18+ and PostgreSQL must be installed

Write-Host "=== OmniClass AI Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL (optional check)
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "✓ PostgreSQL found: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ PostgreSQL not found in PATH. Make sure PostgreSQL is installed and database is created." -ForegroundColor Yellow
    Write-Host "  Database name: omniclass_ai" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Setting up Backend ===" -ForegroundColor Cyan
Set-Location backend

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env -ErrorAction SilentlyContinue
    Write-Host "⚠ Please edit backend/.env and set:" -ForegroundColor Yellow
    Write-Host "  - DATABASE_URL (PostgreSQL connection string)" -ForegroundColor Yellow
    Write-Host "  - OPENAI_API_KEY (Your OpenAI API key)" -ForegroundColor Yellow
    Write-Host "  - JWT_SECRET (Random secret string)" -ForegroundColor Yellow
}

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "⚠ IMPORTANT: Before running migrations, ensure:" -ForegroundColor Yellow
Write-Host "  1. PostgreSQL is running" -ForegroundColor Yellow
Write-Host "  2. Database 'omniclass_ai' exists" -ForegroundColor Yellow
Write-Host "  3. DATABASE_URL in .env is correct" -ForegroundColor Yellow
Write-Host ""
$runMigrations = Read-Host "Run database migrations? (y/n)"
if ($runMigrations -eq "y") {
    Write-Host "Running migrations..." -ForegroundColor Yellow
    npm run prisma:migrate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Seeding database..." -ForegroundColor Yellow
        npm run prisma:seed
    }
}

Write-Host ""
Write-Host "=== Setting up Frontend ===" -ForegroundColor Cyan
Set-Location ../frontend

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item .env.local.example .env.local -ErrorAction SilentlyContinue
}

Set-Location ..

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  1. Start backend:   cd backend && npm run dev" -ForegroundColor White
Write-Host "  2. Start frontend:  cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Backend will run on: http://localhost:3001" -ForegroundColor White
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor White

