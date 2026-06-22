import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

import app from '../app.js';
import { seedDatabase } from '../seed/index.js';
import { DEMO_PASSWORD } from '../seed/users.seed.js';

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await seedDatabase();
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test('GET /api/health returns ok', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('seed populates all 5 entity collections', async () => {
  const [pets, posts, events, products, users] = await Promise.all([
    request(app).get('/api/pets'),
    request(app).get('/api/posts'),
    request(app).get('/api/events'),
    request(app).get('/api/products'),
    request(app).get('/api/users'),
  ]);
  assert.equal(pets.body.length, 13);
  assert.equal(posts.body.length, 6);
  assert.equal(events.body.length, 5);
  assert.equal(products.body.length, 8);
  assert.equal(users.body.length, 5);
});

test('user list never leaks password hashes', async () => {
  const res = await request(app).get('/api/users');
  assert.equal(res.status, 200);
  assert.ok(res.body.every((u) => u.passwordHash === undefined));
});

test('login with a seeded account returns a JWT', async () => {
  const res = await request(app).post('/api/users/login').send({ email: 'alice@example.com', password: DEMO_PASSWORD });
  assert.equal(res.status, 200);
  assert.ok(res.body.token);
  assert.equal(res.body.email, 'alice@example.com');
});

test('login with a wrong password is rejected', async () => {
  const res = await request(app)
    .post('/api/users/login')
    .send({ email: 'alice@example.com', password: 'wrong-password' });
  assert.equal(res.status, 400);
});

test('register creates a user and returns a JWT', async () => {
  const res = await request(app)
    .post('/api/users/register')
    .send({ name: 'Test User', email: 'newuser@example.com', password: 'secret123' });
  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.equal(res.body.email, 'newuser@example.com');
});

test('creating a pet without a token is rejected (401)', async () => {
  const res = await request(app).post('/api/pets').send({ name: 'NoAuth', species: 'Dog' });
  assert.equal(res.status, 401);
});

test('Pets support full Create / Read / Update via the API', async () => {
  const login = await request(app).post('/api/users/login').send({ email: 'bob@example.com', password: DEMO_PASSWORD });
  const token = login.body.token;

  // Create
  const created = await request(app)
    .post('/api/pets')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Rex', species: 'Dog', status: 'adoptable' });
  assert.equal(created.status, 201);
  const id = created.body._id;
  assert.ok(id);

  // Read
  const read = await request(app).get(`/api/pets/${id}`);
  assert.equal(read.status, 200);
  assert.equal(read.body.name, 'Rex');

  // Update (owner only)
  const updated = await request(app).put(`/api/pets/${id}`).set('Authorization', `Bearer ${token}`).send({ age: 4 });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.age, 4);
});

test('pet update requires authentication (401 without token)', async () => {
  const pets = await request(app).get('/api/pets');
  const res = await request(app).put(`/api/pets/${pets.body[0]._id}`).send({ age: 99 });
  assert.equal(res.status, 401);
});

test('a user cannot update a pet they do not own (403)', async () => {
  const login = await request(app)
    .post('/api/users/login')
    .send({ email: 'alice@example.com', password: DEMO_PASSWORD });
  const pets = await request(app).get('/api/pets');
  const shelterPet = pets.body.find((p) => p.status === 'adoptable'); // owned by the shelter
  const res = await request(app)
    .put(`/api/pets/${shelterPet._id}`)
    .set('Authorization', `Bearer ${login.body.token}`)
    .send({ age: 99 });
  assert.equal(res.status, 403);
});

async function tokenFor(email) {
  const res = await request(app).post('/api/users/login').send({ email, password: DEMO_PASSWORD });
  return { token: res.body.token, id: res.body._id };
}

test('apply to adopt creates an application; applying again is idempotent', async () => {
  const { token } = await tokenFor('alice@example.com');
  const pets = await request(app).get('/api/pets');
  const petId = pets.body.filter((p) => p.status === 'adoptable')[0]._id;

  const first = await request(app).post('/api/applications').set('Authorization', `Bearer ${token}`).send({ petId });
  assert.equal(first.status, 201);

  const again = await request(app).post('/api/applications').set('Authorization', `Bearer ${token}`).send({ petId });
  assert.equal(again.status, 200); // idempotent: returns the existing application
  assert.equal(again.body._id, first.body._id);

  const mine = await request(app).get('/api/applications/me').set('Authorization', `Bearer ${token}`);
  assert.ok(mine.body.some((a) => a._id === first.body._id));
});

test('applying to adopt requires authentication (401)', async () => {
  const pets = await request(app).get('/api/pets');
  const petId = pets.body.filter((p) => p.status === 'adoptable')[0]._id;
  const res = await request(app).post('/api/applications').send({ petId });
  assert.equal(res.status, 401);
});

test('an application can be withdrawn by its owner but not by another user', async () => {
  const alice = await tokenFor('alice@example.com');
  const bob = await tokenFor('bob@example.com');
  const pets = await request(app).get('/api/pets');
  const petId = pets.body.filter((p) => p.status === 'adoptable')[1]._id;

  const created = await request(app)
    .post('/api/applications')
    .set('Authorization', `Bearer ${alice.token}`)
    .send({ petId });
  assert.equal(created.status, 201);

  const forbidden = await request(app)
    .delete(`/api/applications/${created.body._id}`)
    .set('Authorization', `Bearer ${bob.token}`);
  assert.equal(forbidden.status, 403);

  const ok = await request(app)
    .delete(`/api/applications/${created.body._id}`)
    .set('Authorization', `Bearer ${alice.token}`);
  assert.equal(ok.status, 200);

  const mine = await request(app).get('/api/applications/me').set('Authorization', `Bearer ${alice.token}`);
  assert.ok(!mine.body.some((a) => a._id === created.body._id));
});

test('events all carry a title and date', async () => {
  const res = await request(app).get('/api/events');
  assert.equal(res.status, 200);
  assert.ok(res.body.length > 0);
  assert.ok(res.body.every((e) => e.title && e.date));
});

test('products can be filtered by category', async () => {
  const res = await request(app).get('/api/products?category=food');
  assert.equal(res.status, 200);
  assert.ok(res.body.length > 0);
  assert.ok(res.body.every((p) => p.category === 'food'));
});

test('unknown routes return a 404 JSON error', async () => {
  const res = await request(app).get('/api/does-not-exist');
  assert.equal(res.status, 404);
  assert.ok(res.body.error);
});

test('a registered user is persisted (can log in afterwards)', async () => {
  const reg = await request(app)
    .post('/api/users/register')
    .send({ name: 'Persist User', email: 'persist@example.com', password: 'pw12345678' });
  assert.equal(reg.status, 201);

  const login = await request(app)
    .post('/api/users/login')
    .send({ email: 'persist@example.com', password: 'pw12345678' });
  assert.equal(login.status, 200);
  assert.ok(login.body.token);
  assert.equal(login.body._id, reg.body._id);
});

test('a created post is persisted and appears in the list', async () => {
  const login = await request(app)
    .post('/api/users/login')
    .send({ email: 'sarah@example.com', password: DEMO_PASSWORD });

  const created = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${login.body.token}`)
    .send({ title: 'Persisted Post', content: 'stays in the db' });
  assert.equal(created.status, 201);

  // Fetch by id
  const byId = await request(app).get(`/api/posts/${created.body._id}`);
  assert.equal(byId.status, 200);
  assert.equal(byId.body.title, 'Persisted Post');

  // Appears in the list, attributed to the authenticated user
  const list = await request(app).get('/api/posts');
  const found = list.body.find((p) => p._id === created.body._id);
  assert.ok(found, 'created post should appear in GET /api/posts');
  // authorId is populated with the user's public fields.
  assert.equal(found.authorId._id, login.body._id);
  assert.ok(found.authorId.name, 'author name should be populated');
});
