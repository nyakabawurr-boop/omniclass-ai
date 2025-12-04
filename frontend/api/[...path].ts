// Vercel serverless function proxy to backend
// This allows the frontend to proxy API requests to the backend
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
  const path = req.query.path as string[];
  const apiPath = Array.isArray(path) ? path.join('/') : path || '';

  try {
    const url = `${backendUrl}/api/${apiPath}`;
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

