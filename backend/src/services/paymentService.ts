import { PrismaClient, PaymentMethod, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export interface InitiatePaymentInput {
  userId: string;
  subscriptionId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency?: string;
}

export interface PaymentCallbackInput {
  transactionId: string;
  status: PaymentStatus;
  metadata?: any;
}

export const initiatePayment = async (input: InitiatePaymentInput) => {
  const transactionId = uuidv4();
  const paymentReference = `OMNI-${Date.now()}-${transactionId.substring(0, 8).toUpperCase()}`;

  const payment = await prisma.payment.create({
    data: {
      subscriptionId: input.subscriptionId,
      userId: input.userId,
      amount: new Decimal(input.amount),
      currency: input.currency || 'USD',
      paymentMethod: input.paymentMethod,
      status: 'PENDING',
      transactionId,
      paymentReference,
      metadata: {
        initiatedAt: new Date().toISOString(),
        ...input
      }
    }
  });

  // Here you would integrate with actual payment gateways
  // For now, we'll simulate the payment process
  return {
    payment,
    paymentUrl: await generatePaymentUrl(input.paymentMethod, transactionId, input.amount)
  };
};

const generatePaymentUrl = async (
  method: PaymentMethod,
  transactionId: string,
  amount: number
): Promise<string> => {
  // Mock payment URLs - replace with actual gateway integrations
  const baseUrl = process.env.PAYMENT_BASE_URL || 'http://localhost:3001';
  
  switch (method) {
    case 'ECOCASH':
      // Integrate with EcoCash API
      return `${baseUrl}/payments/ecocash/${transactionId}`;
    case 'ONEMONEY':
      // Integrate with OneMoney API
      return `${baseUrl}/payments/onemoney/${transactionId}`;
    case 'OMARI':
      // Integrate with Omari API
      return `${baseUrl}/payments/omari/${transactionId}`;
    case 'BANK_CARD':
      // Integrate with bank card processing
      return `${baseUrl}/payments/card/${transactionId}`;
    case 'BANK_TRANSFER':
      // Bank transfer instructions
      return `${baseUrl}/payments/transfer/${transactionId}`;
    default:
      throw new Error(`Unsupported payment method: ${method}`);
  }
};

export const handlePaymentCallback = async (input: PaymentCallbackInput) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: input.transactionId },
    include: { subscription: true }
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: input.status,
      metadata: {
        ...(payment.metadata as any),
        ...input.metadata,
        callbackAt: new Date().toISOString()
      }
    }
  });

  // If payment completed, ensure subscription is active
  if (input.status === 'COMPLETED' && payment.subscription.status !== 'ACTIVE') {
    await prisma.subscription.update({
      where: { id: payment.subscriptionId },
      data: { status: 'ACTIVE' }
    });
  }

  return updatedPayment;
};

export const getPaymentHistory = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      subscription: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

