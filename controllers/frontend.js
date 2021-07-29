const frontEndRouter = require('express').Router();
const path = require('path');

frontEndRouter.get('/*', (req, res, next) => {
	try {
		res.sendFile('index.html', { root: '../../dist' });
	} catch (error) {
		console.log(error)
		next(error);
	}	
})

module.exports = frontEndRouter;