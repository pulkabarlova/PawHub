import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/** Shared password for every seeded demo account (documented in README). */
export const DEMO_PASSWORD = 'password123';

const avatar = (seed, bg) => `https://api.dicebear.com/7.x/micah/svg?seed=${seed}&backgroundColor=${bg}`;

/**
 * Insert the five demo personas. Passwords are bcrypt-hashed so the seeded
 * accounts can actually log in (all use DEMO_PASSWORD).
 * @returns {Promise<import('mongoose').Document[]>} inserted users, ordered
 *   [shelter, vet, alice, bob, sarah]
 */
export const seedUsers = async () => {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  return User.insertMany([
    {
      name: 'Happy Paws Rescue',
      email: 'shelter@example.com',
      passwordHash,
      role: 'shelter',
      profilePicture: avatar('Shelter', 'ffdfbf'),
    },
    {
      name: 'Dr. Emily Smith',
      email: 'smith@vetclinic.com',
      passwordHash,
      role: 'vet',
      profilePicture: avatar('Smith', 'c0aede'),
    },
    {
      name: 'Alice Walker',
      email: 'alice@example.com',
      passwordHash,
      role: 'owner',
      profilePicture: avatar('Alice', 'b6e3f4'),
    },
    {
      name: 'Bob Miller',
      email: 'bob@example.com',
      passwordHash,
      role: 'owner',
      profilePicture: avatar('Bob', 'a3e635'),
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      passwordHash,
      role: 'owner',
      profilePicture: avatar('Sarah', 'f472b6'),
    },
  ]);
};
