module.exports = function(app) {

	var _ = require('highland'),
		lodash = require('lodash'),
		Util = require('../lib/Util'),
		jwt = require('jsonwebtoken'),
		mongoose = require('mongoose'),
		User = app.Models.get('User'),
		log = app.get('log'),
		mw = require('./middleware'),
		Chargeback = app.Models.get('Chargeback');

		

	// login
	app.post('/api/v1/login', function(req, res, next) {

		// Validate user input
		req.assert('username', 'Please enter username.').notEmpty();
		req.assert('password', 'Please enter a password.').notEmpty();
		
		var errors = req.validationErrors();
		if (errors) {
			return res.json(401, errors );
		}

		errors = {};
		if (!process.env.TOKEN_SECRET) {
			log.log('NO ENV TOKEN_SECRET!!');
			errors['username'] = "No token.";
			return res.json(401, errors);
		}

		// clean data.
		req.sanitize(req.body.username).trim();
		req.sanitize(req.body.password).trim();


		var query_start = new Date().getTime(),
			meta = {
				ip: Util.getClientAddress(req),
				useragent: Util.getClientUseragent(req)
			};

		var reg = new RegExp('^' + req.body.username + '$', 'i');

		function check(v) {
			return _(function (push, next) {
				push(null, Util.compare_password(req.body.password, v.password));
				push(null, _.nil);
			});
		}

		res.header('Content-Type', 'application/json');

		_(User
			.findOne()
			.where('username', reg)
			.where('active', true)
			.where('password').exists(true)
			.where('password').ne("")
			.stream()
		)
		.stopOnError(next)
		.otherwise(function() {
			log.log('user not found.');
			return res.json(401, { 'username': "Incorrect username."} );
		})
		.flatFilter(check)
		.otherwise(function() {
			log.log('invalid password');
			return res.json(401, {'password': "Incorrect password."});
		})
		.map(function(d) {
			
			// any data updates here.
			d.timestamps.lastLogin = new Date();
			d.meta.lastIp = meta.ip;
			d.meta.useragent = meta.useragent;

			if (!d.timestamps && !d.timestampsfirstLogin) {
				d.timestamps.firstLogin = new Date();
			}
			return d;
		})
		.flatMap(Util.saveStream)
		.map(function(d) {

			// We are sending the profile inside the token
			var obj = {
				"_id": d._id,
				"name": d.name,
				"username": d.username,
				"email": d.email
			};

			// store admin flag in session token
			if (req.body.admin) {
				obj.admin = true;
			}
			
			var token = jwt.sign(obj, process.env.TOKEN_SECRET, { expiresInMinutes: 20 });
			d.set('authtoken', token, { strict: false });
			return lodash.omit(d.toJSON(), ['password', 'timestamps', 'meta', 'active', '__v']);
		})
		.map( JSON.stringify )
		.pipe(res);

	});

	
	app.get('/api/v1/refresh',  mw.auth(), function(req, res, next) {

		res.header('Content-Type', 'application/json');

		_(User
			.findOne()
			.where('_id', req.user._id)
			.stream()
		)
		.stopOnError(next)
		.otherwise(function() {
			log.log('user not found.');
			return res.json(404, { '_id': "User does not exist."} );
		})
		.map(function(d) {

			// We are sending the profile inside the token
			var obj = {
				"_id": d._id,
				"name": d.name,
				"username": d.username,
				"email": d.email
			};

			// store admin flag in session token
			if (d.admin === true) {
				obj.admin = true;
			}
			
			// tokens live for 20 mintues. the angular app will check every 10
			// minutes, during activity, and refresh the tokens to keep the user
			// logged in.
			var token = jwt.sign(obj, process.env.TOKEN_SECRET, { expiresInMinutes: 20 });

			return {
				'authtoken': token
			};
		})
		.map( JSON.stringify )
		.pipe(res);

	});

};