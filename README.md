# OmniClass AI - AI-Powered Tutoring Platform

A comprehensive AI-powered tutoring platform designed for Zimbabwean students and instructors, supporting both Ordinary Level (Form 1-4) and Advanced Level (Form 5-6) education.

## 🎯 Features

### For Students
- **AI Text/Chat Tutoring**: Get instant help with detailed, step-by-step explanations
- **AI Video Tutoring**: Watch video explanations with whiteboard animations and audio narration
- **All Subjects Covered**: Access to all Ordinary and Advanced Level subjects
- **File Upload Support**: Upload questions, images, or documents for AI assistance
- **Affordable Subscription**: $10/month for full access

### For Instructors
- **Custom AI Agents**: Create subject-specific AI agents using your own materials
- **Lesson Plans**: Generate and manage lesson plans with AI assistance
- **Schemes of Work**: Create term/year-long schemes aligned to syllabus
- **Assessment Generation**: AI-powered generation of exercises, quizzes, and exams
- **Material Management**: Upload and organize teaching materials
- **Subscription**: $20/month for instructor features

### For Admins/Founders
- **Free Access**: Founders have full admin access without payment
- **Platform Management**: Manage users, subjects, subscriptions, and settings
- **Analytics**: View platform statistics and insights

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (React) with TypeScript and Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **AI Integration**: OpenAI GPT-4 API
- **File Storage**: Local storage (dev) / AWS S3 (production)

### Project Structure
```
.
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Auth & validation
│   │   └── utils/       # Helper functions
│   └── prisma/          # Database schema
├── frontend/            # Next.js application
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   └── lib/             # Utilities & API client
└── ARCHITECTURE.md      # Detailed architecture docs
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- OpenAI API key (for AI features)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret for JWT tokens
   - `OPENAI_API_KEY`: Your OpenAI API key
   - Other configuration as needed

4. **Set up database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## 📝 Database Setup

The application uses Prisma for database management. Key tables include:

- **Users**: User accounts with role-based access
- **Subscriptions**: Student and instructor subscriptions
- **Payments**: Payment records for Zimbabwean payment methods
- **Subjects**: Available subjects by level
- **Syllabus**: Subject syllabi and curriculum
- **ChatSessions/VideoSessions**: AI tutoring sessions
- **InstructorProfiles**: Instructor information
- **LessonPlans/SchemesOfWork/Assessments**: Instructor content

### Founders/Admin Accounts

The following emails are automatically assigned ADMIN role (free access):
- `nyakabawurr@gmail.com`
- `gzinyenya@gmail.com`

## 💳 Payment Integration

The platform supports Zimbabwean payment methods:
- **EcoCash**
- **OneMoney**
- **Omari**
- **Bank Cards**
- **Bank Transfers**

Payment integration is abstracted in `backend/src/services/paymentService.ts`. To integrate real payment gateways:

1. Update `generatePaymentUrl()` with actual gateway APIs
2. Implement payment callback handlers
3. Update `handlePaymentCallback()` to verify payments

## 🤖 AI Integration

AI features use OpenAI GPT-4 API:

1. **Subject-Specific Agents**: Each subject has a configurable AI agent with custom system prompts
2. **Chat Responses**: Real-time text-based tutoring
3. **Video Scripts**: Generate step-by-step video explanations
4. **Content Generation**: AI-assisted lesson plans, schemes of work, and assessments

To configure AI agents:
- Default agents are created per subject
- Instructors can create custom agents using their materials
- System prompts are stored in `AIAgentConfig` table

## 📁 File Uploads

File uploads are stored locally in development (`./uploads`). For production:

1. Configure AWS S3 credentials in `.env`
2. Update `STORAGE_TYPE=aws` in backend `.env`
3. Implement S3 upload logic in `backend/src/routes/files.ts`

## 🎥 Video Generation

Video generation is currently a placeholder. To implement:

1. Generate video script using AI (already implemented)
2. Use text-to-speech for narration
3. Create whiteboard animations (Canvas/WebGL)
4. Combine into video file
5. Store in file storage
6. Stream via `/api/video/sessions/:id/video` endpoint

## 🔐 Security

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt
- File upload validation
- CORS configuration
- Input validation with express-validator

## 📊 API Documentation

See `ARCHITECTURE.md` for complete API endpoint documentation.

Key endpoints:
- `/api/auth/*` - Authentication
- `/api/subscriptions/*` - Subscription management
- `/api/payments/*` - Payment processing
- `/api/subjects/*` - Subject and syllabus
- `/api/chat/*` - AI chat sessions
- `/api/video/*` - AI video sessions
- `/api/instructors/*` - Instructor features
- `/api/admin/*` - Admin dashboard

## 🚢 Deployment

### Backend Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Start with PM2 or similar:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

Or deploy to Vercel/Netlify for automatic deployments.

## 🔄 Next Steps

1. **Payment Integration**: Connect real Zimbabwean payment gateways
2. **Video Generation**: Implement actual video rendering pipeline
3. **Email Service**: Add email verification and password reset
4. **Real-time Chat**: Add WebSocket support for live chat
5. **Mobile App**: Build React Native mobile application
6. **Analytics**: Add detailed usage analytics
7. **Content Management**: Admin UI for managing subjects and syllabi

## 📄 License

Proprietary - All rights reserved

## 👥 Founders

- Raymond Royal Nyakabawu (nyakabawurr@gmail.com)
- Gilbert Zinyenya (gzinyenya@gmail.com)

---

For detailed architecture and API documentation, see `ARCHITECTURE.md`.

