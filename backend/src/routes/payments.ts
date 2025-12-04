import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { initiatePayment, handlePaymentCallback, getPaymentHistory } from '../services/paymentService';
import { PaymentMethod } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Initiate payment
router.post(
  '/initiate',
  authenticate,
  [
    body('subscriptionId').notEmpty(),
    body('paymentMethod').isIn(['ECOCASH', 'ONEMONEY', 'OMARI', 'BANK_CARD', 'BANK_TRANSFER']),
    body('amount').isFloat({ min: 0 })
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { subscriptionId, paymentMethod, amount } = req.body;

      const result = await initiatePayment({
        userId: req.user!.id,
        subscriptionId,
        paymentMethod: paymentMethod as PaymentMethod,
        amount: parseFloat(amount)
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Payment callback (for payment gateways)
router.post('/callback/:method', async (req, res) => {
  try {
    const { method } = req.params;
    const { transactionId, status, metadata } = req.body;

    // Verify callback (in production, verify signature from payment gateway)
    const payment = await handlePaymentCallback({
      transactionId,
      status: status as any,
      metadata
    });

    res.json({ success: true, payment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment history
router.get('/history', authenticate, async (req: AuthRequest, res) => {
  try {
    const payments = await getPaymentHistory(req.user!.id);
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment details
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const payment = await prisma.payment.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      },
      include: {
        subscription: true
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

