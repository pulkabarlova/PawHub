import Post from '../models/Post.js';

/**
 * Insert seeded community posts (a mix of image and text-only discussions).
 * @param {{ aliceId: any, bobId: any, sarahId: any, vetId: any }} ctx seeded user ids
 */
export const seedPosts = (ctx) => {
  const { aliceId, bobId, sarahId, vetId } = ctx;

  return Post.insertMany([
    {
      title: 'First time outside in the harness!',
      content:
        'We are slowly harness training so she can safely enjoy the sunshine without flying off. She was very brave today!',
      authorId: aliceId,
      imageUrl: '/pictures/parrot-04.jpg',
    },
    {
      title: 'He loves his new mirror toy',
      content: "I think he thinks it's another bird. He's been singing to it for an hour straight.",
      authorId: aliceId,
      imageUrl: '/pictures/parrot-05.jpg',
    },
    {
      title: 'Caught mid-yawn',
      content: 'The timing on this photo was absolutely perfect. Looking like a fierce lion!',
      authorId: sarahId,
      imageUrl: '/pictures/cat-05.jpg',
    },
    {
      title: 'How to transition to a new dog food',
      content:
        'It is important to mix the old and new food over a 7-day period to avoid stomach issues. Start with 75% old and 25% new.',
      authorId: vetId,
    },
    {
      title: 'Success Story: Barnaby is doing great!',
      content: 'Just wanted to thank the shelter for matching us with Barnaby. He is loving his new yard!',
      authorId: bobId,
    },
    {
      title: 'Best chew toys for heavy chewers?',
      content: "My dog destroys everything. Any recommendations for indestructible toys? Kongs aren't surviving.",
      authorId: bobId,
    },
  ]);
};
