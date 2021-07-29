const frontEndRouter = require('express').Router();

frontEndRouter.get('/*', (req, res, next) => {
	console.log('FrontendRouter')	
	try {
		res.sendFile(path.join(__dirname, 'dist/index.html'));
	} catch (error) {
		console.log(error)
		next(error);
	}
})

module.exports = frontEndRouter;