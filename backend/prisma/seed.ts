import { PrismaClient, EducationLevel, UserRole } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create founder/admin users
  const founder1 = await prisma.user.upsert({
    where: { email: 'nyakabawurr@gmail.com' },
    update: {},
    create: {
      email: 'nyakabawurr@gmail.com',
      passwordHash: await hashPassword('password123'), // Change in production!
      firstName: 'Raymond',
      lastName: 'Royal Nyakabawu',
      role: UserRole.ADMIN,
      isEmailVerified: true
    }
  });

  const founder2 = await prisma.user.upsert({
    where: { email: 'gzinyenya@gmail.com' },
    update: {},
    create: {
      email: 'gzinyenya@gmail.com',
      passwordHash: await hashPassword('password123'), // Change in production!
      firstName: 'Gilbert',
      lastName: 'Zinyenya',
      role: UserRole.ADMIN,
      isEmailVerified: true
    }
  });

  console.log('Created founder accounts:', { founder1: founder1.email, founder2: founder2.email });

  // Create sample subjects
  const ordinarySubjects = [
    { name: 'Mathematics', description: 'Ordinary Level Mathematics' },
    { name: 'English Language', description: 'Ordinary Level English' },
    { name: 'Science', description: 'Ordinary Level Science' },
    { name: 'History', description: 'Ordinary Level History' },
    { name: 'Geography', description: 'Ordinary Level Geography' },
    { name: 'Shona', description: 'Ordinary Level Shona' },
    { name: 'Ndebele', description: 'Ordinary Level Ndebele' },
    { name: 'Accounts', description: 'Ordinary Level Accounts' },
    { name: 'Commerce', description: 'Ordinary Level Commerce' },
    { name: 'Biology', description: 'Ordinary Level Biology' },
    { name: 'Chemistry', description: 'Ordinary Level Chemistry' },
    { name: 'Physics', description: 'Ordinary Level Physics' }
  ];

  const advancedSubjects = [
    { name: 'Mathematics', description: 'Advanced Level Mathematics' },
    { name: 'English Literature', description: 'Advanced Level English Literature' },
    { name: 'Biology', description: 'Advanced Level Biology' },
    { name: 'Chemistry', description: 'Advanced Level Chemistry' },
    { name: 'Physics', description: 'Advanced Level Physics' },
    { name: 'History', description: 'Advanced Level History' },
    { name: 'Geography', description: 'Advanced Level Geography' },
    { name: 'Accounts', description: 'Advanced Level Accounts' },
    { name: 'Economics', description: 'Advanced Level Economics' },
    { name: 'Business Studies', description: 'Advanced Level Business Studies' }
  ];

  for (const subject of ordinarySubjects) {
    const existing = await prisma.subject.findFirst({
      where: { name: subject.name, level: EducationLevel.ORDINARY }
    });
    if (!existing) {
      await prisma.subject.create({
        data: {
          name: subject.name,
          level: EducationLevel.ORDINARY,
          description: subject.description,
          isActive: true
        }
      });
    }
  }

  for (const subject of advancedSubjects) {
    const existing = await prisma.subject.findFirst({
      where: { name: subject.name, level: EducationLevel.ADVANCED }
    });
    if (!existing) {
      await prisma.subject.create({
        data: {
          name: subject.name,
          level: EducationLevel.ADVANCED,
          description: subject.description,
          isActive: true
        }
      });
    }
  }

  console.log('Created subjects');

  // Create default AI agent configs for a sample subject
  const mathSubject = await prisma.subject.findFirst({
    where: { name: 'Mathematics', level: EducationLevel.ORDINARY }
  });

  if (mathSubject) {
    const existing = await prisma.aIAgentConfig.findFirst({
      where: { subjectId: mathSubject.id, instructorId: null }
    });
    if (!existing) {
      await prisma.aIAgentConfig.create({
        data: {
          subjectId: mathSubject.id,
          instructorId: null,
          systemPrompt: `You are an expert Mathematics teacher for Ordinary Level students in Zimbabwe. 
        - Explain concepts clearly and step-by-step
        - Use examples relevant to Zimbabwean context when possible
        - Show all working clearly
        - Be patient and encouraging
        - Align explanations with Zimbabwean curriculum standards`,
          temperature: 0.7,
          maxTokens: 2000,
          model: 'gpt-4'
        }
      });
    }
  }

  console.log('Created default AI agent configs');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

