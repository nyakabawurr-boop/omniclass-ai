# ✅ Complete Railway Backend Setup

## Your Railway Project
**Project Link**: https://railway.com/project/1d6dfb2d-5bba-4d80-8e3f-58b0860810c2/service/50d77869-c3a2-44f9-8259-1d02ce952112

## Step-by-Step Completion Guide

### ✅ Step 1: Configure Service Root Directory

1. Go to your Railway project: https://railway.com/project/1d6dfb2d-5bba-4d80-8e3f-58b0860810c2
2. Click on your **service** (the deployed app)
3. Go to **"Settings"** tab
4. Scroll to **"Root Directory"**
5. Set it to: `backend`
6. Click **"Save"**

### ✅ Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"** (top right)
2. Select **"Database"**
3. Click **"Add PostgreSQL"**
4. Railway will create the database automatically
5. **Note the service name** (usually "Postgres")

### ✅ Step 3: Add Environment Variables

1. Go to your **backend service** → **"Variables"** tab
2. Click **"New Variable"** for each one:

#### Variable 1: DATABASE_URL (Use Railway's Reference)
- **Name**: `DATABASE_URL`
- Click **"Reference Variable"** button
- Select your **Postgres** service
- Select **`DATABASE_URL`**
- Click **"Add"**

#### Variable 2-14: Add These Manually
Click **"New Variable"** for each:

| Variable Name | Value |
|--------------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `JWT_SECRET` | `omniclass-ai-jwt-secret-production-2024` |
| `JWT_EXPIRES_IN` | `7d` |
| `JWT_REFRESH_SECRET` | `omniclass-ai-refresh-secret-production-2024` |
| `JWT_REFRESH_EXPIRES_IN` | `30d` |
| `OPENAI_API_KEY` | `your-openai-api-key-here` *(replace with your actual key)* |
| `STORAGE_TYPE` | `local` |
| `STORAGE_PATH` | `./uploads` |
| `STUDENT_SUBSCRIPTION_PRICE` | `10` |
| `INSTRUCTOR_SUBSCRIPTION_PRICE` | `20` |
| `SUBSCRIPTION_BILLING_PERIOD` | `monthly` |
| `CORS_ORIGIN` | `https://your-vercel-frontend-url.vercel.app` *(replace with your Vercel URL)* |

**Important**: 
- Replace `your-openai-api-key-here` with your actual OpenAI API key
- Replace `your-vercel-frontend-url.vercel.app` with your actual Vercel frontend URL

### ✅ Step 4: Get Your Backend URL

1. Go to your backend service → **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** (if not already generated)
4. **Copy the URL** (e.g., `https://omniclass-ai-backend-production.up.railway.app`)
5. **Save this URL** - you'll need it for the frontend!

### ✅ Step 5: Run Database Migrations

1. Go to your backend service
2. Click **"Shell"** tab (or "Deployments" → Latest deployment → "Shell")
3. Run these commands one by one:

```bash
cd backend
npx prisma migrate deploy
```

Wait for it to complete, then:

```bash
npx prisma db seed
```

This will:
- Create all database tables
- Seed initial data (founder accounts, sample subjects)

### ✅ Step 6: Verify Backend is Working

1. Go to your backend service → **"Settings"** → **"Networking"**
2. Copy your backend URL
3. Open in browser: `https://your-backend-url.railway.app/health`
4. You should see: `{"status":"ok","timestamp":"..."}`

### ✅ Step 7: Update Vercel Frontend

1. Go to **Vercel Dashboard**: https://vercel.com
2. Select your **frontend project**
3. Go to **"Settings"** → **"Environment Variables"**
4. Find `NEXT_PUBLIC_API_URL`
5. Update it to your Railway backend URL (from Step 4)
6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click **"..."** on the latest deployment → **"Redeploy"**

### ✅ Step 8: Test Everything

1. Visit your **Vercel frontend URL**
2. Try to **register** a new account
3. Try to **login**
4. Check browser console (F12) for any errors

## 🎉 You're Done!

Your backend is now live on Railway and connected to your Vercel frontend!

## 📋 Quick Checklist

- [ ] Root Directory set to `backend`
- [ ] PostgreSQL database added
- [ ] All environment variables added
- [ ] Backend URL generated and copied
- [ ] Database migrations run
- [ ] Backend health check works
- [ ] Vercel frontend updated with backend URL
- [ ] Frontend redeployed
- [ ] Tested registration/login

## 🆘 Troubleshooting

### Build Fails:
- Check Railway **"Deployments"** → **"View Logs"**
- Verify Root Directory is set to `backend`
- Check all environment variables are set

### Database Connection Error:
- Verify `DATABASE_URL` is set using Railway's variable reference
- Check PostgreSQL service is running
- Ensure migrations have run

### CORS Errors:
- Verify `CORS_ORIGIN` matches your Vercel URL exactly
- Include `https://` in the URL
- No trailing slash

### API Not Responding:
- Check Railway service logs
- Verify service is running (green status)
- Check PORT is set correctly

---

**Need help?** Check Railway logs in the "Deployments" tab for detailed error messages.

