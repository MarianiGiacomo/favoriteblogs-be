const frontEndRouter = require('express').Router();
const path = require('path');

frontEndRouter.get('/*', (req, res, next) => {
	try {
		res.sendFile('dist/index.html', { root: require.main.path });
	} catch (error) {
		console.log(error)
		next(error);
	}	
})

module.exports = frontEndRouter;