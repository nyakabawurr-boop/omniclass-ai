# Vercel Deployment Guide

## Quick Deploy

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```
   Follow the prompts and select:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name? **omniclass-ai-frontend**
   - Directory? **./frontend**
   - Override settings? **No**

4. **Deploy Backend** (as separate project):
   ```bash
   cd backend
   vercel
   ```
   - Project name: **omniclass-ai-backend**
   - Directory: **./backend**

### Option 2: Deploy via GitHub Integration

1. **Connect GitHub to Vercel**:
   - Go to https://vercel.com
   - Sign up/Login
   - Click "Add New Project"
   - Import your GitHub repository: `nyakabawurr-boop/omniclass-ai`

2. **Configure Frontend Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

3. **Environment Variables** (Add these in Vercel dashboard):
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   ```

4. **Deploy Backend Separately**:
   - Create another project in Vercel
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Environment Variables Setup

### Frontend Environment Variables (in Vercel):
```
NEXT_PUBLIC_API_URL=https://omniclass-ai-backend.vercel.app
NEXT_PUBLIC_APP_NAME=OmniClass AI
```

### Backend Environment Variables (in Vercel):
```
NODE_ENV=production
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-production-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d
OPENAI_API_KEY=your-openai-api-key
STORAGE_TYPE=aws
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
STUDENT_SUBSCRIPTION_PRICE=10
INSTRUCTOR_SUBSCRIPTION_PRICE=20
SUBSCRIPTION_BILLING_PERIOD=monthly
CORS_ORIGIN=https://omniclass-ai-frontend.vercel.app
```

## Database Setup for Production

You'll need a PostgreSQL database. Options:

1. **Vercel Postgres** (Recommended):
   - Go to Vercel dashboard → Storage → Create Database
   - Select PostgreSQL
   - Copy connection string to `DATABASE_URL`

2. **Neon** (Free tier available):
   - Go to https://neon.tech
   - Create free database
   - Copy connection string

3. **Supabase** (Free tier available):
   - Go to https://supabase.com
   - Create project
   - Get connection string from Settings → Database

## Post-Deployment Steps

1. **Run Database Migrations**:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

2. **Seed Database** (optional):
   ```bash
   npx prisma db seed
   ```

3. **Update Frontend API URL**:
   - Update `NEXT_PUBLIC_API_URL` in Vercel dashboard
   - Redeploy frontend

## Troubleshooting

### Build Errors:
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

### Database Connection:
- Verify DATABASE_URL is correct
- Check if database allows connections from Vercel IPs
- Ensure SSL is enabled if required

### API Routes Not Working:
- Verify CORS_ORIGIN includes your frontend URL
- Check route configuration in vercel.json
- Review function logs in Vercel dashboard

## Custom Domain

1. Go to Vercel project settings
2. Add your domain
3. Update DNS records as instructed
4. Update CORS_ORIGIN to include your domain

