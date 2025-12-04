# Deployment Guide for OmniClass AI

## Database Setup ✅

Your Neon database is configured and ready!

## Deployment Options

### Option 1: Vercel (Recommended for Next.js Frontend)

**Best for**: Frontend deployment (Next.js)

1. **Sign up**: Go to https://vercel.com
2. **Import your GitHub repository**:
   - Click "New Project"
   - Select `nyakabawurr-boop/omniclassai`
   - Root directory: `frontend`
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = Your backend API URL (see backend deployment)
4. **Deploy**: Click "Deploy"

**Note**: You'll need to deploy the backend separately (see Option 2 or 3).

---

### Option 2: Railway (Recommended for Full-Stack)

**Best for**: Deploying both frontend and backend together

1. **Sign up**: Go to https://railway.app (free tier available)
2. **New Project** → "Deploy from GitHub repo"
3. **Select your repository**: `nyakabawurr-boop/omniclassai`
4. **Add Services**:
   - **Backend Service**:
     - Root: `backend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Port: 3001
   - **Frontend Service**:
     - Root: `frontend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Port: 3000
5. **Environment Variables** (for both services):
   - Backend:
     ```
     DATABASE_URL=postgresql://neondb_owner:npg_05otOXNWUEYm@ep-curly-fog-a49qg3ja-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
     JWT_SECRET=your-secret-key
     JWT_REFRESH_SECRET=your-refresh-secret
     OPENAI_API_KEY=your-openai-key
     CORS_ORIGIN=https://your-frontend-url.railway.app
     ```
   - Frontend:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     ```
6. **Deploy**: Railway will automatically deploy

---

### Option 3: Render (Free Tier Available)

**Best for**: Separate backend and frontend services

#### Backend Deployment:

1. **Sign up**: https://render.com
2. **New** → **Web Service**
3. **Connect GitHub**: Select your repo
4. **Settings**:
   - Name: `omniclass-ai-backend`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`
5. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_05otOXNWUEYm@ep-curly-fog-a49qg3ja-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   OPENAI_API_KEY=your-openai-key
   PORT=10000
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   ```
6. **Deploy**

#### Frontend Deployment:

1. **New** → **Static Site**
2. **Connect GitHub**: Select your repo
3. **Settings**:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `.next`
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
5. **Deploy**

---

## Pre-Deployment Checklist

### Backend:

- [x] Database connection configured
- [ ] Update `CORS_ORIGIN` to your frontend URL
- [ ] Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Add `OPENAI_API_KEY`
- [ ] Test all API endpoints locally
- [ ] Run migrations: `npm run prisma:migrate`
- [ ] Seed database: `npm run prisma:seed`

### Frontend:

- [ ] Update `NEXT_PUBLIC_API_URL` to your backend URL
- [ ] Test locally with production API URL
- [ ] Build test: `npm run build`

### Database:

- [x] Neon database created
- [x] Connection string obtained
- [ ] Migrations run
- [ ] Database seeded

---

## Quick Deploy Scripts

### For Railway:

Create `railway.json` in root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### For Render:

Create `render.yaml` in root:
```yaml
services:
  - type: web
    name: omniclass-ai-backend
    env: node
    rootDir: backend
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: OPENAI_API_KEY
        sync: false

  - type: web
    name: omniclass-ai-frontend
    env: node
    rootDir: frontend
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NEXT_PUBLIC_API_URL
        fromService:
          name: omniclass-ai-backend
          type: web
          property: host
```

---

## Post-Deployment

1. **Test your deployed app**:
   - Frontend URL
   - Backend API health check
   - Register/login functionality
   - Database connectivity

2. **Update CORS settings**:
   - Backend `CORS_ORIGIN` should match your frontend URL

3. **Set up custom domain** (optional):
   - Add domain in your hosting platform
   - Update DNS records

4. **Monitor**:
   - Check logs for errors
   - Monitor database usage
   - Set up alerts

---

## Recommended: Railway (Easiest)

Railway is the easiest option because:
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Easy environment variable management
- ✅ Supports both frontend and backend
- ✅ Built-in SSL/HTTPS
- ✅ Simple scaling

**Quick Start with Railway**:
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select your repo
5. Add environment variables
6. Deploy!

---

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs

