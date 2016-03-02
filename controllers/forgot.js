module.exports = function(app) {

	var _ = require('highland'),
		lodash = require('lodash'),
		mailer = require(app.settings.root_dir + '/lib/mailer')(app),
		User = app.Models.get('User'),
		log = app.get('log');


	app.post('/api/v1/forgot?', function(req, res, next) {

		// Validate user input
		req.assert('email', 'Please enter a valid email.').isEmail();
		var errors = req.validationErrors();
		if (errors) {
			return res.json(400, errors );
		}

		// clean data.
		req.sanitize(req.body.email).trim();
		
		var email = new RegExp('^' + req.body.email + '$', 'i');
		
		_( User.findOne()
			.where('email', email)
			.stream() )
		.map(function(dd) {
			dd.set('timestamps.forgotSent', new Date());
			return dd;
		})
		.flatMap(Util.saveStream)	// save
		.map(function(d) {
			// convert stream to email data. 
			var encoded_id = new Buffer(d._id+'++'+d.email).toString('base64'),
			link = "http://" + req.headers.host + "/reset/" + encoded_id;
			return {
				'to': d.email,
				'from': process.env.MAIL_FROM_EMAIL,
				'fromname': process.env.MAIL_FROM_NAME,
				'view': 'forgot',
				'data': {
					'user': d, 
					'link': link
				},
				'subject': "Reset Your Password",
				'category': "forgot_password_email",
				'key': process.env.POSTMARK_API_KEY
			};
		})
		.flatMap(mailer.create)	// creates payload
		.flatMap(mailer.send)	// sends payload
		.map( JSON.stringify )
		.pipe(res);

	});

};