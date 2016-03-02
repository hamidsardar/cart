module.exports = function(app) {

	var _ = require('highland'),
		jwt = require('jsonwebtoken'),
		log = app.get('log'),
		User = app.Models.get('User');

	
	app.get('/api/v1/reset/:_id?', function(req, res, next) {
		
		/* enable passing _id by route or within json */
		if (req.params._id) {
			_id = req.params._id;
		} else if (req.body._id) {
			_id = req.body._id;
		} else {
			// passing "code" triggers error handling.
			return res.json(200, {"code": tryagain});
		}

		var encoded = new Buffer(_id, 'base64').toString('ascii'),
			parts = encoded.split("++"),
			user_id = parts[0],
			email = parts[1];

		var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
		if(!checkForHexRegExp.test(user_id)) {
			return res.json(200, {"code": tryagain});
		}
		
		function check(user) {
			return _(function (push, next) {
				var pass = true,
					now = new Date();
				if (!user.timestamps.forgotSent) {
					// passing "code" triggers error handling.
					pass = false;
				} else if (now.getTime() - user.timestamps.forgotSent.getTime() > 3600000) {
					pass = false;
				}
				push(null, pass);
				push(null, _.nil);
			});
		}

		_(
			User
			.findById(user_id)
			.lean()
			.stream()
		)
		.stopOnError(next)
		.otherwise(function() {
			log.log('cannot find user.');
			return res.json(404);
		})
		.flatFilter(check)
		.otherwise(function() {
			return res.json(400, {"error": 'Forgot link expired.'});
		})
		.map(function(d) {

			var token = jwt.sign({ "_id": d._id }, process.env.TOKEN_SECRET, { expiresInMinutes: 15 });
			return {
				'reset_token': token
			};
		})
		.map( JSON.stringify )
		.pipe(res);

	});


	
	app.post('/api/v1/reset/:_id?', function(req, res, next) {

		var password1 = req.body.password1;
		var password2 = req.body.password2;
		var reset_token = req.body.reset_token;
		
		req.assert('password1', 'Please enter a valid password.').notEmpty();
		req.assert('password2', 'Please enter a valid password.').notEmpty();

		if (!password1) { return res.json(400, [{"password1": 'No new password sent.'}]); }
		if (password1 !== password2) { return res.json(400, [{"password1": 'Passwords do not match.'}]); }
		
		
		jwt.verify(reset_token, process.env.TOKEN_SECRET, function(err, decoded) {
			if (err) {
				console.log('jwt.verify error!!!');
				console.log(err);
				return res.send(401);
			}

			_(
				User
				.findById(decoded._id)
				.stream()
			)
			.stopOnError(next)
			.otherwise(function() {
				log.log('cannot find user.');
				return res.json(404);
			})
			.map(function(d) {
				d.set('password', password1);
				d.set('timestamps.forgotSent', undefined);
				return d;
			})
			.flatMap(Util.saveStream)
			.map(function(d) {
				return { 'success': true };
			})
			.map( JSON.stringify )
			.pipe(res);

			
		});

	});

};