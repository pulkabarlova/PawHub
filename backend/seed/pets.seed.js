import Pet from '../models/Pet.js';

/**
 * Insert the seeded pets (adoptable, owned, lost). Picture paths are stored as
 * backend-relative URLs (`/pictures/...`); the frontend resolves them against
 * its configured API base, so they work regardless of host/port.
 * @param {{ shelterId: any, aliceId: any, bobId: any }} ctx seeded user ids
 */
export const seedPets = (ctx) => {
  const { shelterId, aliceId, bobId } = ctx;

  return Pet.insertMany([
    // Adoptable (owned by the shelter)
    {
      name: 'Barnaby',
      species: 'Dog',
      breed: 'Golden Mix',
      age: 3,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'Vaccinated and chipped. Found wandering near the highway. Needs a big yard!',
      pictures: ['/pictures/dog-01.jpeg'],
    },
    {
      name: 'Luna',
      species: 'Cat',
      breed: 'Calico',
      age: 7,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'Perfect health. Surrendered by an elderly owner. Very sweet lap cat.',
      pictures: ['/pictures/cat-01.jpg'],
    },
    {
      name: 'Captain',
      species: 'Bird',
      breed: 'Macaw',
      age: 12,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'Rescued from a hoarding situation. Plucked some feathers but recovering nicely.',
      pictures: ['/pictures/parrot-01.jpg'],
    },
    {
      name: 'Oliver',
      species: 'Cat',
      breed: 'Tabby',
      age: 1,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'Fully vetted.',
      pictures: ['/pictures/cat-02.jpg'],
    },
    {
      name: 'Milo',
      species: 'Cat',
      breed: 'Domestic Shorthair',
      age: 2,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'Loves to climb.',
      pictures: ['/pictures/cat-03.jpg'],
    },
    {
      name: 'Chloe',
      species: 'Cat',
      breed: 'Tuxedo',
      age: 4,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'Shy at first, very loving once she warms up.',
      pictures: ['/pictures/cat-04.jpg'],
    },
    {
      name: 'Duke',
      species: 'Dog',
      breed: 'Labrador Mix',
      age: 2,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'High energy, needs training.',
      pictures: ['/pictures/dog-03.jpg'],
    },
    {
      name: 'Daisy',
      species: 'Dog',
      breed: 'Beagle Mix',
      age: 6,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'Very food motivated.',
      pictures: ['/pictures/dog-04.jpg'],
    },
    {
      name: 'Buster',
      species: 'Dog',
      breed: 'Terrier Mix',
      age: 1,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'Puppy energy!',
      pictures: ['/pictures/dog-05.jpg'],
    },
    {
      name: 'Stella',
      species: 'Dog',
      breed: 'Pitbull Mix',
      age: 5,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'A total cuddlebug.',
      pictures: ['/pictures/dog-06.jpg'],
    },
    {
      name: 'Kiwi',
      species: 'Bird',
      breed: 'Cockatiel',
      age: 3,
      status: 'adoptable',
      ownerId: shelterId,
      healthNotes: 'Sings the Addams Family theme.',
      pictures: ['/pictures/parrot-03.jpg'],
    },

    // Lost (owned by community members)
    {
      name: 'Max',
      species: 'Dog',
      breed: 'Labrador Mix',
      age: 5,
      status: 'lost',
      ownerId: bobId,
      healthNotes: 'Has a slight limp on his back left leg.',
      pictures: ['/pictures/dog-02.jpg'],
    },
    {
      name: 'Mango',
      species: 'Bird',
      breed: 'Conure',
      age: 4,
      status: 'lost',
      ownerId: aliceId,
      healthNotes: 'Very vocal, steps up on command.',
      pictures: ['/pictures/parrot-02.jpg'],
    },
  ]);
};
