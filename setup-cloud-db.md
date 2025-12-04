# Quick Database Setup - Cloud PostgreSQL (Recommended)

## Option 1: Neon (Free Tier) - Fastest Setup

1. **Sign up**: Go to https://neon.tech and create a free account
2. **Create Database**: 
   - Click "New Project"
   - Name: `omniclass-ai`
   - Region: Choose closest to you
3. **Get Connection String**:
   - Copy the connection string (looks like: `postgresql://user:password@host/dbname`)
4. **Update backend/.env**:
   ```
   DATABASE_URL="your-neon-connection-string"
   ```
5. **Run migrations**:
   ```powershell
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

## Option 2: Supabase (Free Tier)

1. **Sign up**: Go to https://supabase.com and create account
2. **Create Project**:
   - Click "New Project"
   - Name: `omniclass-ai`
   - Database password: (remember this)
3. **Get Connection String**:
   - Go to Settings → Database
   - Copy "Connection string" (URI format)
4. **Update backend/.env**:
   ```
   DATABASE_URL="your-supabase-connection-string"
   ```
5. **Run migrations**:
   ```powershell
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

## Option 3: Local PostgreSQL Installation

If you prefer local installation:

1. **Download**: https://www.postgresql.org/download/windows/
2. **Install** with default settings
3. **Create Database**:
   ```sql
   CREATE DATABASE omniclass_ai;
   ```
4. **Update backend/.env**:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/omniclass_ai?schema=public"
   ```
5. **Run migrations**:
   ```powershell
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

## After Database Setup

Once you have a working DATABASE_URL:

```powershell
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Then restart the backend server if it's running.

