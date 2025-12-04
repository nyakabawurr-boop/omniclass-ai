import express from 'express';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(requireRole(UserRole.ADMIN));

// Get all users
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { page = 1, limit = 20, role } = req.query;

    const users = await prisma.user.findMany({
      where: role ? { role: role as UserRole } : undefined,
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({
      where: role ? { role: role as UserRole } : undefined
    });

    res.json({
      users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role
router.put('/users/:id/role', async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: role as UserRole },
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

// Get all subscriptions
router.get('/subscriptions', async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { status, type } = req.query;

    const subscriptions = await prisma.subscription.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(type && { type: type as any })
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(subscriptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all payments
router.get('/payments', async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { status, method } = req.query;

    const payments = await prisma.payment.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(method && { paymentMethod: method as any })
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        subscription: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get platform statistics
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');

    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      activeSubscriptions,
      totalPayments,
      totalRevenue,
      totalSubjects,
      totalChatSessions,
      totalVideoSessions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.payment.count({ where: { status: 'COMPLETED' } }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.subject.count({ where: { isActive: true } }),
      prisma.chatSession.count(),
      prisma.videoSession.count()
    ]);

    res.json({
      users: {
        total: totalUsers,
        students: totalStudents,
        instructors: totalInstructors,
        admins: totalUsers - totalStudents - totalInstructors
      },
      subscriptions: {
        active: activeSubscriptions
      },
      payments: {
        total: totalPayments,
        revenue: totalRevenue._sum.amount || 0
      },
      content: {
        subjects: totalSubjects,
        chatSessions: totalChatSessions,
        videoSessions: totalVideoSessions
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

