# Quick Deployment Guide

## ✅ Database Setup

Your Neon database connection string is ready. Run this to update it:

```powershell
.\update-database-connection.ps1
```

Then stop your backend server and run:
```powershell
cd backend
npm run prisma:migrate
npm run prisma:seed
```

## 🚀 Deploy to Railway (Easiest - Recommended)

### Step 1: Sign Up
1. Go to https://railway.app
2. Sign up with GitHub (free tier available)

### Step 2: Deploy Backend
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repo: `nyakabawurr-boop/omniclassai`
4. Click **"Add Service"** → **"Empty Service"**
5. Click the service → **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Go to **Variables** tab and add:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_05otOXNWUEYm@ep-curly-fog-a49qg3ja-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-here
   OPENAI_API_KEY=your-openai-key
   NODE_ENV=production
   PORT=3001
   ```
7. Railway will auto-deploy! Copy the backend URL (e.g., `https://omniclass-ai-backend.railway.app`)

### Step 3: Deploy Frontend
1. In the same project, click **"Add Service"** → **"Empty Service"**
2. Click the service → **Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Go to **Variables** tab and add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
4. Update backend **CORS_ORIGIN** variable to: `https://your-frontend-url.railway.app`
5. Railway will auto-deploy!

### Step 4: Run Database Migrations
1. In Railway backend service, go to **Deployments**
2. Click on the latest deployment → **View Logs**
3. Or use Railway CLI:
   ```bash
   railway run npm run prisma:migrate
   railway run npm run prisma:seed
   ```

## 🌐 Your App Will Be Live At:
- Frontend: `https://your-frontend.railway.app`
- Backend: `https://your-backend.railway.app`

## 📝 Alternative: Deploy to Vercel (Frontend Only)

1. Go to https://vercel.com
2. Import GitHub repo: `nyakabawurr-boop/omniclassai`
3. Root Directory: `frontend`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = Your backend URL
5. Deploy!

**Note**: You'll need to deploy backend separately (Railway, Render, etc.)

## 🔧 Pre-Deployment Checklist

- [ ] Database connection string updated
- [ ] Migrations run locally (test)
- [ ] Environment variables ready
- [ ] CORS_ORIGIN set to frontend URL
- [ ] Strong JWT secrets generated
- [ ] OpenAI API key added

## 🎉 After Deployment

1. Test your live app
2. Register a new account
3. Login as founder (if seeded)
4. Test all features

Your app is now live! 🚀

