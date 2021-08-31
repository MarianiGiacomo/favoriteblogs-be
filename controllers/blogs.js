const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    return response.json(blogs);
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
			return respondWithError(response, 'User does not exist')
		}
  } catch (error) {
    next(error);
  }
  const blog = new Blog({ ...body, comments: [], 'user': user?.id });
  if(!blog.title | !blog.url) {
    return response.status(400).end('Title and URL must be given');
  }
  else if(blog.url.substring(0,7) !== 'http://' && blog.url.substring(0,8) !== 'https://'){
    return response.status(400).end('Wrong URL format');
  }
  else {
    blog.likes = blog.likes? blog.likes : 0;
    try {
      const svdBlg = await blog.save();
      const popdBlg = await Blog.findOne(svdBlg).populate('user', { username: 1, name: 1 });
      user.blogs = user.blogs.concat(svdBlg._id);
      await user.save();
      return response.status(201).json(popdBlg);
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
		if(!user) {
			return respondWithError(response, 'User does not exist')
		}
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
    if(blog?.user.toString() === user?.id.toString()) {
      await blog.delete();
      await user.save();
      return response.status(204).end();
    } else {
      return response.status(403).end();
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
    return response.json(updateBlog.toJSON());
  } catch (error) {
    next(error);
  }
});

blogsRouter.get('/:id/comments', async (request, response, next) => {
  try {
    let blog = await Blog.findById(request.params.id)
      .populate({ path: 'comments', populate: { path: 'user', select: 'name' } });
    return response.json(blog.comments);
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
	if (!body.comment || !body.blog || !body.timeStamp) { 
		return respondWithError(
		response, 'Comment data incomplete. Comment field, blog or timestamp missing') 
	}
  const user = await User.findById(decodedToken.id);
	if (!user) { 
		return respondWithError(response, 'User does not exist') 
	}
  const comment = new Comment({ ...body, 'user': user?.id });
  try {
    const blog = await Blog.findById(body.blog);
    const svdComm = await comment.save();
    blog.comments = blog.comments.concat(svdComm.id);
    await blog.save();
    return response.status(201).json(svdComm);
  } catch (error) {
    next(error);
  }
});

function respondWithError(response, message) {
	response.statusMessage = message;
	return response.status(400).end()
}
module.exports = blogsRouter;
