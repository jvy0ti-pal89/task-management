import express, { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../db';

const router = express.Router();

interface AuthRequest extends express.Request {
  userId?: number;
}

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const generateTokens = (userId: number) => {
  const accessSecret = process.env.ACCESS_TOKEN_SECRET || 'dev_secret';
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'dev_refresh';
  const accessExpiry = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
  const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

  const accessToken = jwt.sign({ userId }, accessSecret, { expiresIn: accessExpiry });
  const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: refreshExpiry });

  return { accessToken, refreshToken };
};

// POST /auth/register
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: body.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { email: body.email, password: hashedPassword },
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ accessToken });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /auth/refresh
router.post('/refresh', async (req: AuthRequest, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }

    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'dev_refresh';
    const decoded = jwt.verify(refreshToken, refreshSecret) as { userId: number };

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessSecret = process.env.ACCESS_TOKEN_SECRET || 'dev_secret';
    const accessExpiry = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
    const newAccessToken = jwt.sign({ userId: user.id }, accessSecret, { expiresIn: accessExpiry });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: 'Refresh token expired or invalid' });
  }
});

// POST /auth/logout
router.post('/logout', async (req: AuthRequest, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'dev_refresh';
      const decoded = jwt.verify(refreshToken, refreshSecret) as { userId: number };
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { refreshToken: null },
      });
    }

    res.clearCookie('refreshToken');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
