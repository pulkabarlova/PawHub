import mongoose from 'mongoose';
import User from './models/User.js';
import Pet from './models/Pet.js';
import Post from './models/Post.js';

export const seedDatabase = async () => {
  try {
    console.log('Seeding database with authentic user stories and local images...');

    // Clear existing data
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Post.deleteMany({});

    // 1. Create Personas
    const users = await User.insertMany([
      { name: 'Happy Paws Rescue', email: 'shelter@example.com', passwordHash: 'hashedpwd123', role: 'shelter', profilePicture: 'https://api.dicebear.com/7.x/micah/svg?seed=Shelter&backgroundColor=ffdfbf' },
      { name: 'Dr. Emily Smith', email: 'smith@vetclinic.com', passwordHash: 'hashedpwd123', role: 'vet', profilePicture: 'https://api.dicebear.com/7.x/micah/svg?seed=Smith&backgroundColor=c0aede' },
      { name: 'Alice Walker', email: 'alice@example.com', passwordHash: 'hashedpwd123', role: 'owner', profilePicture: 'https://api.dicebear.com/7.x/micah/svg?seed=Alice&backgroundColor=b6e3f4' },
      { name: 'Bob Miller', email: 'bob@example.com', passwordHash: 'hashedpwd123', role: 'owner', profilePicture: 'https://api.dicebear.com/7.x/micah/svg?seed=Bob&backgroundColor=a3e635' },
      { name: 'Sarah Jenkins', email: 'sarah@example.com', passwordHash: 'hashedpwd123', role: 'owner', profilePicture: 'https://api.dicebear.com/7.x/micah/svg?seed=Sarah&backgroundColor=f472b6' }
    ]);

    const shelterId = users[0]._id;
    const vetId = users[1]._id;
    const aliceId = users[2]._id;
    const bobId = users[3]._id;
    const sarahId = users[4]._id;

    // 2. Create Pets (13 Adoptable/Owned/Lost)
    await Pet.insertMany([
      // Adoptable
      { name: 'Barnaby', species: 'Dog', breed: 'Golden Mix', age: 3, status: 'adoptable', ownerId: shelterId, healthNotes: 'Vaccinated and chipped. Found wandering near the highway. Needs a big yard!', pictures: ['http://localhost:5000/pictures/dog-01.jpeg'] },
      { name: 'Luna', species: 'Cat', breed: 'Calico', age: 7, status: 'adoptable', ownerId: shelterId, healthNotes: 'Perfect health. Surrendered by an elderly owner. Very sweet lap cat.', pictures: ['http://localhost:5000/pictures/cat-01.jpg'] },
      { name: 'Captain', species: 'Bird', breed: 'Macaw', age: 12, status: 'adoptable', ownerId: shelterId, healthNotes: 'Rescued from a hoarding situation. Plucked some feathers but recovering nicely.', pictures: ['http://localhost:5000/pictures/parrot-01.jpg'] },
      { name: 'Oliver', species: 'Cat', breed: 'Tabby', age: 1, status: 'adoptable', ownerId: shelterId, healthNotes: 'Fully vetted.', pictures: ['http://localhost:5000/pictures/cat-02.jpg'] },
      { name: 'Milo', species: 'Cat', breed: 'Domestic Shorthair', age: 2, status: 'adoptable', ownerId: shelterId, healthNotes: 'Loves to climb.', pictures: ['http://localhost:5000/pictures/cat-03.jpg'] },
      { name: 'Chloe', species: 'Cat', breed: 'Tuxedo', age: 4, status: 'adoptable', ownerId: shelterId, healthNotes: 'Shy at first, very loving once she warms up.', pictures: ['http://localhost:5000/pictures/cat-04.jpg'] },
      { name: 'Duke', species: 'Dog', breed: 'Labrador Mix', age: 2, status: 'adoptable', ownerId: shelterId, healthNotes: 'High energy, needs training.', pictures: ['http://localhost:5000/pictures/dog-03.jpg'] },
      { name: 'Daisy', species: 'Dog', breed: 'Beagle Mix', age: 6, status: 'adoptable', ownerId: shelterId, healthNotes: 'Very food motivated.', pictures: ['http://localhost:5000/pictures/dog-04.jpg'] },
      { name: 'Buster', species: 'Dog', breed: 'Terrier Mix', age: 1, status: 'adoptable', ownerId: shelterId, healthNotes: 'Puppy energy!', pictures: ['http://localhost:5000/pictures/dog-05.jpg'] },
      { name: 'Stella', species: 'Dog', breed: 'Pitbull Mix', age: 5, status: 'adoptable', ownerId: shelterId, healthNotes: 'A total cuddlebug.', pictures: ['http://localhost:5000/pictures/dog-06.jpg'] },
      { name: 'Kiwi', species: 'Bird', breed: 'Cockatiel', age: 3, status: 'adoptable', ownerId: shelterId, healthNotes: 'Sings the Addams Family theme.', pictures: ['http://localhost:5000/pictures/parrot-03.jpg'] },
      
      // Lost
      { name: 'Max', species: 'Dog', breed: 'Labrador Mix', age: 5, status: 'lost', ownerId: bobId, healthNotes: 'Has a slight limp on his back left leg.', pictures: ['http://localhost:5000/pictures/dog-02.jpg'] },
      { name: 'Mango', species: 'Bird', breed: 'Conure', age: 4, status: 'lost', ownerId: aliceId, healthNotes: 'Very vocal, steps up on command.', pictures: ['http://localhost:5000/pictures/parrot-02.jpg'] }
    ]);

    // 3. Create Community Posts (Using the 3 remaining images)
    await Post.insertMany([
      { title: 'First time outside in the harness!', content: 'We are slowly harness training so she can safely enjoy the sunshine without flying off. She was very brave today!', authorId: aliceId, imageUrl: 'http://localhost:5000/pictures/parrot-04.jpg' },
      { title: 'He loves his new mirror toy', content: 'I think he thinks it\'s another bird. He\'s been singing to it for an hour straight.', authorId: aliceId, imageUrl: 'http://localhost:5000/pictures/parrot-05.jpg' },
      { title: 'Caught mid-yawn', content: 'The timing on this photo was absolutely perfect. Looking like a fierce lion!', authorId: sarahId, imageUrl: 'http://localhost:5000/pictures/cat-05.jpg' },
      // Add a few text-only posts to pad out the forum
      { title: 'How to transition to a new dog food', content: 'It is important to mix the old and new food over a 7-day period to avoid stomach issues. Start with 75% old and 25% new.', authorId: vetId },
      { title: 'Success Story: Barnaby is doing great!', content: 'Just wanted to thank the shelter for matching us with Barnaby. He is loving his new yard!', authorId: bobId },
      { title: 'Best chew toys for heavy chewers?', content: 'My dog destroys everything. Any recommendations for indestructible toys? Kongs aren\'t surviving.', authorId: bobId }
    ]);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
