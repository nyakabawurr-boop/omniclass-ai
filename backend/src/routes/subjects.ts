import express from 'express';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { UserRole, EducationLevel } from '@prisma/client';

const router = express.Router();

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const { prisma } = require('../server');
    const { level } = req.query;

    const subjects = await prisma.subject.findMany({
      where: {
        isActive: true,
        ...(level && { level: level as EducationLevel })
      },
      include: {
        syllabi: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(subjects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
  try {
    const { prisma } = require('../server');
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
      include: {
        syllabi: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        aiAgentConfigs: {
          where: { instructorId: null }, // Default system agents
          take: 1
        }
      }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get subject syllabus
router.get('/:id/syllabus', async (req, res) => {
  try {
    const { prisma } = require('../server');
    const syllabus = await prisma.syllabus.findFirst({
      where: { subjectId: req.params.id },
      orderBy: { createdAt: 'desc' }
    });

    if (!syllabus) {
      return res.status(404).json({ error: 'Syllabus not found' });
    }

    res.json(syllabus);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create subject (admin only)
router.post('/', authenticate, requireRole(UserRole.ADMIN), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { name, level, description } = req.body;

    const subject = await prisma.subject.create({
      data: {
        name,
        level: level as EducationLevel,
        description
      }
    });

    res.status(201).json(subject);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update subject (admin only)
router.put('/:id', authenticate, requireRole(UserRole.ADMIN), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { name, level, description, isActive } = req.body;

    const subject = await prisma.subject.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(level && { level: level as EducationLevel }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json(subject);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete subject (admin only)
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    await prisma.subject.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });

    res.json({ message: 'Subject deactivated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

