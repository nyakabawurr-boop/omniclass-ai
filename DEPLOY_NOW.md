# 🚀 Deploy to Vercel - Quick Guide

## ✅ Configuration Files Created

I've set up all the necessary Vercel configuration files:
- ✅ `vercel.json` - Root configuration
- ✅ `frontend/vercel.json` - Frontend-specific config
- ✅ `backend/vercel.json` - Backend config (for future use)
- ✅ `frontend/api/[...path].ts` - API proxy for backend

## 🎯 Deploy via Vercel Dashboard (Easiest Method)

### Step 1: Go to Vercel
1. Visit: https://vercel.com
2. Sign up/Login with GitHub
3. Click **"Add New Project"**

### Step 2: Import Your Repository
1. Select **"Import Git Repository"**
2. Find and select: **nyakabawurr-boop/omniclass-ai**
3. Click **"Import"**

### Step 3: Configure Frontend Project
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (auto-filled)
4. **Output Directory**: `.next` (auto-filled)
5. **Install Command**: `npm install` (auto-filled)

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_APP_NAME=OmniClass AI
```

### Step 5: Deploy!
1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at: `https://omniclass-ai-frontend.vercel.app`

## 🔧 Alternative: Deploy via CLI

If you prefer command line:

```powershell
# Navigate to frontend
cd frontend

# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 📝 Backend Deployment

For the backend, you have two options:

### Option 1: Deploy Backend to Vercel (Serverless)
1. Create another Vercel project
2. Root Directory: `backend`
3. Build Command: `npm run build`
4. Add all backend environment variables (see VERCEL_DEPLOY.md)

### Option 2: Use Separate Service (Recommended)
Deploy backend to:
- **Railway** (https://railway.app) - Easy PostgreSQL + Node.js
- **Render** (https://render.com) - Free tier available
- **Fly.io** (https://fly.io) - Good for Express apps

## 🔑 Required Environment Variables

### Frontend (in Vercel):
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

### Backend (when deploying):
```
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## 🗄️ Database Setup

You'll need a PostgreSQL database. Free options:

1. **Vercel Postgres** (in Vercel dashboard)
2. **Neon** (https://neon.tech) - Free tier
3. **Supabase** (https://supabase.com) - Free tier

After creating database:
1. Copy connection string
2. Add to backend environment variables as `DATABASE_URL`
3. Run migrations: `npx prisma migrate deploy`

## ✅ After Deployment

1. **Update Frontend API URL**: 
   - Go to Vercel project settings
   - Update `NEXT_PUBLIC_API_URL` with your backend URL
   - Redeploy

2. **Test Your App**:
   - Visit your Vercel URL
   - Test login/registration
   - Verify API calls work

3. **Set Up Custom Domain** (optional):
   - Go to project settings → Domains
   - Add your domain
   - Update DNS records

## 📚 Full Documentation

See `VERCEL_DEPLOY.md` for detailed instructions.

---

**Ready to deploy?** Go to https://vercel.com and import your repository!

