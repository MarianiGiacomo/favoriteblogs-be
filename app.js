const express = require('express');
const compression = require('compression');
const app = express();
const helmet = require('helmet');
const hsts = require('hsts')
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const frontEndRouter = require('./controllers/frontend');
const middleware = require('./utils/middleware');
const mongoUrl = config.MONGODB_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('connected to MongoDB');
  } catch(error) {
    console.log('error connection to MongoDB:', error.message);
  }
};

connectToMongo();

app.use(compression());
app.use(helmet());
app.use(hsts({
	maxAge: 63072000,
	includeSubDomains: true,
	preload: true,
}));
app.use(helmet.contentSecurityPolicy({
	defaultSrc: 'self',
	baseUri: 'self',
	blockAllMixedContent: true,
	frameAncestor: 'self',
	imgSrc: 'self',
	objectSrc: ['self', 'data:'],
	scriptSrc: 'self'
}));
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use(middleware.checkDbConnection);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/*', frontEndRouter);
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
