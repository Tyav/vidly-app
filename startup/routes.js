const express = require('express')
const genresRoute = require('../routes/genres');
const home = require('../routes/home');
const customerRouter = require('../routes/customers');
const moviesRouter = require('../routes/movies');
const rentals = require('../routes/rentals')
const users = require('../routes/user')
const auth = require('../routes/auth')
const error = require('../middleware/error')


module.exports = function(app) {
	app.use(express.json());
	app.use('/api/genres', genresRoute);
	app.use('/api/customers', customerRouter);
	app.use('/api/movies', moviesRouter);
	app.use('/api/rentals', rentals);
	app.use('/api/users', users);
	app.use('/api/auth', auth);
	app.use('/', home);

	app.use(error);
};
