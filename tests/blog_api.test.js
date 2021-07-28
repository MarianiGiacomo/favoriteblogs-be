const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

beforeAll( async () => {
  console.log('### Testing /api/blogs ###');
  await Blog.deleteMany({});
  await User.deleteMany({});

  console.log('Creating and logging in users');
  await api.post('/api/users').send(helper.firstUser);

  await api.post('/api/users').send(helper.secondUser);

  const loginFirstUser = await api.post('/api/login').send(helper.firstUser);
  helper.sessionFirstUser.token = loginFirstUser.body.token;

  const loginSecondUser = await api.post('/api/login').send(helper.secondUser);
  helper.sessionSecondUser.token = loginSecondUser.body.token;

  console.log('Saving usesr blogs via /api/blogs');
  await api.post('/api/blogs')
    .set('authorization', `bearer ${helper.sessionFirstUser.token}`)
    .send(helper.blogFirstUser);
  await api.post('/api/blogs')
    .set('authorization', `bearer ${helper.sessionSecondUser.token}`)
    .send(helper.blogSecondUser);
});

describe('Test that blogs are returned and can be added', () => {

  test('Blogs are returned as json', async () => {
    console.log('Test 1: blogs are returned as json');

    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    console.log('done test 1');
  });

  test('All blogs are returned', async () => {
    console.log('Test 2: all blogs are returned ');

    const response = await api.get('/api/blogs');
    expect(response.body.length).toBe(helper.initialBlogs.length);

    console.log('done test 2');
  });

  test('Blogs are identified by the field id', async () => {
    console.log('Test 3: blogs are identified by the field id ');

    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined();
    });

    console.log('done test 3');
  });

  test('The added blog is returned', async () => {
    console.log('Test 4: the added blog is returned ');

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${helper.sessionFirstUser.token}`)
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map(blog => blog.title);

    expect(response.body.length).toBe(helper.initialBlogs.length + 1);
    expect(titles).toContain(helper.newBlog.title);

    console.log('done test 4');
  });
});

describe('Check back-end error handling', () => {
  test('If added blog has no like defined, BE likes 0', async () => {
    console.log('Test 5: if added blog has no like defined, BE likes 0');

    const noLikesBlog = {
      'title': 'No Likes Blog',
      'author': 'whoever',
      'url': 'http://www.blog.com',
    };

    const response = await api.post('/api/blogs')
      .send(noLikesBlog)
      .set('authorization', `bearer ${helper.sessionFirstUser.token}`);

    expect(response.body.likes).toBe(0);

    console.log('done test 5');
  });

  test('Blog with empty title can not be added', async () => {
    console.log('Test 6: Blog with empty title can not be added ');

    const emptyTitleBlog = {
      'title': '',
      'author': 'whoever',
      'url': 'http://www.blog.com',
      'likes': 3
    };

    await api.post('/api/blogs')
      .send(emptyTitleBlog)
      .set('authorization', `bearer ${helper.sessionFirstUser.token}`)
      .expect(400);

    console.log('done test 6');
  });

  test('Blog with undefined title can not be added', async () => {
    console.log('Test 7: blog with undefined title can not be added ');

    const undefinedTitleBlog = {
      'author': 'whoever',
      'url': 'http://www.blog.com',
      'likes': 3
    };

    await api.post('/api/blogs')
      .send(undefinedTitleBlog)
      .set('authorization', `bearer ${helper.sessionFirstUser.token}`)
      .expect(400);

    console.log('done test 7');
  });

  test('Blog with empty url can not be added', async () => {
    console.log('Test 8: blog with empty url can not be added ');

    const emptyUrlBlog = {
      'title': 'First Blog',
      'author': 'whoever',
      'url': '',
      'likes': 3
    };

    await api.post('/api/blogs')
      .send(emptyUrlBlog)
      .set('authorization', `bearer ${helper.sessionFirstUser.token}`)
      .expect(400);

    console.log('done test 8');
  });

  test('Blog with undefined url can not be added', async () => {
    console.log('Test 9: blog with undefined url can not be added ');

    const undefinedUrlBlog = {
      'title': 'First Blog',
      'author': 'whoever',
      'likes': 3
    };

    await api.post('/api/blogs')
      .send(undefinedUrlBlog)
      .set('authorization', `bearer ${helper.sessionFirstUser.token}`)
      .expect(400);

    console.log('done test 9');
  });
});

describe('Removing and modifying blogs', () => {
  test('Updating likes of blog', async () => {
    console.log('Test 10: updating likes of blog');

    await api.post('/api/blogs')
      .set('authorization', `bearer ${helper.sessionFirstUser.token}`)
      .send(helper.newBlog);

    const response = await api.get('/api/blogs');

    let blog = response.body[0];
    blog.likes = blog.likes +1;

    const updateBlog = await api.put(`/api/blogs/${blog.id}`)
      .send(blog)
      .expect(200);

    expect(updateBlog.body.likes).toBe(blog.likes);

    console.log('done test 10');
  });

  test('Remove an existing blog by id', async () => {
    console.log('Test 11: remove an existing blog by id ');

    await api.post('/api/blogs')
      .set('authorization', `bearer ${helper.sessionFirstUser.token}`)
      .send(helper.newBlog);

    const response = await api.get('/api/blogs');
    const deletedBlog = response.body[0];

    await api.delete(`/api/blogs/${deletedBlog.id}`)
      .set('authorization', `bearer ${helper.sessionFirstUser.token}`)
      .expect(204);

    console.log('done test 11');
  });
});

afterAll(() => {
  mongoose.connection.close();
});