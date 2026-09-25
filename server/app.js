import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import apiRoutes from './routes/api.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: true, // Reflects the request origin for robust dev/prod compatibility
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Global Rate Limiting
app.use('/api', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CodeVision AI Platform',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    aiProvider: process.env.AI_PROVIDER || 'groq',
  });
});

// API Routes
app.use('/api', apiRoutes);

// Serve Frontend SPA in production if client/dist exists
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Centralized Error Handling
app.use(errorMiddleware);

export default app;
