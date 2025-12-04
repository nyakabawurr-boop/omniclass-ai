# Railway Deployment - Step by Step Guide

## ✅ You're Ready!

Your Railway account is set up. Follow these steps to deploy:

## Step 1: Create New Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"** (top right)
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub if prompted
5. Select your repository: **`nyakabawurr-boop/omniclassai`**
6. Click **"Deploy Now"**

## Step 2: Add Backend Service

1. In your project, click **"+ New"** → **"Empty Service"**
2. Name it: `backend`
3. Click on the `backend` service
4. Go to **Settings** tab:
   - **Root Directory**: Type `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **"Save"**

## Step 3: Configure Backend Environment Variables

1. Still in the `backend` service, go to **Variables** tab
2. Click **"+ New Variable"** and add each of these:

   ```
   DATABASE_URL = postgresql://neondb_owner:npg_05otOXNWUEYm@ep-curly-fog-a49qg3ja-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

   ```
   JWT_SECRET = omniclass-ai-production-secret-key-2024-change-this
   ```

   ```
   JWT_REFRESH_SECRET = omniclass-ai-production-refresh-secret-2024-change-this
   ```

   ```
   OPENAI_API_KEY = your-openai-api-key-here
   ```

   ```
   NODE_ENV = production
   ```

   ```
   PORT = 3001
   ```

3. **Important**: Generate strong random secrets for JWT_SECRET and JWT_REFRESH_SECRET (you can use a password generator)

## Step 4: Get Backend URL

1. After deployment starts, go to **Settings** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** (or it may auto-generate)
4. Copy the URL (e.g., `https://backend-production-xxxx.up.railway.app`)
5. **Save this URL** - you'll need it for the frontend!

## Step 5: Add Frontend Service

1. In your project, click **"+ New"** → **"Empty Service"**
2. Name it: `frontend`
3. Click on the `frontend` service
4. Go to **Settings** tab:
   - **Root Directory**: Type `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **"Save"**

## Step 6: Configure Frontend Environment Variables

1. In the `frontend` service, go to **Variables** tab
2. Click **"+ New Variable"** and add:

   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.railway.app
   ```
   
   **Replace `your-backend-url.railway.app` with the actual backend URL from Step 4!**

## Step 7: Update Backend CORS

1. Go back to `backend` service → **Variables** tab
2. Add or update:

   ```
   CORS_ORIGIN = https://your-frontend-url.railway.app
   ```
   
   **Replace with your actual frontend URL** (you'll get this after frontend deploys)

## Step 8: Run Database Migrations

After backend is deployed:

### Option A: Using Railway Web Interface
1. Go to `backend` service → **Deployments** tab
2. Click on the latest deployment
3. Click **"View Logs"**
4. You should see the deployment logs

### Option B: Using Railway CLI (Recommended)
1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```
2. Login:
   ```bash
   railway login
   ```
3. Link to your project:
   ```bash
   railway link
   ```
4. Run migrations:
   ```bash
   railway run npm run prisma:migrate
   railway run npm run prisma:seed
   ```

## Step 9: Verify Deployment

1. Check backend health: `https://your-backend-url.railway.app/health`
2. Check frontend: `https://your-frontend-url.railway.app`
3. Test registration/login
4. Test API endpoints

## 🎉 Your App is Live!

- **Frontend**: `https://your-frontend-url.railway.app`
- **Backend API**: `https://your-backend-url.railway.app`

## Troubleshooting

### Build Fails
- Check logs in Railway dashboard
- Verify all environment variables are set
- Check Root Directory is correct

### Database Connection Errors
- Verify DATABASE_URL is correct
- Check Neon database is active (not paused)
- Ensure connection string includes `?sslmode=require`

### CORS Errors
- Make sure CORS_ORIGIN matches frontend URL exactly
- Include `https://` in the URL
- No trailing slash

### Frontend Can't Connect to Backend
- Verify NEXT_PUBLIC_API_URL is set correctly
- Check backend is deployed and running
- Test backend health endpoint

## Next Steps

1. ✅ Test all features
2. ✅ Set up custom domain (optional)
3. ✅ Configure monitoring
4. ✅ Set up backups

Your app is deploying! 🚀

