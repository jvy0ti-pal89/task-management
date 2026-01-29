# Task Management System - Track A (Full-Stack)

Complete, production-ready Task Management System with Node.js backend and Next.js frontend.

## Project Structure

```
task-management/
├── backend/          # Node.js + TypeScript + Express + Prisma
├── frontend/         # Next.js + TypeScript
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Backend runs on `http://localhost:4000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Features Implemented

### Backend (Node.js + TypeScript)

**Authentication:**
- User registration with email validation
- Login with email/password
- JWT-based authentication (access + refresh tokens)
- Secure password hashing with bcrypt
- Token refresh mechanism
- Logout with token invalidation

**Task Management:**
- Create tasks with title and optional description
- Read/list tasks with pagination (10 tasks per page by default)
- Update task title/description/status
- Delete tasks
- Toggle task status (OPEN ↔ DONE)
- Filter tasks by status
- Search tasks by title
- All tasks scoped to authenticated user

**Technical:**
- TypeScript for type safety
- Express.js server
- Prisma ORM with SQLite database
- Zod for input validation
- CORS support
- Cookie-based refresh tokens (httpOnly)
- Comprehensive error handling

### Frontend (Next.js + TypeScript)

**Authentication:**
- User registration page with validation
- User login page
- Automatic token refresh on 401 responses
- Logout functionality
- Access token stored in memory
- Refresh token in httpOnly cookies (automatic)

**Task Dashboard:**
- List tasks in responsive card grid
- Create new tasks (title + description)
- Edit existing tasks (inline)
- Delete tasks (with confirmation)
- Toggle task status
- Pagination (Prev/Next buttons)
- Search tasks by title
- Filter tasks by status (Open/Done)
- Real-time toast notifications

**Design:**
- Fully responsive (desktop, tablet, mobile)
- Modern gradient UI with smooth transitions
- Accessible form inputs
- Clear visual feedback for actions
- Loading states

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user  
- `POST /auth/refresh` - Get new access token
- `POST /auth/logout` - Logout user

### Tasks (Protected)
- `GET /tasks?page=1&limit=10&status=OPEN&search=query` - List tasks
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get single task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/toggle` - Toggle status

## Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
ACCESS_TOKEN_SECRET="your_secret"
REFRESH_TOKEN_SECRET="your_refresh_secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Testing the System

1. **Register a new account:**
   - Go to `http://localhost:3000/register`
   - Enter email and password (min 6 chars)
   - Click Register

2. **Create a task:**
   - You'll be redirected to dashboard
   - Enter task title and optional description
   - Click "Create Task"

3. **Manage tasks:**
   - Toggle status: Click ✓ button
   - Edit: Click Edit, modify, click Save
   - Delete: Click Delete (confirms before deleting)
   - Search: Type in search box
   - Filter: Select status from dropdown

4. **Pagination:**
   - Navigate between pages using Prev/Next
   - Shows current page and total pages

5. **Logout:**
   - Click "Logout" button in dashboard
   - Returns to login page

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Refresh token rotation
- ✅ httpOnly cookies for refresh tokens
- ✅ CORS protection
- ✅ User-scoped data isolation
- ✅ Input validation with Zod
- ✅ Automatic token refresh on 401
- ✅ Secure error messages

## Database Schema

**User Table:**
- id (primary key)
- email (unique)
- password (hashed)
- refreshToken (nullable)
- createdAt
- updatedAt

**Task Table:**
- id (primary key)
- title
- description (nullable)
- status (OPEN/DONE)
- userId (foreign key)
- createdAt
- updatedAt

## Notes

- Tasks are automatically cascade-deleted when user is deleted
- Search is case-insensitive
- Pagination starts from page 1
- Default page limit is 10 tasks
- Toast notifications auto-dismiss after 3 seconds
- All timestamps in UTC

## Future Enhancements

- Categories/tags for tasks
- Due dates and reminders
- Task priority levels
- Recurring tasks
- Sharing tasks with other users
- Dark mode
- Task attachments
- Advanced filtering and sorting
- Email notifications
