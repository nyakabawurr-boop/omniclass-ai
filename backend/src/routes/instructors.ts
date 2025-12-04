import express from 'express';
import { authenticate, AuthRequest, requireSubscription } from '../middleware/auth';
import { generateLessonPlan, generateSchemeOfWork, generateAssessment } from '../services/aiService';
import { body, validationResult } from 'express-validator';
import { EducationLevel, AssessmentType } from '@prisma/client';

const router = express.Router();

// Get instructor profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const profile = await prisma.instructorProfile.findUnique({
      where: { userId: req.user!.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create/update instructor profile
router.post('/me', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { bio, qualifications, subjects, levels } = req.body;

    const profile = await prisma.instructorProfile.upsert({
      where: { userId: req.user!.id },
      update: {
        bio,
        qualifications,
        subjects: subjects || [],
        levels: levels || []
      },
      create: {
        userId: req.user!.id,
        bio,
        qualifications,
        subjects: subjects || [],
        levels: levels || []
      }
    });

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get instructor materials
router.get('/materials', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const materials = await prisma.instructorMaterial.findMany({
      where: { instructorId: req.user!.id },
      include: {
        subject: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(materials);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload material (file upload handled separately, this creates the record)
router.post('/materials', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { subjectId, title, description, fileUrl, fileType, fileSize } = req.body;

    const material = await prisma.instructorMaterial.create({
      data: {
        instructorId: req.user!.id,
        subjectId: subjectId || null,
        title,
        description,
        fileUrl,
        fileType,
        fileSize: parseInt(fileSize)
      }
    });

    res.status(201).json(material);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI agent configs
router.get('/agents', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const configs = await prisma.aIAgentConfig.findMany({
      where: { instructorId: req.user!.id },
      include: {
        subject: true
      }
    });

    res.json(configs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create AI agent config
router.post('/agents', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { subjectId, systemPrompt, temperature, maxTokens, model } = req.body;

    const config = await prisma.aIAgentConfig.create({
      data: {
        subjectId,
        instructorId: req.user!.id,
        systemPrompt,
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 2000,
        model: model || 'gpt-4'
      },
      include: {
        subject: true
      }
    });

    res.status(201).json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get lesson plans
router.get('/lesson-plans', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const plans = await prisma.lessonPlan.findMany({
      where: { instructorId: req.user!.id },
      include: {
        subject: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create lesson plan
router.post('/lesson-plans', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { subjectId, level, title, topic, date, week, objectives, resources, activities, content } = req.body;

    const plan = await prisma.lessonPlan.create({
      data: {
        instructorId: req.user!.id,
        subjectId,
        level: level as EducationLevel,
        title,
        topic,
        date: date ? new Date(date) : null,
        week: week ? parseInt(week) : null,
        objectives: objectives || [],
        resources: resources || [],
        activities: activities || [],
        content
      },
      include: {
        subject: true
      }
    });

    res.status(201).json(plan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate lesson plan with AI
router.post('/lesson-plans/generate', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { subjectId, level, topic } = req.body;

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        syllabi: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const materials = await prisma.instructorMaterial.findMany({
      where: {
        instructorId: req.user!.id,
        subjectId,
        isActive: true
      }
    });

    const generated = await generateLessonPlan(
      subject.name,
      level,
      topic,
      subject.syllabi[0]?.content || {},
      materials.map(m => m.title)
    );

    res.json(generated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get schemes of work
router.get('/schemes', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const schemes = await prisma.schemeOfWork.findMany({
      where: { instructorId: req.user!.id },
      include: {
        subject: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(schemes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create scheme of work
router.post('/schemes', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { subjectId, level, title, term, year, schedule, content } = req.body;

    const scheme = await prisma.schemeOfWork.create({
      data: {
        instructorId: req.user!.id,
        subjectId,
        level: level as EducationLevel,
        title,
        term,
        year: parseInt(year),
        schedule: schedule || [],
        content
      },
      include: {
        subject: true
      }
    });

    res.status(201).json(scheme);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate scheme of work with AI
router.post('/schemes/generate', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { subjectId, level, term, year } = req.body;

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        syllabi: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const generated = await generateSchemeOfWork(
      subject.name,
      level,
      term,
      parseInt(year),
      subject.syllabi[0]?.content || {}
    );

    res.json(generated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get assessments
router.get('/assessments', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const assessments = await prisma.assessment.findMany({
      where: { instructorId: req.user!.id },
      include: {
        subject: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(assessments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create assessment
router.post('/assessments', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { subjectId, level, title, type, topic, questions, answerKey } = req.body;

    const assessment = await prisma.assessment.create({
      data: {
        instructorId: req.user!.id,
        subjectId,
        level: level as EducationLevel,
        title,
        type: type as AssessmentType,
        topic: topic || null,
        questions: questions || [],
        answerKey: answerKey || null
      },
      include: {
        subject: true
      }
    });

    res.status(201).json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate assessment with AI
router.post('/assessments/generate', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { subjectId, level, topic, type, numQuestions } = req.body;

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const generated = await generateAssessment(
      subject.name,
      level,
      topic,
      type as AssessmentType,
      numQuestions || 10
    );

    res.json(generated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Download assessment (PDF/Word)
router.get('/assessments/:id/download', authenticate, requireSubscription('INSTRUCTOR'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const { format } = req.query; // pdf or docx

    const assessment = await prisma.assessment.findFirst({
      where: {
        id: req.params.id,
        instructorId: req.user!.id
      },
      include: {
        subject: true
      }
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // In production, generate PDF/Word document
    // For now, return JSON
    res.json({
      message: 'Document generation not fully implemented',
      assessment,
      format,
      note: 'In production, this would generate and return a PDF or Word document'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

