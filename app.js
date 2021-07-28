const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const mongoUrl = config.MONGODB_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true });
    console.log('connected to MongoDB');
  } catch(error) {
    console.log('error connection to MongoDB:', error.message);
  }
};

connectToMongo();

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
