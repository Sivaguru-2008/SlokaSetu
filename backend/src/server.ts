import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🕉️  SlokaSetu Backend API running on port ${config.port}`);
  console.log(`📡  Environment: ${config.nodeEnv}`);
  console.log(`📁  PDF Storage: ${config.storageDir}`);
  console.log(`🔗  Health Check: http://localhost:${config.port}/health`);
  console.log(`=======================================================`);
});
