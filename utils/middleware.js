
const unknownEndpoint = (request, response) => {
  if(/^(\/users.*|\/blogs.*)$/.test(request.url)){
    response.writeHead(301, { Location: '/' });
    response.end();
  }
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response) => {
  console.error(error.message);
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    });
  }
  return response.status(500).send({ error: error });
};

const tokenExtractor = (request, response, next) => {
  const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      return authorization.substring(7);
    }
  };
  const token = getTokenFrom(request);

  request.token = token;
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
};