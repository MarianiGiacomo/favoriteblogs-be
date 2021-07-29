const frontEndRouter = require('express').Router();

frontEndRouter.get('/*', (req, res, next) => {
	try {
		res.sendFile(path.join(__dirname, '/dist/index.html'));
	} catch (error) {
		next(error);
	}
})

module.exports = frontEndRouter;