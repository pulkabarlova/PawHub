import Product from '../models/Product.js';

const img = (text) => `https://placehold.co/600x400/e2e8f0/0f172a?text=${encodeURIComponent(text)}`;

/**
 * Insert seeded shop products across all categories.
 * @param {{ shelterId: any }} ctx seeded user ids
 */
export const seedProducts = (ctx) => {
  const { shelterId } = ctx;

  return Product.insertMany([
    {
      name: 'Premium Grain-Free Dog Food',
      description: 'Nutrient-rich kibble with real chicken as the first ingredient. 5 kg bag.',
      price: 39.99,
      category: 'food',
      imageUrl: img('Dog Food'),
      stock: 25,
      sellerId: shelterId,
    },
    {
      name: 'Salmon Pâté Cat Food (12-pack)',
      description: 'Grain-free wet food packed with omega-3s for a healthy coat.',
      price: 18.5,
      category: 'food',
      imageUrl: img('Cat Food'),
      stock: 40,
      sellerId: shelterId,
    },
    {
      name: 'Indestructible Chew Toy',
      description: 'Heavy-duty rubber toy built to survive even the most determined chewers.',
      price: 12.99,
      category: 'toys',
      imageUrl: img('Chew Toy'),
      stock: 60,
      sellerId: shelterId,
    },
    {
      name: 'Feather Wand Teaser',
      description: 'Interactive wand toy that keeps cats pouncing and playing for hours.',
      price: 7.25,
      category: 'toys',
      imageUrl: img('Cat Toy'),
      stock: 75,
      sellerId: shelterId,
    },
    {
      name: 'Adjustable Reflective Collar',
      description: 'Comfortable nylon collar with reflective stitching for safe night walks.',
      price: 9.99,
      category: 'accessories',
      imageUrl: img('Collar'),
      stock: 50,
      sellerId: shelterId,
    },
    {
      name: 'Cozy Orthopedic Pet Bed',
      description: 'Memory-foam base that supports joints — perfect for senior pets.',
      price: 49.0,
      category: 'accessories',
      imageUrl: img('Pet Bed'),
      stock: 15,
      sellerId: shelterId,
    },
    {
      name: 'Daily Joint Health Chews',
      description: 'Glucosamine supplement chews that support mobility and healthy joints.',
      price: 24.95,
      category: 'health',
      imageUrl: img('Joint Chews'),
      stock: 30,
      sellerId: shelterId,
    },
    {
      name: 'Gentle Oatmeal Pet Shampoo',
      description: 'Soothing, hypoallergenic shampoo for sensitive skin. 500 ml.',
      price: 11.49,
      category: 'health',
      imageUrl: img('Pet Shampoo'),
      stock: 45,
      sellerId: shelterId,
    },
  ]);
};
