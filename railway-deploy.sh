#!/bin/bash
# Railway Deployment Helper Script
# Run this after setting up services in Railway dashboard

echo "=== Railway Deployment Helper ==="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm i -g @railway/cli
fi

echo "1. Login to Railway (will open browser)..."
railway login

echo ""
echo "2. Link to your project..."
railway link

echo ""
echo "3. Running database migrations..."
railway run npm run prisma:migrate

echo ""
echo "4. Seeding database..."
railway run npm run prisma:seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Your app should be live at:"
echo "- Check Railway dashboard for URLs"
echo ""

