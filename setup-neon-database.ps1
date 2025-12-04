# Neon Database Setup Script for OmniClass AI
$env:PATH += ";C:\Program Files\nodejs"

Write-Host "=== Neon Database Setup for OmniClass AI ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Instructions
Write-Host "STEP 1: Create Neon Account and Project" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open your browser and go to: https://neon.tech" -ForegroundColor White
Write-Host "2. Click 'Sign Up' (you can use GitHub, Google, or email)" -ForegroundColor White
Write-Host "3. After signing in, click 'New Project'" -ForegroundColor White
Write-Host "4. Fill in:" -ForegroundColor White
Write-Host "   - Project name: omniclass-ai" -ForegroundColor Cyan
Write-Host "   - Region: Choose closest to you (e.g., US East)" -ForegroundColor Cyan
Write-Host "   - PostgreSQL version: 15 (default)" -ForegroundColor Cyan
Write-Host "5. Click 'Create Project'" -ForegroundColor White
Write-Host ""
Write-Host "STEP 2: Get Connection String" -ForegroundColor Yellow
Write-Host ""
Write-Host "After project is created:" -ForegroundColor White
Write-Host "1. You'll see a connection string that looks like:" -ForegroundColor White
Write-Host "   postgresql://user:password@host.neon.tech/dbname?sslmode=require" -ForegroundColor Cyan
Write-Host "2. Copy the ENTIRE connection string" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter when you have the connection string ready..." -ForegroundColor Yellow
Read-Host

# Step 3: Get connection string from user
Write-Host ""
Write-Host "STEP 3: Enter Connection String" -ForegroundColor Yellow
Write-Host ""
$connectionString = Read-Host "Paste your Neon connection string here"

if ([string]::IsNullOrWhiteSpace($connectionString)) {
    Write-Host "✗ No connection string provided. Exiting." -ForegroundColor Red
    exit 1
}

# Validate connection string format
if (-not $connectionString.StartsWith("postgresql://")) {
    Write-Host "⚠ Warning: Connection string should start with 'postgresql://'" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Step 4: Update .env file
Write-Host ""
Write-Host "STEP 4: Updating backend/.env file..." -ForegroundColor Yellow
$envFile = "backend\.env"

if (-not (Test-Path $envFile)) {
    Write-Host "✗ .env file not found at $envFile" -ForegroundColor Red
    exit 1
}

# Read current .env
$envContent = Get-Content $envFile -Raw

# Update DATABASE_URL
if ($envContent -match 'DATABASE_URL="[^"]*"') {
    $envContent = $envContent -replace 'DATABASE_URL="[^"]*"', "DATABASE_URL=`"$connectionString`""
} elseif ($envContent -match "DATABASE_URL=.*") {
    $envContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=`"$connectionString`""
} else {
    $envContent += "`nDATABASE_URL=`"$connectionString`""
}

# Write back to file
Set-Content -Path $envFile -Value $envContent -NoNewline
Write-Host "✓ Updated DATABASE_URL in backend/.env" -ForegroundColor Green

# Step 5: Test connection and run migrations
Write-Host ""
Write-Host "STEP 5: Testing Connection and Setting Up Database..." -ForegroundColor Yellow
Write-Host ""

Set-Location backend

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Cyan
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma client generated" -ForegroundColor Green

# Run migrations
Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Cyan
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to run migrations" -ForegroundColor Red
    Write-Host "Please check your connection string and try again." -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Migrations completed" -ForegroundColor Green

# Seed database
Write-Host ""
Write-Host "Seeding database with initial data..." -ForegroundColor Cyan
npm run prisma:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Warning: Seeding failed, but migrations succeeded." -ForegroundColor Yellow
    Write-Host "You can run 'npm run prisma:seed' manually later." -ForegroundColor Yellow
} else {
    Write-Host "✓ Database seeded successfully" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Your database is now set up and ready to use!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart the backend server (if it's running)" -ForegroundColor White
Write-Host "2. Test the API endpoints" -ForegroundColor White
Write-Host "3. Access the frontend at http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Founder accounts created:" -ForegroundColor Cyan
Write-Host "  - nyakabawurr@gmail.com (password: password123)" -ForegroundColor White
Write-Host "  - gzinyenya@gmail.com (password: password123)" -ForegroundColor White
Write-Host ""

