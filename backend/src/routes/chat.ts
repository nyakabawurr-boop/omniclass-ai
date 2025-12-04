import express from 'express';
import { authenticate, AuthRequest, requireSubscription } from '../middleware/auth';
import { generateChatResponse } from '../services/aiService';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Create chat session
router.post(
  '/sessions',
  authenticate,
  requireSubscription('STUDENT'),
  [body('subjectId').notEmpty()],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { prisma } = require('../server');
      const { subjectId, title } = req.body;

      // Get default agent config for subject
      const agentConfig = await prisma.aIAgentConfig.findFirst({
        where: {
          subjectId,
          instructorId: null
        }
      });

      if (!agentConfig) {
        return res.status(404).json({ error: 'AI agent not configured for this subject' });
      }

      const session = await prisma.chatSession.create({
        data: {
          userId: req.user!.id,
          subjectId,
          agentConfigId: agentConfig.id,
          title: title || 'New Chat'
        },
        include: {
          subject: true,
          agentConfig: true
        }
      });

      res.status(201).json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get user's chat sessions
router.get('/sessions', authenticate, requireSubscription('STUDENT'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.user!.id },
      include: {
        subject: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat session with messages
router.get('/sessions/:id', authenticate, requireSubscription('STUDENT'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const session = await prisma.chatSession.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      },
      include: {
        subject: true,
        agentConfig: true,
        messages: {
          orderBy: { createdAt: 'asc' }
        }
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

// Send message in chat
router.post(
  '/sessions/:id/messages',
  authenticate,
  requireSubscription('STUDENT'),
  [body('content').notEmpty()],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { prisma } = require('../server');
      const { content, attachments } = req.body;

      // Verify session belongs to user
      const session = await prisma.chatSession.findFirst({
        where: {
          id: req.params.id,
          userId: req.user!.id
        },
        include: {
          agentConfig: true,
          subject: true,
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Save user message
      const userMessage = await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          role: 'USER',
          content,
          attachments: attachments || null
        }
      });

      // Get chat history
      const messages = session.messages.map(msg => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content
      }));

      // Generate AI response
      const aiResponse = await generateChatResponse({
        messages: [
          ...messages,
          { role: 'user', content }
        ],
        systemPrompt: session.agentConfig.systemPrompt,
        subject: session.subject.name,
        level: session.subject.level,
        temperature: session.agentConfig.temperature,
        maxTokens: session.agentConfig.maxTokens
      });

      // Save AI response
      const assistantMessage = await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          role: 'ASSISTANT',
          content: aiResponse
        }
      });

      // Update session
      await prisma.chatSession.update({
        where: { id: session.id },
        data: { updatedAt: new Date() }
      });

      res.json({
        userMessage,
        assistantMessage
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete chat session
router.delete('/sessions/:id', authenticate, requireSubscription('STUDENT'), async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    await prisma.chatSession.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    res.json({ message: 'Session deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

