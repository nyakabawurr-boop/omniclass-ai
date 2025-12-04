# 🚀 Quick Deploy to Vercel - Step by Step

## ✅ All Configuration Files Are Ready!

I've prepared everything for deployment. Your repository is ready at:
**https://github.com/nyakabawurr-boop/omniclass-ai**

## 🎯 Deploy in 5 Minutes (Easiest Method)

### Step 1: Go to Vercel
1. Open: **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find **"nyakabawurr-boop/omniclass-ai"** in the list
3. Click **"Import"**

### Step 3: Configure Project Settings
In the import screen, set:

**Framework Preset**: Next.js (auto-detected)  
**Root Directory**: `frontend`  
**Build Command**: `npm run build` (auto-filled)  
**Output Directory**: `.next` (auto-filled)  
**Install Command**: `npm install` (auto-filled)

### Step 4: Add Environment Variables
Before deploying, click **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

*(We'll update this with your backend URL after backend deployment)*

### Step 5: Deploy!
1. Click **"Deploy"** button
2. Wait 2-3 minutes for build
3. 🎉 Your app will be live!

**Your app URL will be**: `https://omniclass-ai-frontend-xxxxx.vercel.app`

## 🔧 Deploy Backend (After Frontend)

### Option A: Railway (Recommended - Easiest)

1. Go to: **https://railway.app**
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect it's a Node.js app
6. Add environment variables:
   - `DATABASE_URL` (Railway can create PostgreSQL for you)
   - `JWT_SECRET` (generate a random string)
   - `OPENAI_API_KEY` (your OpenAI key)
   - `CORS_ORIGIN` (your Vercel frontend URL)
7. Railway will deploy automatically!

### Option B: Render

1. Go to: **https://render.com**
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables (same as Railway)
7. Deploy!

## 🔄 Update Frontend After Backend Deployment

Once backend is deployed:

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to your backend URL
3. Go to Deployments → Click "..." → Redeploy

## 📋 Environment Variables Checklist

### Frontend (Vercel):
- ✅ `NEXT_PUBLIC_API_URL` - Your backend URL

### Backend (Railway/Render):
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `JWT_SECRET` - Random secret (use: `openssl rand -base64 32`)
- ✅ `JWT_REFRESH_SECRET` - Another random secret
- ✅ `OPENAI_API_KEY` - Your OpenAI API key
- ✅ `CORS_ORIGIN` - Your Vercel frontend URL
- ✅ `NODE_ENV` - `production`

## 🗄️ Database Setup

### Using Railway:
- Railway can create PostgreSQL automatically
- Go to your project → Add → Database → PostgreSQL
- Copy the connection string to `DATABASE_URL`

### Using Neon (Free):
1. Go to: **https://neon.tech**
2. Sign up
3. Create project
4. Copy connection string

### After Database Setup:
Run migrations:
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

## ✅ You're Done!

Your app will be live at:
- **Frontend**: `https://omniclass-ai-frontend.vercel.app`
- **Backend**: `https://your-backend.railway.app` (or render.com)

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Check `VERCEL_DEPLOY.md` for detailed instructions

---

**Ready?** Start at https://vercel.com! 🚀

