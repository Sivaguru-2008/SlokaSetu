import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://agents:agents@localhost:5432/agents_runtime?schema=slokasetu',
  jwtSecret: process.env.JWT_SECRET || 'slokasetu_dev_secret_key_jwt_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  storageDir: process.env.STORAGE_DIR 
    ? path.resolve(process.env.STORAGE_DIR) 
    : path.resolve(__dirname, '../../storage/pdfs'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
