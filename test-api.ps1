# API Testing Script for OmniClass AI
$env:PATH += ";C:\Program Files\nodejs"

$baseUrl = "http://localhost:3001"
Write-Host "=== Testing OmniClass AI API ===" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Root endpoint
Write-Host "Test 1: Root Endpoint (GET /)" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get
    Write-Host "✓ Success" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Health check
Write-Host "Test 2: Health Check (GET /health)" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✓ Success" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Register user (requires database)
Write-Host "Test 3: Register User (POST /api/auth/register)" -ForegroundColor Green
$registerData = @{
    email = "test@example.com"
    password = "password123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

$testToken = $null
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    Write-Host "✓ Success - User registered!" -ForegroundColor Green
    if ($response.token) {
        Write-Host "Token received: $($response.token.Substring(0, [Math]::Min(20, $response.token.Length)))..." -ForegroundColor Yellow
        $testToken = $response.token
    }
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Yellow
        } catch {
            # Ignore stream reading errors
        }
    }
}
Write-Host ""

# Test 4: Login
Write-Host "Test 4: Login (POST /api/auth/login)" -ForegroundColor Green
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "✓ Success - Logged in!" -ForegroundColor Green
    if ($response.token) {
        $testToken = $response.token
    }
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Yellow
        } catch {
            # Ignore stream reading errors
        }
    }
}
Write-Host ""

# Test 5: Get current user (requires auth token)
if ($testToken) {
    Write-Host "Test 5: Get Current User (GET /api/users/me)" -ForegroundColor Green
    $headers = @{
        "Authorization" = "Bearer $testToken"
    }
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/users/me" -Method Get -Headers $headers
        Write-Host "✓ Success" -ForegroundColor Green
        $response | ConvertTo-Json
    } catch {
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 6: Get subjects (requires database)
Write-Host "Test 6: Get Subjects (GET /api/subjects)" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/subjects" -Method Get
    Write-Host "✓ Success - Found $($response.Count) subjects" -ForegroundColor Green
    if ($response.Count -gt 0) {
        $response | Select-Object -First 3 | ConvertTo-Json
    }
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Yellow
        } catch {
            # Ignore stream reading errors
        }
    }
}
Write-Host ""

Write-Host "=== Testing Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Some tests require database setup." -ForegroundColor Yellow
Write-Host "See setup-cloud-db.md for database setup instructions." -ForegroundColor Yellow
