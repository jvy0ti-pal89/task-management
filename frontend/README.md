# Task Management System (Frontend)

Complete Next.js + TypeScript frontend for Task Management.

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Features

- User authentication (Login/Register)
- Task creation, editing, deletion
- Task status toggling (OPEN ↔ DONE)
- Task listing with pagination
- Search by task title
- Filter by status
- Real-time toast notifications
- Responsive design (desktop and mobile)
- Automatic token refresh on 401 responses

## API Integration

The frontend connects to the backend API at `http://localhost:4000` (configurable via `.env.local`).
