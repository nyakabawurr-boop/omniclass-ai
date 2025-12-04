# Railway Settings Verification - CRITICAL

## ⚠️ Most Important: Root Directory Settings

### Backend Service:
1. Go to Railway Dashboard
2. Click on **`omniclass-ai-backend`** service
3. Click **Settings** tab
4. Scroll to **"Root Directory"** section
5. **MUST BE SET TO**: `backend` (exactly, no slashes, no dots)
6. **Build Command**: Should be **EMPTY** (delete if anything is there)
7. **Start Command**: `npm start`

### Frontend Service:
1. Go to Railway Dashboard
2. Click on **`omniclass-ai-frontend`** service  
3. Click **Settings** tab
4. Scroll to **"Root Directory"** section
5. **MUST BE SET TO**: `frontend` (exactly, no slashes, no dots)
6. **Build Command**: Should be **EMPTY** (delete if anything is there)
7. **Start Command**: `npm start`

## If Root Directory is NOT Set:

Railway will look for files in the repository root, not in `backend/` or `frontend/` folders. This is why it's failing!

## How to Fix:

1. **Open each service** (backend and frontend)
2. **Go to Settings**
3. **Find "Root Directory"** field
4. **Type exactly**: `backend` or `frontend` (depending on service)
5. **Save**
6. **Redeploy** (or wait for auto-redeploy)

## Alternative: If Root Directory Setting Doesn't Exist

Some Railway interfaces don't show Root Directory. In that case:

1. **Delete the service**
2. **Create new service**
3. **When creating, specify Root Directory** during setup
4. **Or use Railway CLI**:
   ```bash
   railway service
   railway variables set RAILWAY_SERVICE_ROOT=backend
   ```

## Verification:

After setting Root Directory correctly:
- Railway will look for `package.json` in `backend/` or `frontend/`
- Railway will find `nixpacks.toml` in the correct directory
- Build should succeed

## Current Status:

✅ Code is pushed to GitHub
✅ nixpacks.toml files are in correct locations
❓ Root Directory settings need verification

**Check your Railway dashboard NOW and verify Root Directory is set!**

