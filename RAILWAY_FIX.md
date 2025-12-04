# Railway Deployment Fix

## Issue
Both backend and frontend are failing with "npm: command not found" error.

## Solution Applied
Updated `nixpacks.toml` files to properly configure Node.js detection.

## Important Railway Settings

### Backend Service:
1. Go to **Settings** tab
2. **Root Directory**: `backend` (MUST be set)
3. **Build Command**: (LEAVE EMPTY - Nixpacks handles it)
4. **Start Command**: `npm start`

### Frontend Service:
1. Go to **Settings** tab
2. **Root Directory**: `frontend` (MUST be set)
3. **Build Command**: (LEAVE EMPTY - Nixpacks handles it)
4. **Start Command**: `npm start`

## What Changed
- Added `[providers]` section to specify Node.js version
- Changed `npm install` to `npm ci` (faster, more reliable for production)
- Ensured Node.js is properly detected by Nixpacks

## Next Steps
1. The updated files are pushed to GitHub
2. Railway should auto-redeploy
3. If not, manually trigger redeploy in Railway dashboard
4. Check that Root Directory is set correctly in Settings

## Verification
After redeploy, check:
- Build logs show Node.js installation
- `npm ci` runs successfully
- Build completes without errors
- Service starts and shows "Listening on port..."

