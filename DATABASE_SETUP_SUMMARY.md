# Database Setup Summary

## Current Status
✅ Backend API is running on http://localhost:3001  
✅ Frontend is running on http://localhost:3000  
❌ Database (PostgreSQL) is not set up yet

## Quick Setup Options

### Option 1: Neon (Cloud - Recommended - 2 minutes)
1. Go to https://neon.tech
2. Sign up (free)
3. Create new project: `omniclass-ai`
4. Copy connection string
5. Update `backend/.env`: `DATABASE_URL="your-neon-connection-string"`
6. Run:
   ```powershell
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

### Option 2: Supabase (Cloud - Free)
1. Go to https://supabase.com
2. Sign up and create project
3. Get connection string from Settings → Database
4. Update `backend/.env`
5. Run migrations and seed

### Option 3: Local PostgreSQL
1. Download: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Create database: `CREATE DATABASE omniclass_ai;`
4. Update `backend/.env` with your password
5. Run migrations and seed

## After Database Setup

Once you have a working DATABASE_URL:

```powershell
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Then restart the backend server.

## Testing

After database is set up, you can test:
- User registration: `POST /api/auth/register`
- User login: `POST /api/auth/login`
- Get subjects: `GET /api/subjects`
- All other endpoints

See `test-api.ps1` for automated testing (once database is set up).

