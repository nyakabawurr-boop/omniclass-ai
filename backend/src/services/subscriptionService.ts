import { PrismaClient, SubscriptionType, SubscriptionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export interface CreateSubscriptionInput {
  userId: string;
  type: SubscriptionType;
  billingPeriod?: string;
}

export const createSubscription = async (input: CreateSubscriptionInput) => {
  const billingPeriod = input.billingPeriod || process.env.SUBSCRIPTION_BILLING_PERIOD || 'monthly';
  const basePrice = input.type === 'STUDENT' 
    ? parseFloat(process.env.STUDENT_SUBSCRIPTION_PRICE || '10')
    : parseFloat(process.env.INSTRUCTOR_SUBSCRIPTION_PRICE || '20');

  const startDate = new Date();
  const endDate = new Date();
  
  if (billingPeriod === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (billingPeriod === 'yearly') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // Cancel any existing active subscriptions of the same type
  await prisma.subscription.updateMany({
    where: {
      userId: input.userId,
      type: input.type,
      status: 'ACTIVE'
    },
    data: {
      status: 'CANCELLED'
    }
  });

  return prisma.subscription.create({
    data: {
      userId: input.userId,
      type: input.type,
      status: 'ACTIVE',
      startDate,
      endDate,
      billingPeriod,
      amount: new Decimal(basePrice)
    }
  });
};

export const getActiveSubscription = async (userId: string, type: SubscriptionType) => {
  return prisma.subscription.findFirst({
    where: {
      userId,
      type,
      status: 'ACTIVE',
      endDate: {
        gte: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const cancelSubscription = async (subscriptionId: string, userId: string) => {
  return prisma.subscription.updateMany({
    where: {
      id: subscriptionId,
      userId
    },
    data: {
      status: 'CANCELLED'
    }
  });
};

export const checkSubscriptionStatus = async (userId: string, type: SubscriptionType): Promise<boolean> => {
  const subscription = await getActiveSubscription(userId, type);
  return !!subscription;
};

