import express, { Response } from 'express';
import { z } from 'zod';
import prisma from '../db';

const router = express.Router();

interface AuthRequest extends express.Request {
  userId?: number;
}

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'DONE']).optional(),
});

// GET /tasks - List tasks with pagination, filtering, searching
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = Math.max(1, parseInt((req.query.page as string) || '1'));
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '10')));
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const where: any = { userId };
    if (status) where.status = status;
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /tasks - Create a new task
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const body = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// GET /tasks/:id - Get a single task
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const taskId = parseInt(req.params.id);
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.userId !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// PATCH /tasks/:id - Update a task
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const taskId = parseInt(req.params.id);
    const body = updateTaskSchema.parse(req.body);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: body,
    });

    res.json(updated);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const taskId = parseInt(req.params.id);
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.userId !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({ where: { id: taskId } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// POST /tasks/:id/toggle - Toggle task status
router.post('/:id/toggle', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const taskId = parseInt(req.params.id);
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.userId !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newStatus = task.status === 'OPEN' ? 'DONE' : 'OPEN';
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

export default router;
