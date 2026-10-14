import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

// Ensure BigInt values from PostgreSQL/Prisma can be safely serialized to JSON
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

export const createApp = () => {
  const app = express();

  // Standard middleware
  app.use(cors({
    origin: '*', // Permissive for local dev, frontend on 5173
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'SlokaSetu Backend API',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API router
  app.use('/api', routes);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
