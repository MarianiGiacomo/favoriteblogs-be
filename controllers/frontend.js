const frontEndRouter = require('express').Router();
const path = require('path');

frontEndRouter.get('/*', (req, res, next) => {
	console.log('FrontendRouter')	
	try {
		res.sendFile(path.dirname('/dist'));
	} catch (error) {
		console.log(error)
		next(error);
	}	
})

module.exports = frontEndRouter;