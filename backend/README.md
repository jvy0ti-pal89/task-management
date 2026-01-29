# Task Management Backend

Complete Node.js + TypeScript backend for Task Management System.

## Installation

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
```

## Development

```bash
npm run dev
```

Server will run on `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Tasks (Protected - require Bearer token)
- `GET /tasks?page=1&limit=10&status=OPEN&search=title` - List tasks
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get single task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/toggle` - Toggle task status (OPEN ↔ DONE)

## Security Features

- JWT authentication with access & refresh tokens
- Password hashing with bcrypt
- httpOnly cookies for refresh tokens
- CORS protection
- Input validation with Zod
- User-scoped task data
