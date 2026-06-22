import { seedUsers } from './users.seed.js';
import { seedPets } from './pets.seed.js';
import { seedPosts } from './posts.seed.js';
import { seedEvents } from './events.seed.js';
import { seedProducts } from './products.seed.js';

/**
 * Populate the database with demo data. Users are seeded first because pets,
 * posts, events and products all reference user ids. Called from config/db.js
 * only when the database is empty (idempotent seed-on-empty).
 */
export const seedDatabase = async () => {
  console.log('🌱 Seeding database with demo data...');

  const users = await seedUsers();
  const ctx = {
    shelterId: users[0]._id,
    vetId: users[1]._id,
    aliceId: users[2]._id,
    bobId: users[3]._id,
    sarahId: users[4]._id,
  };

  await Promise.all([seedPets(ctx), seedPosts(ctx), seedEvents(ctx), seedProducts(ctx)]);

  console.log('✅ Database seeded successfully!');
};
