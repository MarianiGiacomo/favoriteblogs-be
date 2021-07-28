const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const User = require('../models/user');

describe('Test user api with an initial user in the db', () => {
  beforeAll(async () => {
    console.log('### Testing /api/users ###');
    await User.deleteMany({});

    console.log('Adding new user to db with mongoose');
    const user = new User({ username: 'admin', password: 'admin' });
    await user.save();
  });

  test('Create a new user', async () => {
    console.log('Test 1: create a new user');

    const usersAtStart = await helper.usersInDb();

    await api
      .post('/api/users')
      .send(helper.firstUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const usernames = usersAtEnd.map( u => u.username);
    expect(usernames).toContain(helper.firstUser.username);

    console.log('Test 1 done');
  });

  test('Saving a new user with an already existing username gives an error', async () => {
    console.log('Test 2: saving a new user with an already existing username gives an error');

    await api
      .post('/api/users')
      .send(helper.firstUser)
      .expect(403);

    console.log('Test 2 done');
  });

  test('Saving a user without username gives a specific error', async () => {
    console.log('Test 3: saving a user without username gives a specific error');
    const noUsernameUser = {
      username: '',
      name: 'Test User',
      password: 'testpassword',
    };

    const response = await api.post('/api/users').send(noUsernameUser);

    expect(response.text).toBe('Username can not be empty');
    expect(response.statusCode).toBe(400);

    console.log('Test 3 done');
  });

  test('Saving a user without name gives a specific error', async () => {
    console.log('Test 4: saving a user without name gives a specific error');

    const noNameUser = {
      username: 'withoutName',
      name: '',
      password: 'testpassword',
    };

    const response = await api.post('/api/users').send(noNameUser);

    expect(response.text).toBe('Name can not be empty');
    expect(response.statusCode).toBe(400);

    console.log('Test 4 done');
  });

  test('Saving a user without password gives a specific error', async () => {
    console.log('Test 5: saving a user without password gives a specific error');

    const noPasswordUser = {
      username: 'withoutPassword',
      name: 'Without Password',
      password: '',
    };

    const response = await api.post('/api/users').send(noPasswordUser);

    expect(response.text).toBe('Password minimum length = 3');
    expect(response.statusCode).toBe(400);

    console.log('Test 5 done');
  });

  test('Saving a user with password length 2 gives a specific error', async () => {
    console.log('Test 6: saving a user with password length 2 gives a specific error');

    const noPasswordUser = {
      username: 'shortPass',
      name: 'Short Password',
      password: '12',
    };

    const response = await api.post('/api/users').send(noPasswordUser);

    expect(response.text).toBe('Password minimum length = 3');
    expect(response.statusCode).toBe(400);

    console.log('Test 6 done');
  });
});

afterAll(() => {
  mongoose.connection.close();
});

