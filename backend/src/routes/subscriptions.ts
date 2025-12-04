import express from 'express';
import { authenticate, AuthRequest, requireSubscription } from '../middleware/auth';
import { createSubscription, getActiveSubscription, cancelSubscription, getPaymentHistory } from '../services/subscriptionService';
import { SubscriptionType } from '@prisma/client';

const router = express.Router();

// Get current user's subscription
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    
    // Admins don't need subscriptions
    if (req.user!.role === 'ADMIN') {
      return res.json({ 
        hasActiveSubscription: true,
        isAdmin: true,
        message: 'Admin access - no subscription required'
      });
    }

    const studentSub = await getActiveSubscription(req.user!.id, 'STUDENT');
    const instructorSub = await getActiveSubscription(req.user!.id, 'INSTRUCTOR');

    res.json({
      student: studentSub,
      instructor: instructorSub,
      hasStudentSubscription: !!studentSub,
      hasInstructorSubscription: !!instructorSub
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create student subscription
router.post('/student', authenticate, async (req: AuthRequest, res) => {
  try {
    // Admins bypass
    if (req.user!.role === 'ADMIN') {
      return res.json({ message: 'Admin access - subscription not required' });
    }

    const { billingPeriod } = req.body;
    const subscription = await createSubscription({
      userId: req.user!.id,
      type: 'STUDENT',
      billingPeriod
    });

    res.status(201).json(subscription);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create instructor subscription
router.post('/instructor', authenticate, async (req: AuthRequest, res) => {
  try {
    // Admins bypass
    if (req.user!.role === 'ADMIN') {
      return res.json({ message: 'Admin access - subscription not required' });
    }

    const { billingPeriod } = req.body;
    const subscription = await createSubscription({
      userId: req.user!.id,
      type: 'INSTRUCTOR',
      billingPeriod
    });

    res.status(201).json(subscription);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get subscription history
router.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(subscriptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.put('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await cancelSubscription(id, req.user!.id);
    res.json({ message: 'Subscription cancelled' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

