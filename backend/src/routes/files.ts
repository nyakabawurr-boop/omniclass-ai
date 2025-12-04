import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.STORAGE_PATH || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now
    // In production, add validation
    cb(null, true);
  }
});

// Upload file
router.post('/upload', authenticate, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { prisma } = require('../server');
    const { context } = req.body;

    const fileUrl = `/api/files/${req.file.filename}`;
    
    const uploadedFile = await prisma.uploadedFile.create({
      data: {
        userId: req.user!.id,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileUrl,
        fileType: path.extname(req.file.originalname),
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        context: context || null
      }
    });

    res.status(201).json(uploadedFile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get file metadata
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const file = await prisma.uploadedFile.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Serve file
router.get('/serve/:filename', authenticate, async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const file = await prisma.uploadedFile.findFirst({
      where: {
        fileName: req.params.filename
      }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check access (user owns file or has permission)
    if (file.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filePath = path.join(process.env.STORAGE_PATH || './uploads', file.fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
    res.sendFile(path.resolve(filePath));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { prisma } = require('../server');
    const file = await prisma.uploadedFile.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete from disk
    const filePath = path.join(process.env.STORAGE_PATH || './uploads', file.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await prisma.uploadedFile.delete({
      where: { id: file.id }
    });

    res.json({ message: 'File deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

