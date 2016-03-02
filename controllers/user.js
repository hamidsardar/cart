module.exports = function(app) {

	var _ = require('highland'),
		lodash = require('lodash'),
		mw = require('./middleware'),
		Util = require('../lib/Util'),
		log = app.get('log'),
		User = app.Models.get('User');
		

	app.get('/api/v1/users', mw.auth(), function(req, res, next) {

		res.header('Content-Type', 'application/json');
		var query = {};
		
		if (req.query.query) {
			var pattern = new RegExp('.*'+req.query.query+'.*', 'i');
			query = {
				'$and': [{
					'$or': [
						{ 'name': pattern },
						{ 'username': pattern },
						{ 'email': pattern }
					]
				},{
					'$or': [
						{ '_id': req.user._id },
						{ 'parent._id': req.user._id }
					]
				}]
			};
		} else {
			query = {
				'$or': [
					{ '_id': req.user._id },
					{ 'parent._id': req.user._id }
				]
			};
		}

		_(User.find(query)
			.skip( (req.query.page ? ((+req.query.page - 1) * req.query.limit) : 0) )
			.limit( req.query.limit || 50 )
			.sort( req.query.sort || 'name' )
			.lean()
			.stream()
		)
		.stopOnError(next)
		.toArray(function(data) {
			res.header('Content-Type', 'application/json');
			res.send(data);
		});

	});

//get all users in the system
	app.get('/api/v2/users', mw.auth(), function(req, res, next) {
 		 
		res.header('Content-Type', 'application/json');
		var query = {};
		
		if (req.query.query) {
			var pattern = new RegExp('.*'+req.query.query+'.*', 'i');
			query = {
					'$or': [
						{ 'name': pattern },
						{ 'username': pattern },
						{ 'email': pattern }
					]
			}	
		}
		_(User.find(query)
			.skip( (req.query.page ? ((+req.query.page - 1) * req.query.limit) : 0) )
			// .limit( req.query.limit || 50 )
			.sort( req.query.sort || 'name' )
			.lean()
			.stream()
		)
		.stopOnError(next)
		.toArray(function(data) {
			res.header('Content-Type', 'application/json');
			res.send(data);
		});
 		 
	});

	
	app.get('/api/v1/user', mw.auth(), function(req, res, next) {

		res.header('Content-Type', 'application/json');
		_(
			User.findById(req.user._id)
				.select('-password -timestamps -meta - active')
				.lean()
				.stream({ transform: JSON.stringify })
			)
			.stopOnError(next)
			.pipe(res);
	
	});

	app.post('/api/v1/user', function(req, res, next) {
		
		req.assert('email', 'Please enter your email.').notEmpty();
		req.assert('username', 'Please enter your username.').notEmpty();
		req.assert('name', 'Please enter your name.').notEmpty();
		req.assert('password', 'Please enter a password.').notEmpty();
		
		var errors = req.validationErrors();
		if (errors) {
			return res.json(400, errors );
		}

		// clean data.
		req.sanitize(req.body.username).trim();
		req.sanitize(req.body.password).trim();
		req.sanitize(req.body.email).trim();
		req.sanitize(req.body.name).trim();


		// Look for the record for the parent name, may be '' so will return a null record.
		User.findOne()
		.where('license', req.body.parentId)
		.exec(function(err, data){
			var parent;
			// If errored call next
			if (err) { return next(err); }
			// Did a record come back?
			if(data) {
				// Now build the parent object.
				parent = {
					_id:data._id,
					username: data.username,
					name: data.name,
					email:data.email,
					active: data.active
				}
			} else if( req.body.parentName !== '') {
				// A bad parent name was sent
				log.log(req.body.parentName + " doesn't exists.");
				return res.json(400, {'parentName': "Parent company doesn't exist."});

			}
			// Now look for a record with the user name.
			User.findOne()
			.where('username', req.body.username)
			.exec(function(err,data) {
				// if error call next
				if (err) { return next(err); }
				// If data not null, the user already exists.
				if (data) {
					log.log(req.body.username + ' already exists.');
					return res.json(400, {'username': "Username already exists."});
				}
				// Now setup a new user.
				var user = new User({
					'name': req.body.name,
					'username': req.body.username,
					'email': req.body.email,
					'password': req.body.password
				});
				// Attach the parent if exists.
				if( parent !== undefined) {
					user.parent = parent;
				}
				// attach the meta data.
				var meta = {
					ip: Util.getClientAddress(req),
					useragent: Util.getClientUseragent(req)
				};

				user.timestamps.createdOn = new Date();
				user.timestamps.firstLogin = new Date();
				user.meta.lastIp = meta.ip;
				user.meta.useragent = meta.useragent;

				user.save(function(err,d) {
					if (err) { return next(err); }
					return res.json( lodash.omit(d.toJSON(), ['password', 'timestamps', 'meta', 'active', '__v']) );
				});

			});
		});
	});


	app.put('/api/v1/user', mw.auth(), function(req, res, next) {
		put(req, res, next);
	});
	app.put('/api/v1/user/:_id', mw.auth(), function(req, res, next) {
		put(req, res, next);
	});
	function put(req, res, next) {

		var password = req.body.password;
		var password2 = req.body.password2;

		if(password){
			req.assert('password', 'Please enter a valid password.').notEmpty();
		}
		
		if(password2){
			req.assert('password2', 'Passwords do not match').equals(password);
		}

		req.assert('email', 'Please enter your email.').notEmpty();
		req.assert('username', 'Please enter your username.').notEmpty();
		req.assert('name', 'Please enter your name.').notEmpty();
		
		var errors = req.validationErrors();
		if (errors) {
			return res.json(400, errors );
		}

		// clean data.
		req.sanitize(req.body.username).trim();
		req.sanitize(req.body.password).trim();
		req.sanitize(req.body.email).trim();
		req.sanitize(req.body.name).trim();
		if (req.body.send_to && req.body.send_to.email) {
			req.sanitize(req.body.send_to.email).trim();
		}
		if (req.body.send_to && req.body.send_to.fax) {
			req.sanitize(req.body.send_to.fax).trim();
		}

		
		res.header('Content-Type', 'application/json');
		_( User.findById(req.user._id)
			.stream() )
		.stopOnError(next)
		.otherwise(function() {
			log.log('cannot find user.');
			return res.json(404);
		})
		.map(function( user ) {
			user.set('username', req.body.username);
			user.set('email', req.body.email);
			user.set('name', req.body.name);
			if (req.body.send_to && req.body.send_to.email) { user.set('send_to.email', req.body.send_to.email); }
			if (req.body.send_to && req.body.send_to.email) { user.set('send_to.fax', req.body.send_to.fax); }
			if (req.body.password) {
				user.set('password', req.body.password);
			}
			return user;
		})
		.flatMap(Util.saveStream)
		.map(function(d) {
			return lodash.omit(d.toJSON(), ['password', 'admin', 'timestamps', 'meta', 'active', '__v']);
		})
		.map( JSON.stringify )
		.pipe(res);

	};


};