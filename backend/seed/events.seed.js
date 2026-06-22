import Event from '../models/Event.js';

/**
 * Insert seeded community events (adoption days, clinics, fundraisers).
 * @param {{ shelterId: any, vetId: any }} ctx seeded user ids
 */
export const seedEvents = (ctx) => {
  const { shelterId, vetId } = ctx;

  return Event.insertMany([
    {
      title: 'Summer Adoption Day',
      description:
        'Meet dozens of adoptable cats, dogs and birds looking for their forever homes. Free treats and a vet on site!',
      date: new Date('2026-07-12T10:00:00'),
      location: 'Central Park Pavilion',
      type: 'adoption_day',
      imageUrl: '/pictures/dog-04.jpg',
      organizerId: shelterId,
    },
    {
      title: 'Low-Cost Vaccination Clinic',
      description:
        'Core vaccines and rabies shots for cats and dogs at a fraction of the usual price. Walk-ins welcome.',
      date: new Date('2026-07-26T09:00:00'),
      location: 'Happy Paws Mobile Unit, Main St.',
      type: 'vaccination_clinic',
      imageUrl: '/pictures/cat-02.jpg',
      organizerId: vetId,
    },
    {
      title: 'Paws for a Cause Fundraiser',
      description:
        'A charity gala to support medical care for rescued animals. Tickets include dinner and a silent auction.',
      date: new Date('2026-08-09T18:30:00'),
      location: 'Riverside Community Hall',
      type: 'fundraiser',
      imageUrl: '/pictures/parrot-01.jpg',
      organizerId: shelterId,
    },
    {
      title: 'Senior Pet Adoption Weekend',
      description: 'Older pets make wonderful, calm companions. Reduced adoption fees all weekend for pets aged 7+.',
      date: new Date('2026-08-23T11:00:00'),
      location: 'Happy Paws Rescue Center',
      type: 'adoption_day',
      imageUrl: '/pictures/dog-06.jpg',
      organizerId: shelterId,
    },
    {
      title: 'Microchipping & Wellness Check',
      description: 'Keep your pet safe with a quick microchip and a complimentary basic wellness check.',
      date: new Date('2026-09-06T10:00:00'),
      location: 'Smith Veterinary Clinic',
      type: 'vaccination_clinic',
      imageUrl: '/pictures/cat-04.jpg',
      organizerId: vetId,
    },
  ]);
};
