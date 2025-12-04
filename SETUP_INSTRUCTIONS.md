# Setup Instructions for OmniClass AI

## Prerequisites

Before running the application, you need to install:

### 1. Node.js (Required)
- Download and install Node.js 18+ from: https://nodejs.org/
- Choose the LTS (Long Term Support) version
- During installation, make sure to check "Add to PATH"
- Verify installation by opening a new terminal and running:
  ```powershell
  node --version
  npm --version
  ```

### 2. PostgreSQL (Required)
- Download and install PostgreSQL 14+ from: https://www.postgresql.org/download/windows/
- During installation, remember the password you set for the `postgres` user
- After installation, create the database:
  ```sql
  -- Open psql or pgAdmin and run:
  CREATE DATABASE omniclass_ai;
  ```

### 3. OpenAI API Key (Required for AI features)
- Sign up at: https://platform.openai.com/
- Get your API key from: https://platform.openai.com/api-keys
- You'll need to add this to the backend `.env` file

## Quick Setup (Automated)

1. **Run the setup script** (after installing Node.js and PostgreSQL):
   ```powershell
   .\setup.ps1
   ```

2. **Edit environment files**:
   - `backend/.env` - Set DATABASE_URL, OPENAI_API_KEY, JWT_SECRET
   - `frontend/.env.local` - Should already be configured

3. **Start the servers**:
   - Open two terminal windows
   - Terminal 1: `.\start-backend.ps1`
   - Terminal 2: `.\start-frontend.ps1`

## Manual Setup

### Backend Setup

1. Navigate to backend directory:
   ```powershell
   cd backend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create `.env` file (copy from `.env.example` if it exists, or create new):
   ```env
   PORT=3001
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/omniclass_ai?schema=public"
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
   JWT_REFRESH_EXPIRES_IN=30d
   OPENAI_API_KEY=your-openai-api-key-here
   STORAGE_TYPE=local
   STORAGE_PATH=./uploads
   STUDENT_SUBSCRIPTION_PRICE=10
   INSTRUCTOR_SUBSCRIPTION_PRICE=20
   SUBSCRIPTION_BILLING_PERIOD=monthly
   CORS_ORIGIN=http://localhost:3000
   ```

4. Generate Prisma client:
   ```powershell
   npm run prisma:generate
   ```

5. Run database migrations:
   ```powershell
   npm run prisma:migrate
   ```

6. Seed the database:
   ```powershell
   npm run prisma:seed
   ```

7. Start the backend server:
   ```powershell
   npm run dev
   ```

Backend will run on: `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_APP_NAME=OmniClass AI
   ```

4. Start the frontend server:
   ```powershell
   npm run dev
   ```

Frontend will run on: `http://localhost:3000`

## Accessing the Application

1. Open your browser and go to: `http://localhost:3000`

2. **Login as Founder/Admin** (free access):
   - Email: `nyakabawurr@gmail.com` or `gzinyenya@gmail.com`
   - Password: `password123` (change in production!)

3. **Or create a new account**:
   - Click "Get Started" or "Register"
   - Fill in your details
   - You'll be assigned STUDENT role by default

## Troubleshooting

### Node.js not found
- Make sure Node.js is installed and added to PATH
- Restart your terminal after installation
- Try: `refreshenv` (if using Chocolatey) or restart your computer

### PostgreSQL connection error
- Make sure PostgreSQL service is running
- Check DATABASE_URL in `backend/.env`
- Verify database `omniclass_ai` exists
- Test connection: `psql -U postgres -d omniclass_ai`

### Port already in use
- Change PORT in `backend/.env` (default: 3001)
- Frontend uses port 3000 by default
- Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` if you change backend port

### OpenAI API errors
- Verify OPENAI_API_KEY is set correctly in `backend/.env`
- Check you have API credits
- Ensure API key has access to GPT-4

### Prisma errors
- Make sure DATABASE_URL is correct
- Run `npm run prisma:generate` again
- Check PostgreSQL is running

## Next Steps

1. **Add Subjects**: Use admin dashboard to add more subjects with syllabi
2. **Configure AI Agents**: Customize system prompts for each subject
3. **Test Features**: Try chat, video, and instructor features
4. **Production Setup**: See README.md for deployment instructions

## Support

For issues or questions, refer to:
- `README.md` - Full documentation
- `ARCHITECTURE.md` - Technical architecture
- `QUICK_START.md` - Quick reference guide

