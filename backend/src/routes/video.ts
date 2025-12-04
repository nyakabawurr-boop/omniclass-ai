import express from 'express';
import { authenticate, AuthRequest, requireSubscription } from '../middleware/auth';
import { generateVideoScript } from '../services/aiService';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Create video session
router.post(
  '/sessions',
  authenticate,
  requireSubscription('STUDENT'),
  [body('subjectId').notEmpty(), body('question').notEmpty()],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { prisma } = require('../server');
      const { subjectId, question } = req.body;

      // Get default agent config
      const agentConfig = await prisma.aIAgentConfig.findFirst({
        where: {
          subjectId,
          instructorId: null
        }
      });

      if (!agentConfig) {
        return res.status(404).json({ error: 'AI agent not configured for this subject' });
      }

      const subject = await prisma.subject.findUnique({
        where: { id: subjectId }
      });

      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      // Create video session
      const videoSession = await prisma.videoSession.create({
        data: {
          userId: req.user!.id,
          subjectId,
          agentConfigId: agentConfig.id,
          question,
          status: 'PENDING',
          textSummary: ''
        }
      });

      // Generate video script asynchronously
      generateVideoScript(question, agentConfig.systemPrompt, subject.name, subject.level)
        .then(async (script) => {
          // In production, generate actual video here
          // For now, we'll just store the script
          const videoUrl = `/api/video/sessions/${videoSession.id}/video`; // Placeholder

          await prisma.videoSession.update({
            where: { id: videoSession.id },
            data: {
              script: script as any,
              textSummary: script.summary,
              videoUrl,
              status: 'COMPLETED'
            }
          });
        })
        .catch(async (error) => {
          console.error('Video generation error:', error);
          await prisma.videoSession.update({
            where: { id: videoSession.id },
            data: { status: 'FAILED' }
          });
        });

      res.status(201).json({
        ...videoSession,
        status: 'PROCESSING'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get user's video sessions
router.get('/sessions', authenticate, requireSubscription('STUDENT'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const sessions = await prisma.videoSession.findMany({
      where: { userId: req.user!.id },
      include: {
        subject: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get video session details
router.get('/sessions/:id', authenticate, requireSubscription('STUDENT'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const session = await prisma.videoSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      },
      include: {
        subject: true,
        agentConfig: true
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get video (stream, no download)
router.get('/sessions/:id/video', authenticate, requireSubscription('STUDENT'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const session = await prisma.videoSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!session || !session.videoUrl) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // In production, stream video from storage
    // For now, return placeholder
    res.json({
      message: 'Video streaming not fully implemented',
      videoUrl: session.videoUrl,
      note: 'In production, this would stream the video without allowing download'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get text summary
router.get('/sessions/:id/summary', authenticate, requireSubscription('STUDENT'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const session = await prisma.videoSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      summary: session.textSummary,
      question: session.question,
      createdAt: session.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

