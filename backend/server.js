import { createServer } from 'http';
import dotenv from 'dotenv';

import app from './app.js';
import { initSocket } from './config/socket.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const httpServer = createServer(app);
initSocket(httpServer);

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
