# 🚀 Deploy Your App Now!

## Your Neon Database is Ready ✅

Connection string configured: `postgresql://neondb_owner:npg_05otOXNWUEYm@ep-curly-fog-a49qg3ja-pooler.us-east-1.aws.neon.tech/neondb`

## Quick Deploy to Railway (5 minutes)

### 1. Go to Railway
- Visit: https://railway.app
- Sign up with GitHub (free tier)

### 2. Create New Project
- Click **"New Project"**
- Select **"Deploy from GitHub repo"**
- Choose: `nyakabawurr-boop/omniclassai`

### 3. Add Backend Service
- Click **"Add Service"** → **"Empty Service"**
- Name it: `backend`
- Go to **Settings**:
  - **Root Directory**: `backend`
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`
- Go to **Variables** tab, add:
  ```
  DATABASE_URL=postgresql://neondb_owner:npg_05otOXNWUEYm@ep-curly-fog-a49qg3ja-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
  JWT_SECRET=change-this-to-random-secret-key
  JWT_REFRESH_SECRET=change-this-to-random-refresh-secret
  OPENAI_API_KEY=your-openai-api-key
  NODE_ENV=production
  PORT=3001
  ```
- Railway will auto-deploy! Copy the backend URL (e.g., `https://backend-production-xxxx.up.railway.app`)

### 4. Add Frontend Service
- Click **"Add Service"** → **"Empty Service"**
- Name it: `frontend`
- Go to **Settings**:
  - **Root Directory**: `frontend`
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`
- Go to **Variables** tab, add:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
  ```
- Update backend **CORS_ORIGIN** variable to your frontend URL
- Railway will auto-deploy!

### 5. Run Database Migrations
In Railway backend service:
- Go to **Deployments** → Latest deployment
- Click **"View Logs"**
- Or use Railway CLI:
  ```bash
  railway run npm run prisma:migrate
  railway run npm run prisma:seed
  ```

## 🎉 Your App is Live!

- Frontend: `https://your-frontend.railway.app`
- Backend: `https://your-backend.railway.app`

## 📝 Important Notes

1. **Generate Strong Secrets**:
   - Use a password generator for `JWT_SECRET` and `JWT_REFRESH_SECRET`
   - Keep them secure!

2. **Update CORS**:
   - Backend `CORS_ORIGIN` must match your frontend URL exactly

3. **Database Migrations**:
   - Run migrations after first deployment
   - Use Railway CLI or add to build command

4. **Environment Variables**:
   - Never commit `.env` files
   - Add all secrets in Railway Variables tab

## 🔗 Your Repository

Already pushed to: https://github.com/nyakabawurr-boop/omniclassai

## 📚 Full Documentation

- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `QUICK_DEPLOY.md` - Quick reference
- `README.md` - Full project documentation

## ✅ Checklist

- [x] Code pushed to GitHub
- [x] Neon database configured
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Railway
- [ ] Run database migrations
- [ ] Test live app
- [ ] Update CORS settings

**You're ready to deploy!** 🚀

