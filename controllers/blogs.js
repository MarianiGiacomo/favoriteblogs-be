const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;
  let user = {};
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }
    user = await User.findById(decodedToken.id);
		if(!user) {
			throw new Error('user not found')
		}
  } catch (error) {
    next(error);
  }
  const blog = new Blog({ ...body, comments: [], 'user': user.id });
  if(!blog.title | !blog.url) {
    response.status(400).end('Title and URL must be given');
  }
  else if(blog.url.substring(0,7) !== 'http://' && blog.url.substring(0,8) !== 'https://'){
    response.status(400).end('Wrong URL format');
  }
  else {
    blog.likes = blog.likes? blog.likes : 0;
    try {
      const svdBlg = await blog.save();
      const popdBlg = await Blog.findOne(svdBlg).populate('user', { username: 1, name: 1 });
      user.blogs = user.blogs.concat(svdBlg._id);
      await user.save();
      response.status(201).json(popdBlg);
    } catch (error) {
      next(error);
    }
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  let user = {};
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }
    user = await User.findById(decodedToken.id);
  } catch (error) {
    next(error);
  }

  let blog = {};
  try {
    blog = await Blog.findById(request.params.id);
    user.blogs = user.blogs.forEach(b => {
      if(b.id !== blog.id){
        return b;
      }
    });
    if(blog.user.toString() === user.id.toString()) {
      await blog.delete();
      await user.save();
      response.status(204).end();
    } else {
      response.status(403).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;
  try {
    let blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 });
    blog.title = body.title;
    blog.author = body.author;
    blog.likes = body.likes;
    blog.url = body.url;
    const updateBlog = await blog.save();
    response.json(updateBlog.toJSON());
  } catch (error) {
    next(error);
  }
});

blogsRouter.get('/:id/comments', async (request, response, next) => {
  try {
    let blog = await Blog.findById(request.params.id)
      .populate({ path: 'comments', populate: { path: 'user', select: 'name' } });
    response.json(blog.comments);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/:id/comments', async (request, response, next) => {
  const body = request.body;
  let decodedToken = {};
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }
  } catch (error) {
    next(error);
  }
  const user = await User.findById(decodedToken.id);
  const comment = new Comment({ ...body, 'user': user.id });
  if(!comment.comment | !comment.blog){
    response.status(400).end();
  }
  try {
    const blog = await Blog.findById(body.blog);
    const svdComm = await comment.save();
    blog.comments = blog.comments.concat(svdComm.id);
    await blog.save();
    response.status(201).json(svdComm);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
