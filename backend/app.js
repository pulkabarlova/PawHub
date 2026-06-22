import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { getIo } from './config/socket.js';
import { notFound, errorHandler } from './middleware/error.js';

import userRoutes from './routes/users.js';
import petRoutes from './routes/pets.js';
import postRoutes from './routes/posts.js';
import eventRoutes from './routes/events.js';
import productRoutes from './routes/products.js';
import applicationRoutes from './routes/applications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Build and configure the Express application. Kept separate from server.js so
 * the app can be constructed without starting an HTTP listener (e.g. for tests).
 */
const app = express();

app.use(cors());
app.use(express.json());

// Static assets: seeded pet & post images live in <repo>/pictures.
app.use('/pictures', express.static(path.join(__dirname, '../pictures')));

// Make the live Socket.IO instance available to any handler via req.io.
app.use((req, res, next) => {
  req.io = getIo();
  next();
});

// Lightweight health check (used by Docker / smoke tests).
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// REST API
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/products', productRoutes);
app.use('/api/applications', applicationRoutes);

// 404 + centralized error handling (must be registered last).
app.use(notFound);
app.use(errorHandler);

export default app;
