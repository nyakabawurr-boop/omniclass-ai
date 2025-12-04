# OmniClass AI - Architecture Documentation

## Tech Stack Choice

### Frontend: Next.js 14 (React)
- **Rationale**: 
  - Server-side rendering for better SEO and performance
  - Built-in API routes for backend integration
  - Excellent TypeScript support
  - Modern React features (hooks, context)
  - Easy deployment and routing
  - Component-based architecture for maintainability

### Backend: Node.js + Express + TypeScript
- **Rationale**:
  - TypeScript for type safety
  - Express for RESTful API design
  - Can be easily containerized
  - Good ecosystem for integrations (payments, AI, file storage)
  - Can be separated from frontend for scalability

### Database: PostgreSQL + Prisma ORM
- **Rationale**:
  - PostgreSQL for robust relational data (users, subscriptions, content)
  - Prisma for type-safe database access
  - Excellent migration system
  - Good performance for complex queries
  - ACID compliance for financial transactions

### Authentication: JWT (JSON Web Tokens)
- **Rationale**:
  - Stateless authentication
  - Works well with microservices
  - Secure and scalable
  - Easy to implement role-based access

### File Storage: AWS S3 (Production) / Local Storage (Development)
- **Rationale**:
  - Scalable object storage
  - Abstracted interface for easy switching
  - Supports various file types
  - CDN integration possible

### Payments: Abstracted Payment Service Layer
- **Rationale**:
  - Easy to add/remove payment methods
  - Mock implementations for development
  - Zimbabwe-specific integrations (EcoCash, OneMoney, Omari, Bank transfers)

### AI Integration: OpenAI API (GPT-4)
- **Rationale**:
  - Powerful language model for tutoring
  - Can generate scripts for video explanations
  - Good at structured output (JSON)
  - Can be fine-tuned per subject

### Video Generation: Text-to-Speech + Canvas/WebGL Animation
- **Rationale**:
  - Generate video scripts from AI
  - Use TTS for narration
  - Canvas/WebGL for whiteboard animations
  - Modular design for future improvements

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Student    │  │  Instructor  │  │    Admin     │      │
│  │   Portal     │  │    Portal    │  │   Dashboard  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                             │
                             │ HTTP/REST API
                             │
┌───────────────────────────┼──────────────────────────────────┐
│                    Backend (Express)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │ Subscription │  │     AI       │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Payment    │  │    File      │  │   Content    │      │
│  │   Service    │  │   Storage    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┼──────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼──────┐    ┌────────▼────────┐  ┌──────▼──────┐
│  PostgreSQL  │    │   AWS S3 /      │  │   OpenAI    │
│   Database   │    │   Local Storage  │  │    API      │
└──────────────┘    └──────────────────┘  └─────────────┘
```

---

## Database Schema (ERD)

### Core Tables

#### 1. **Users**
- `id` (UUID, PK)
- `email` (String, Unique)
- `passwordHash` (String)
- `firstName` (String)
- `lastName` (String)
- `role` (Enum: STUDENT, INSTRUCTOR, ADMIN)
- `isEmailVerified` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 2. **Subscriptions**
- `id` (UUID, PK)
- `userId` (UUID, FK → Users)
- `type` (Enum: STUDENT, INSTRUCTOR)
- `status` (Enum: ACTIVE, EXPIRED, CANCELLED)
- `startDate` (DateTime)
- `endDate` (DateTime)
- `billingPeriod` (String, e.g., "monthly", "yearly")
- `amount` (Decimal)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 3. **Payments**
- `id` (UUID, PK)
- `subscriptionId` (UUID, FK → Subscriptions)
- `userId` (UUID, FK → Users)
- `amount` (Decimal)
- `currency` (String, default: "USD")
- `paymentMethod` (Enum: ECOCASH, ONEMONEY, OMARI, BANK_CARD, BANK_TRANSFER)
- `status` (Enum: PENDING, COMPLETED, FAILED, REFUNDED)
- `transactionId` (String, nullable)
- `paymentReference` (String, nullable)
- `metadata` (JSON, nullable)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 4. **Subjects**
- `id` (UUID, PK)
- `name` (String)
- `level` (Enum: ORDINARY, ADVANCED)
- `description` (Text, nullable)
- `isActive` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 5. **Syllabus**
- `id` (UUID, PK)
- `subjectId` (UUID, FK → Subjects)
- `title` (String)
- `content` (JSON) - Structured syllabus data (topics, subtopics, learning outcomes)
- `version` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 6. **AIAgentConfig**
- `id` (UUID, PK)
- `subjectId` (UUID, FK → Subjects)
- `instructorId` (UUID, FK → Users, nullable) - null for default system agents
- `systemPrompt` (Text)
- `temperature` (Float)
- `maxTokens` (Integer)
- `model` (String, default: "gpt-4")
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 7. **ChatSessions**
- `id` (UUID, PK)
- `userId` (UUID, FK → Users)
- `subjectId` (UUID, FK → Subjects)
- `agentConfigId` (UUID, FK → AIAgentConfig)
- `title` (String, nullable)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 8. **ChatMessages**
- `id` (UUID, PK)
- `sessionId` (UUID, FK → ChatSessions)
- `role` (Enum: USER, ASSISTANT)
- `content` (Text)
- `attachments` (JSON, nullable) - Array of file references
- `createdAt` (DateTime)

#### 9. **VideoSessions**
- `id` (UUID, PK)
- `userId` (UUID, FK → Users)
- `subjectId` (UUID, FK → Subjects)
- `agentConfigId` (UUID, FK → AIAgentConfig)
- `question` (Text)
- `videoUrl` (String, nullable)
- `textSummary` (Text)
- `script` (JSON, nullable) - Generated script for video
- `status` (Enum: PENDING, PROCESSING, COMPLETED, FAILED)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 10. **InstructorProfiles**
- `id` (UUID, PK)
- `userId` (UUID, FK → Users, Unique)
- `bio` (Text, nullable)
- `qualifications` (Text, nullable)
- `subjects` (JSON) - Array of subject IDs they teach
- `levels` (JSON) - Array of levels they teach
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 11. **InstructorMaterials**
- `id` (UUID, PK)
- `instructorId` (UUID, FK → Users)
- `subjectId` (UUID, FK → Subjects, nullable)
- `title` (String)
- `description` (Text, nullable)
- `fileUrl` (String)
- `fileType` (String)
- `fileSize` (Integer)
- `isActive` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 12. **LessonPlans**
- `id` (UUID, PK)
- `instructorId` (UUID, FK → Users)
- `subjectId` (UUID, FK → Subjects)
- `level` (Enum: ORDINARY, ADVANCED)
- `title` (String)
- `topic` (String)
- `date` (Date, nullable)
- `week` (Integer, nullable)
- `objectives` (JSON) - Array of learning objectives
- `resources` (JSON) - Array of resource references
- `activities` (JSON) - Array of activity descriptions
- `content` (Text) - Full lesson plan content
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 13. **SchemesOfWork**
- `id` (UUID, PK)
- `instructorId` (UUID, FK → Users)
- `subjectId` (UUID, FK → Subjects)
- `level` (Enum: ORDINARY, ADVANCED)
- `title` (String)
- `term` (String, nullable)
- `year` (Integer)
- `schedule` (JSON) - Array of weekly/topic breakdowns
- `content` (Text) - Full scheme content
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 14. **Assessments**
- `id` (UUID, PK)
- `instructorId` (UUID, FK → Users)
- `subjectId` (UUID, FK → Subjects)
- `level` (Enum: ORDINARY, ADVANCED)
- `title` (String)
- `type` (Enum: EXERCISE, QUIZ, EXAM)
- `topic` (String, nullable)
- `questions` (JSON) - Array of question objects
- `answerKey` (JSON, nullable) - Answer key
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 15. **UploadedFiles**
- `id` (UUID, PK)
- `userId` (UUID, FK → Users)
- `fileName` (String)
- `originalName` (String)
- `fileUrl` (String)
- `fileType` (String)
- `fileSize` (Integer)
- `mimeType` (String)
- `context` (String, nullable) - Where it's used (chat, lesson plan, etc.)
- `createdAt` (DateTime)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/:id` - Get user by ID (admin only)

### Subscriptions
- `GET /api/subscriptions/me` - Get current user's subscription status
- `POST /api/subscriptions/student` - Create/activate student subscription
- `POST /api/subscriptions/instructor` - Create/activate instructor subscription
- `GET /api/subscriptions/history` - Get subscription history
- `PUT /api/subscriptions/:id/cancel` - Cancel subscription

### Payments
- `POST /api/payments/initiate` - Initiate payment for subscription
- `POST /api/payments/callback/:method` - Payment callback (EcoCash, OneMoney, etc.)
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:id` - Get payment details

### Subjects & Syllabus
- `GET /api/subjects` - Get all subjects (filtered by level)
- `GET /api/subjects/:id` - Get subject details
- `GET /api/subjects/:id/syllabus` - Get subject syllabus
- `POST /api/subjects` - Create subject (admin only)
- `PUT /api/subjects/:id` - Update subject (admin only)
- `DELETE /api/subjects/:id` - Delete subject (admin only)

### AI Chat
- `POST /api/chat/sessions` - Create new chat session
- `GET /api/chat/sessions` - Get user's chat sessions
- `GET /api/chat/sessions/:id` - Get chat session with messages
- `POST /api/chat/sessions/:id/messages` - Send message in chat
- `DELETE /api/chat/sessions/:id` - Delete chat session

### AI Video
- `POST /api/video/sessions` - Create new video session
- `GET /api/video/sessions` - Get user's video sessions
- `GET /api/video/sessions/:id` - Get video session details
- `GET /api/video/sessions/:id/video` - Stream video (no download)
- `GET /api/video/sessions/:id/summary` - Get text summary

### Instructor Profile
- `GET /api/instructors/me` - Get instructor profile
- `POST /api/instructors/me` - Create instructor profile
- `PUT /api/instructors/me` - Update instructor profile

### Instructor Materials
- `GET /api/instructors/materials` - Get instructor's materials
- `POST /api/instructors/materials` - Upload material
- `GET /api/instructors/materials/:id` - Get material details
- `PUT /api/instructors/materials/:id` - Update material
- `DELETE /api/instructors/materials/:id` - Delete material

### AI Agent Configuration
- `GET /api/instructors/agents` - Get instructor's AI agent configs
- `POST /api/instructors/agents` - Create AI agent config
- `PUT /api/instructors/agents/:id` - Update AI agent config
- `DELETE /api/instructors/agents/:id` - Delete AI agent config

### Lesson Plans
- `GET /api/instructors/lesson-plans` - Get instructor's lesson plans
- `POST /api/instructors/lesson-plans` - Create lesson plan
- `GET /api/instructors/lesson-plans/:id` - Get lesson plan details
- `PUT /api/instructors/lesson-plans/:id` - Update lesson plan
- `DELETE /api/instructors/lesson-plans/:id` - Delete lesson plan
- `POST /api/instructors/lesson-plans/generate` - AI generate lesson plan

### Schemes of Work
- `GET /api/instructors/schemes` - Get instructor's schemes of work
- `POST /api/instructors/schemes` - Create scheme of work
- `GET /api/instructors/schemes/:id` - Get scheme details
- `PUT /api/instructors/schemes/:id` - Update scheme
- `DELETE /api/instructors/schemes/:id` - Delete scheme
- `POST /api/instructors/schemes/generate` - AI generate scheme of work

### Assessments
- `GET /api/instructors/assessments` - Get instructor's assessments
- `POST /api/instructors/assessments` - Create assessment
- `GET /api/instructors/assessments/:id` - Get assessment details
- `PUT /api/instructors/assessments/:id` - Update assessment
- `DELETE /api/instructors/assessments/:id` - Delete assessment
- `POST /api/instructors/assessments/generate` - AI generate assessment
- `GET /api/instructors/assessments/:id/download` - Download assessment as PDF/Word

### File Uploads
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Get file metadata
- `DELETE /api/files/:id` - Delete file

### Admin
- `GET /api/admin/users` - Get all users (paginated)
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/subscriptions` - Get all subscriptions
- `GET /api/admin/payments` - Get all payments
- `GET /api/admin/stats` - Get platform statistics

---

## Security Considerations

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control (RBAC)
3. **Payment Security**: Secure payment callbacks, transaction verification
4. **File Upload**: File type validation, size limits, virus scanning (future)
5. **Rate Limiting**: Prevent abuse of AI endpoints
6. **Data Privacy**: Encrypt sensitive data, GDPR considerations
7. **API Security**: CORS, input validation, SQL injection prevention (Prisma handles this)

---

## Deployment Considerations

1. **Environment Variables**: All secrets in `.env` files
2. **Database Migrations**: Prisma migrations for schema changes
3. **File Storage**: S3 for production, local for development
4. **Video Generation**: Queue system for async video processing
5. **Scaling**: Horizontal scaling with load balancer
6. **Monitoring**: Logging, error tracking, performance monitoring

---

## Future Enhancements

1. Real-time chat with WebSockets
2. Video streaming optimization
3. Mobile app (React Native)
4. Offline mode for downloaded content
5. Multi-language support
6. Advanced analytics for instructors
7. Student progress tracking
8. Peer-to-peer learning features

