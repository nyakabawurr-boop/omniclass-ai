# Vercel Deployment Setup

## ✅ Frontend Deployed!

Your frontend is live at:
- **Production**: https://omniclassai.vercel.app
- **Preview**: https://omniclassai-azraegm84-raymond-royal-nyakabawus-projects.vercel.app

## 🔧 Next Steps: Configure Environment Variables

### 1. Go to Vercel Project Settings

1. Go to: https://vercel.com/dashboard
2. Click on **`omniclassai`** project
3. Go to **Settings** → **Environment Variables**

### 2. Add Environment Variable

Click **"Add New"** and add:

**Variable Name**: `NEXT_PUBLIC_API_URL`

**Value**: Your Railway backend URL
- If backend is on Railway: `https://your-backend-url.railway.app`
- If backend is not deployed yet: Deploy backend first (see below)

**Environment**: Select all (Production, Preview, Development)

Click **Save**

### 3. Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger auto-deploy

## 🚀 Deploy Backend to Railway

Your frontend needs a backend API. Deploy backend to Railway:

### Step 1: Railway Backend Setup

1. Go to: https://railway.app/dashboard
2. Create new project or use existing
3. Add service → Empty Service
4. Name: `backend`
5. **Settings**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
6. **Variables** (add these):
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_05otOXNWUEYm@ep-curly-fog-a49qg3ja-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-here
   OPENAI_API_KEY=your-openai-key
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://omniclassai.vercel.app
   ```
7. Get backend URL (e.g., `https://backend-production-xxxx.up.railway.app`)

### Step 2: Update Vercel Environment Variable

1. Go back to Vercel
2. Update `NEXT_PUBLIC_API_URL` with your Railway backend URL
3. Redeploy frontend

## ✅ Complete Setup Checklist

- [x] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] Environment variables set in Vercel
- [ ] CORS configured in backend
- [ ] Database migrations run
- [ ] Test the live app

## 🧪 Test Your Deployment

1. **Frontend**: https://omniclassai.vercel.app
2. **Backend Health**: `https://your-backend-url.railway.app/health`
3. **Test Registration**: Try creating an account
4. **Test Login**: Use founder account:
   - Email: `nyakabawurr@gmail.com`
   - Password: `password123`

## 📝 Important Notes

1. **CORS**: Backend `CORS_ORIGIN` must include your Vercel domain
2. **Environment Variables**: Must be set in Vercel dashboard (not just in code)
3. **Redeploy**: After changing env vars, redeploy is required
4. **HTTPS**: Both Vercel and Railway provide HTTPS automatically

## 🎉 Your App URLs

- **Frontend**: https://omniclassai.vercel.app
- **Backend**: `https://your-backend-url.railway.app` (after Railway deployment)

Your frontend is live! Now deploy the backend to Railway and connect them! 🚀

