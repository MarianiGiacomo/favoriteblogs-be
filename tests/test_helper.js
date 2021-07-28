const User = require('../models/user');


const usersInDb = async () => {
  const users = await User.find({});
  return users.map( u => u.toJSON());
};

const sessionFirstUser = {
  'token': ''
};

const sessionSecondUser = {
  'token': ''
};

const firstUser = {
  'username': 'testUser1',
  'name': 'Test User One',
  'password': '123',
};

const secondUser = {
  'username': 'testUser2',
  'name': 'Test User Two',
  'password': '123',
};

const blogFirstUser = {
  'title': 'Blog First User',
  'author': 'whoever',
  'url': 'http://www.blog.com',
  'likes': 1
};

const blogSecondUser = {
  'title': 'Blog Second User',
  'author': 'whoever',
  'url': 'http://www.blog.com',
  'likes': 1
};

const initialBlogs = [
  blogFirstUser,
  blogSecondUser
];

const newBlog = {
  'title': 'New Blog',
  'author': 'whoever',
  'url': 'http://www.blog.com',
  'likes': 3
};

module.exports = {
  usersInDb,
  sessionFirstUser,
  sessionSecondUser,
  firstUser,
  secondUser,
  initialBlogs,
  blogFirstUser,
  blogSecondUser,
  newBlog
};