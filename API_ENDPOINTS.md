# OmniClass AI - API Endpoints Reference

## Base URL
```
http://localhost:3001
```

## Root Endpoint
- **GET /** - API information and available endpoints

## Available Endpoints

### Health Check
- **GET /health** - Server health status

### Authentication
- **POST /api/auth/register** - Register new user
- **POST /api/auth/login** - Login user
- **POST /api/auth/refresh** - Refresh JWT token
- **POST /api/auth/forgot-password** - Request password reset
- **POST /api/auth/reset-password** - Reset password

### Users
- **GET /api/users/me** - Get current user profile
- **PUT /api/users/me** - Update current user profile

### Subscriptions
- **GET /api/subscriptions/me** - Get current user's subscriptions
- **POST /api/subscriptions/student** - Create student subscription
- **POST /api/subscriptions/instructor** - Create instructor subscription
- **GET /api/subscriptions/history** - Get subscription history
- **PUT /api/subscriptions/:id/cancel** - Cancel subscription

### Payments
- **POST /api/payments/initiate** - Initiate payment
- **POST /api/payments/callback/:method** - Payment callback
- **GET /api/payments/history** - Get payment history
- **GET /api/payments/:id** - Get payment details

### Subjects
- **GET /api/subjects** - Get all subjects (optional ?level=ORDINARY|ADVANCED)
- **GET /api/subjects/:id** - Get subject details
- **GET /api/subjects/:id/syllabus** - Get subject syllabus
- **POST /api/subjects** - Create subject (admin only)
- **PUT /api/subjects/:id** - Update subject (admin only)
- **DELETE /api/subjects/:id** - Delete subject (admin only)

### Chat
- **POST /api/chat/sessions** - Create new chat session
- **GET /api/chat/sessions** - Get user's chat sessions
- **GET /api/chat/sessions/:id** - Get chat session with messages
- **POST /api/chat/sessions/:id/messages** - Send message in chat
- **DELETE /api/chat/sessions/:id** - Delete chat session

### Video
- **POST /api/video/sessions** - Create new video session
- **GET /api/video/sessions** - Get user's video sessions
- **GET /api/video/sessions/:id** - Get video session details
- **GET /api/video/sessions/:id/video** - Stream video (no download)
- **GET /api/video/sessions/:id/summary** - Get text summary

### Instructors
- **GET /api/instructors/me** - Get instructor profile
- **POST /api/instructors/me** - Create/update instructor profile
- **GET /api/instructors/materials** - Get instructor's materials
- **POST /api/instructors/materials** - Upload material
- **GET /api/instructors/agents** - Get AI agent configs
- **POST /api/instructors/agents** - Create AI agent config
- **GET /api/instructors/lesson-plans** - Get lesson plans
- **POST /api/instructors/lesson-plans** - Create lesson plan
- **POST /api/instructors/lesson-plans/generate** - AI generate lesson plan
- **GET /api/instructors/schemes** - Get schemes of work
- **POST /api/instructors/schemes** - Create scheme of work
- **POST /api/instructors/schemes/generate** - AI generate scheme
- **GET /api/instructors/assessments** - Get assessments
- **POST /api/instructors/assessments** - Create assessment
- **POST /api/instructors/assessments/generate** - AI generate assessment
- **GET /api/instructors/assessments/:id/download** - Download assessment

### Files
- **POST /api/files/upload** - Upload file
- **GET /api/files/:id** - Get file metadata
- **GET /api/files/serve/:filename** - Serve file
- **DELETE /api/files/:id** - Delete file

### Admin
- **GET /api/admin/users** - Get all users (paginated)
- **PUT /api/admin/users/:id/role** - Update user role
- **GET /api/admin/subscriptions** - Get all subscriptions
- **GET /api/admin/payments** - Get all payments
- **GET /api/admin/stats** - Get platform statistics

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Testing Endpoints

### Using curl:
```bash
# Health check
curl http://localhost:3001/health

# Root endpoint
curl http://localhost:3001/

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Using Browser:
- Open: http://localhost:3001/health
- Open: http://localhost:3001/

### Using Frontend:
The frontend at http://localhost:3000 automatically includes authentication tokens in API requests.

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

