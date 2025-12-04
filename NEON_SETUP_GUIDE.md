# Neon Database Setup Guide - Step by Step

## Quick Setup (5 minutes)

### Step 1: Create Neon Account

1. **Open your browser** and go to: https://neon.tech
2. **Click "Sign Up"** (top right)
   - You can sign up with:
     - GitHub (recommended - fastest)
     - Google
     - Email
3. **Complete the signup process**

### Step 2: Create Project

1. After logging in, you'll see the dashboard
2. **Click "New Project"** button
3. Fill in the form:
   - **Project name**: `omniclass-ai`
   - **Region**: Choose closest to you (e.g., "US East (Ohio)")
   - **PostgreSQL version**: 15 (default is fine)
4. **Click "Create Project"**

### Step 3: Get Connection String

After the project is created:

1. You'll see a **connection string** displayed on the screen
   - It looks like: `postgresql://user:password@ep-xxx-xxx.region.neon.tech/neondb?sslmode=require`
2. **Click the "Copy" button** next to the connection string
   - Or manually select and copy the entire string

**Important**: Copy the ENTIRE connection string including `?sslmode=require`

### Step 4: Run Setup Script

1. **Open PowerShell** in the project directory
2. **Run the setup script**:
   ```powershell
   .\setup-neon-database.ps1
   ```
3. **Follow the prompts**:
   - Press Enter when you have the connection string
   - Paste your connection string when asked
   - The script will automatically:
     - Update `backend/.env`
     - Generate Prisma client
     - Run database migrations
     - Seed initial data

### Step 5: Verify Setup

After the script completes:

1. **Check for success messages**:
   - ✓ Prisma client generated
   - ✓ Migrations completed
   - ✓ Database seeded successfully

2. **Restart backend server** (if running):
   ```powershell
   # Stop current server (Ctrl+C)
   cd backend
   npm run dev
   ```

3. **Test the API**:
   - Open: http://localhost:3001/health
   - Should return: `{"status":"ok",...}`

## Manual Setup (Alternative)

If you prefer to set it up manually:

1. **Get connection string** from Neon (Step 3 above)

2. **Update `backend/.env`**:
   ```
   DATABASE_URL="your-neon-connection-string-here"
   ```

3. **Run commands**:
   ```powershell
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

## Troubleshooting

### Connection String Issues

- **Make sure** the connection string starts with `postgresql://`
- **Include** the `?sslmode=require` part at the end
- **Don't** add extra quotes or spaces

### Migration Errors

- **Check** your connection string is correct
- **Verify** Neon project is active (not paused)
- **Try** running migrations again: `npm run prisma:migrate`

### "Can't reach database server"

- **Check** your internet connection
- **Verify** Neon project is not paused
- **Try** copying the connection string again from Neon dashboard

## What Gets Created

After seeding, your database will have:

- ✅ **2 Founder/Admin accounts**:
  - `nyakabawurr@gmail.com` (password: `password123`)
  - `gzinyenya@gmail.com` (password: `password123`)

- ✅ **Sample subjects**:
  - Ordinary Level: Mathematics, English, Science, History, etc.
  - Advanced Level: Mathematics, Biology, Chemistry, Physics, etc.

- ✅ **Default AI agent configs** for Mathematics

## Next Steps

After database is set up:

1. **Access the frontend**: http://localhost:3000
2. **Login as founder**: Use one of the founder emails
3. **Test features**: 
   - Browse subjects
   - Create chat sessions
   - Test instructor features (if subscribed)

## Need Help?

- Neon Documentation: https://neon.tech/docs
- Neon Support: https://neon.tech/support
- Project README: See `README.md`

