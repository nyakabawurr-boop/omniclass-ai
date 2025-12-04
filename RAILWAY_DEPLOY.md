# 🚂 Deploy Backend to Railway - Step by Step

## ✅ Configuration Files Created

I've created `railway.json` files to help Railway auto-detect your backend setup.

## 🎯 Deploy in 5 Steps

### Step 1: Go to Railway
1. Visit: **https://railway.app**
2. Click **"Start a New Project"** or **"Login"**
3. Sign up/Login with **GitHub** (same account as Vercel)

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select: **nyakabawurr-boop/omniclass-ai**
4. Click **"Deploy Now"**

### Step 3: Configure Service
Railway will auto-detect your project. You need to configure it:

1. **Click on your service** (the deployed app)
2. Go to **"Settings"** tab
3. Set **"Root Directory"** to: `backend`
4. Set **"Build Command"** to: `npm install && npm run build && npx prisma generate`
5. Set **"Start Command"** to: `npm start`

### Step 4: Add PostgreSQL Database
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a PostgreSQL database
4. **Copy the connection string** (you'll need it in Step 5)

### Step 5: Add Environment Variables
1. Go to your service → **"Variables"** tab
2. Click **"New Variable"**
3. Add these variables one by one:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

*(For DATABASE_URL, click "Reference Variable" and select your PostgreSQL service)*

Then add these manually:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=30d
OPENAI_API_KEY=your-openai-api-key-here
STORAGE_TYPE=local
STORAGE_PATH=./uploads
STUDENT_SUBSCRIPTION_PRICE=10
INSTRUCTOR_SUBSCRIPTION_PRICE=20
SUBSCRIPTION_BILLING_PERIOD=monthly
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**Important**: Replace:
- `your-openai-api-key-here` with your actual OpenAI API key
- `https://your-frontend-url.vercel.app` with your actual Vercel frontend URL (from Step 6)

### Step 6: Get Your Backend URL
1. Go to your service → **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"** (or use the provided domain)
4. **Copy the URL** - this is your backend API URL!

### Step 7: Run Database Migrations
1. In Railway, go to your service
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Click **"View Logs"**
5. In the logs, you should see Prisma generating the client

To run migrations, you can:
- Use Railway's **"Shell"** feature (click "Shell" in your service)
- Or add a one-time command in the deployment

**Option A: Using Railway Shell**
1. Click **"Shell"** in your service
2. Run:
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

**Option B: Add to Build Command** (temporary)
Update build command to:
```
npm install && npm run build && npx prisma generate && npx prisma migrate deploy
```

### Step 8: Update Frontend API URL
1. Go to **Vercel Dashboard** → Your frontend project
2. Go to **"Settings"** → **"Environment Variables"**
3. Update `NEXT_PUBLIC_API_URL` to your Railway backend URL
4. Go to **"Deployments"** → Click **"..."** → **"Redeploy"**

## 🔍 Verify Deployment

### Test Backend:
1. Visit: `https://your-backend-url.railway.app/health`
2. You should see: `{"status":"ok","timestamp":"..."}`

### Test Frontend:
1. Visit your Vercel URL
2. Try to register/login
3. Check browser console for API calls

## 📋 Quick Checklist

- [ ] Railway project created
- [ ] Backend service configured (root: `backend`)
- [ ] PostgreSQL database added
- [ ] Environment variables added
- [ ] Backend URL generated
- [ ] Database migrations run
- [ ] Frontend API URL updated in Vercel
- [ ] Frontend redeployed

## 🆘 Troubleshooting

### Build Fails:
- Check Railway logs
- Verify `backend/package.json` has all dependencies
- Ensure build command is correct

### Database Connection Error:
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running
- Ensure migrations have run

### CORS Errors:
- Verify `CORS_ORIGIN` matches your Vercel frontend URL exactly
- Include `https://` in the URL
- No trailing slash

### API Not Responding:
- Check Railway service is running
- Verify PORT is set (Railway auto-assigns, but check logs)
- Check service logs for errors

## 💡 Pro Tips

1. **Use Railway's Variable References**: For `DATABASE_URL`, use `${{Postgres.DATABASE_URL}}` instead of hardcoding
2. **Monitor Logs**: Railway shows real-time logs - very helpful for debugging
3. **Free Tier**: Railway gives you $5 free credit monthly - perfect for testing!
4. **Custom Domain**: You can add a custom domain in Railway settings

## 🎉 You're Done!

Your backend should now be live at: `https://your-backend.railway.app`

Update your Vercel frontend with this URL and you're all set!

---

**Need help?** Check Railway docs: https://docs.railway.app

