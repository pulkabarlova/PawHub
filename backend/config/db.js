import mongoose from 'mongoose';
import User from '../models/User.js';
import { seedDatabase } from '../seed/index.js';

/**
 * Connect to MongoDB, then seed sample data only when the database is empty.
 *
 * Connection strategy:
 *   1. If MONGO_URI is set (Docker / a real local MongoDB) connect to it.
 *   2. Otherwise try a local MongoDB on the default port.
 *   3. As a last resort (no URI, no local server) spin up an in-memory MongoDB
 *      so the app still runs with zero setup for non-Docker development.
 *
 * Seeding is idempotent: it runs only when there are no users, so data added at
 * runtime survives restarts when backed by a persistent volume (the Docker path).
 */
export async function connectDB() {
  const explicitUri = process.env.MONGO_URI;

  if (explicitUri) {
    await mongoose.connect(explicitUri);
    console.log('Connected to MongoDB');
  } else {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/pawhub');
      console.log('Connected to local MongoDB');
    } catch {
      console.log('Local MongoDB not found. Starting in-memory MongoDB for development...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mem = await MongoMemoryServer.create();
      await mongoose.connect(mem.getUri());
      console.log('Connected to in-memory MongoDB');
    }
  }

  await seedIfEmpty();
}

async function seedIfEmpty() {
  const userCount = await User.estimatedDocumentCount();
  if (userCount === 0) {
    await seedDatabase();
  } else {
    console.log(`Database already populated (${userCount} users) — skipping seed.`);
  }
}
