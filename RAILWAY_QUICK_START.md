# 🚂 Railway Backend Deployment - Quick Start

## ⚡ Fast Track (5 Minutes)

### Step 1: Create Project in Railway (Web Interface Required)

1. **Go to**: https://railway.app
2. **Click**: "Start a New Project" or "Login"
3. **Sign in** with GitHub
4. **Click**: "New Project"
5. **Select**: "Deploy from GitHub repo"
6. **Find**: `nyakabawurr-boop/omniclass-ai`
7. **Click**: "Deploy Now"

Railway will start deploying automatically!

### Step 2: Configure Service

1. **Click** on your deployed service
2. Go to **"Settings"** tab
3. Set **"Root Directory"** to: `backend`
4. Railway will auto-detect the rest

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway creates it automatically
4. **Note the service name** (usually "Postgres")

### Step 4: Add Environment Variables

Go to your backend service → **"Variables"** tab → Click **"New Variable"**

**Add these one by one:**

1. **DATABASE_URL** (use Railway's variable reference):
   - Click **"Reference Variable"**
   - Select your **Postgres** service
   - Select **DATABASE_URL**
   - Click **"Add"**

2. **NODE_ENV**:
   - Value: `production`

3. **PORT**:
   - Value: `3001`

4. **JWT_SECRET**:
   - Value: `omniclass-ai-super-secret-jwt-key-production-2024`
   - *(Change this to a random string in production!)*

5. **JWT_EXPIRES_IN**:
   - Value: `7d`

6. **JWT_REFRESH_SECRET**:
   - Value: `omniclass-ai-super-secret-refresh-key-production-2024`
   - *(Change this to a random string in production!)*

7. **JWT_REFRESH_EXPIRES_IN**:
   - Value: `30d`

8. **OPENAI_API_KEY**:
   - Value: `your-openai-api-key-here`
   - *(Replace with your actual OpenAI API key)*

9. **STORAGE_TYPE**:
   - Value: `local`

10. **STORAGE_PATH**:
    - Value: `./uploads`

11. **STUDENT_SUBSCRIPTION_PRICE**:
    - Value: `10`

12. **INSTRUCTOR_SUBSCRIPTION_PRICE**:
    - Value: `20`

13. **SUBSCRIPTION_BILLING_PERIOD**:
    - Value: `monthly`

14. **CORS_ORIGIN**:
    - Value: `https://your-frontend-url.vercel.app`
    - *(Replace with your actual Vercel frontend URL)*

### Step 5: Get Your Backend URL

1. Go to your service → **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. **Copy the URL** (e.g., `https://omniclass-ai-backend-production.up.railway.app`)

### Step 6: Run Database Migrations

**Option A: Using Railway Shell (Easiest)**

1. Go to your backend service
2. Click **"Shell"** tab
3. Run:
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

**Option B: Using Railway CLI**

```powershell
railway run --service your-service-name npx prisma migrate deploy
railway run --service your-service-name npx prisma db seed
```

### Step 7: Update Frontend

1. Go to **Vercel Dashboard** → Your frontend project
2. **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_URL` to your Railway backend URL
4. **Deployments** → Click **"..."** → **"Redeploy"**

## ✅ Verify

- **Backend Health**: `https://your-backend.railway.app/health`
- **Frontend**: Visit your Vercel URL and test login

## 🎉 Done!

Your backend is now live on Railway!

---

**Need help?** Check `RAILWAY_DEPLOY.md` for detailed troubleshooting.

