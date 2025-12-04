# 🚀 Deploy Backend to Railway - RIGHT NOW

## ⚡ Quick Steps (Copy-Paste Ready)

### 1. Go to Railway
👉 **https://railway.app**

### 2. Create Project
- Click **"New Project"**
- Select **"Deploy from GitHub repo"**
- Choose: **nyakabawurr-boop/omniclass-ai**
- Click **"Deploy Now"**

### 3. Configure Service
- Click on your service
- **Settings** → Set **Root Directory**: `backend`

### 4. Add Database
- Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**

### 5. Add Variables
Go to service → **Variables** → Add these:

**DATABASE_URL**: Click "Reference Variable" → Select Postgres → DATABASE_URL

Then add manually:
```
NODE_ENV=production
PORT=3001
JWT_SECRET=omniclass-ai-jwt-secret-2024
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=omniclass-ai-refresh-secret-2024
JWT_REFRESH_EXPIRES_IN=30d
OPENAI_API_KEY=your-key-here
STORAGE_TYPE=local
STORAGE_PATH=./uploads
STUDENT_SUBSCRIPTION_PRICE=10
INSTRUCTOR_SUBSCRIPTION_PRICE=20
SUBSCRIPTION_BILLING_PERIOD=monthly
CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app
```

### 6. Get URL
- **Settings** → **Networking** → **Generate Domain**
- Copy the URL

### 7. Run Migrations
- Click **"Shell"** tab
- Run: `cd backend && npx prisma migrate deploy && npx prisma db seed`

### 8. Update Vercel
- Vercel Dashboard → Your project → **Settings** → **Environment Variables**
- Update `NEXT_PUBLIC_API_URL` with Railway URL
- **Redeploy**

## ✅ Done!

---

**Full guide**: See `RAILWAY_QUICK_START.md`

