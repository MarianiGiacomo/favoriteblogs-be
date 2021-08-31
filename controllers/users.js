const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 });
		if(!users) {
			response.statusMessage = 'No users'
			response.status(400).end()
		}
    const data = users.map(u => u.toJSON());
    response.json(data);
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;
    if(!body.name) {
      response.statusMessage = 'Name can not be empty';
      response.status(400).end();
    } else if(!body.username) {
      response.statusMessage = 'Username can not be empty';
      response.status(400).end();
    } else if(!body.password | body.password.length < 3) {
      response.statusMessage = 'Password minimum length = 3';
      response.status(400).end();
    }
    else {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(body.password, saltRounds);
      const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
      });
      const savedUser = await user.save();
      response.json(savedUser);
    }
  } catch (error) {
    if(error.errors.username.kind === 'unique') {
			console.log('Unique username error', error)
      response.statusMessage = 'Username is taken';
      response.status(403).end();
    }
    next(error);
  }
});

module.exports = usersRouter;
