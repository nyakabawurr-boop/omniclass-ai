# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- OpenAI API key (get one from https://platform.openai.com/)

## Setup Steps

### 1. Database Setup
```bash
# Create a PostgreSQL database
createdb omniclass_ai

# Or using psql:
psql -U postgres
CREATE DATABASE omniclass_ai;
\q
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and set:
# - DATABASE_URL="postgresql://user:password@localhost:5432/omniclass_ai?schema=public"
# - JWT_SECRET="your-secret-key-here"
# - OPENAI_API_KEY="your-openai-api-key"
# - Other settings as needed

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (creates founder accounts and sample subjects)
npm run prisma:seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local and set:
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Start frontend server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Testing the Application

### 1. Login as Founder/Admin
- Go to `http://localhost:3000/login`
- Email: `nyakabawurr@gmail.com` or `gzinyenya@gmail.com`
- Password: `password123` (change in production!)

### 2. Create a Student Account
- Register at `http://localhost:3000/register`
- You'll be assigned STUDENT role by default

### 3. Subscribe (for non-admin users)
- Go to Dashboard → Subscriptions
- Click "Subscribe" for Student or Instructor plan
- Note: Payment integration is stubbed - in production, connect real payment gateways

### 4. Use AI Tutoring
- Go to Dashboard → Subjects
- Select a subject
- Choose "AI Text/Chat Tutor" or "AI Video Tutor"
- Ask questions and get AI-powered explanations

### 5. Instructor Features (if subscribed)
- Go to Dashboard → Instructor Portal
- Create profile
- Upload materials
- Generate lesson plans, schemes of work, and assessments

## Default Data

The seed script creates:
- 2 founder/admin accounts (free access)
- Sample subjects for Ordinary and Advanced levels
- Default AI agent config for Mathematics

## Next Steps

1. **Add Real Subjects**: Use admin dashboard or API to add more subjects with syllabi
2. **Configure AI Agents**: Customize system prompts for each subject
3. **Integrate Payments**: Connect real Zimbabwean payment gateways
4. **Implement Video Generation**: Build actual video rendering pipeline
5. **Add Email Service**: Implement email verification and password reset

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- Verify database exists

### OpenAI API Errors
- Verify OPENAI_API_KEY is set correctly
- Check you have API credits
- Ensure API key has access to GPT-4

### Port Already in Use
- Change PORT in backend `.env`
- Update NEXT_PUBLIC_API_URL in frontend `.env.local`

## Production Deployment

See `README.md` for deployment instructions. Key points:
- Set strong JWT secrets
- Use environment variables for all secrets
- Configure production database
- Set up AWS S3 for file storage
- Enable HTTPS
- Configure CORS properly
- Set up monitoring and logging

