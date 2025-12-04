import { UserRole } from '@prisma/client';

const FOUNDER_EMAILS = [
  'nyakabawurr@gmail.com',
  'gzinyenya@gmail.com'
];

export const assignRole = (email: string): UserRole => {
  if (FOUNDER_EMAILS.includes(email.toLowerCase())) {
    return UserRole.ADMIN;
  }
  return UserRole.STUDENT;
};

export const isFounder = (email: string): boolean => {
  return FOUNDER_EMAILS.includes(email.toLowerCase());
};

