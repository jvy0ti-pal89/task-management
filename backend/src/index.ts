import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import tasksRoutes from './routes/tasks';
import { authenticate } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', authenticate, tasksRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Task Management Backend is running' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
