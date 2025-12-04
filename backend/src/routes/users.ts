import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update current user
router.put('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { firstName, lastName } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName })
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

