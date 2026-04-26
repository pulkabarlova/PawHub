import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routes
import petRoutes from './routes/pets.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Static File Serving for user-provided pictures
app.use('/pictures', express.static(path.join(__dirname, '../pictures')));

// Pass io to routes by adding it to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/pets', petRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);

// Socket.IO Connection Event
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDatabase } from './seedData.js';

const PORT = process.env.PORT || 5000;
let MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pawhub';

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to local MongoDB');
  } catch (err) {
    console.log('Local MongoDB not found. Starting In-Memory MongoDB for development...');
    const mongoServer = await MongoMemoryServer.create();
    MONGO_URI = mongoServer.getUri();
    await mongoose.connect(MONGO_URI);
    console.log('Connected to In-Memory MongoDB');
    
    // Seed the database automatically when using in-memory db
    await seedDatabase();
  }

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
