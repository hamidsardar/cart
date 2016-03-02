module.exports = function(app) {

	var _ = require('highland'),
		lodash = require('lodash'),
		mw = require('./middleware'),
		moment = require('moment'),
		Util = require('../lib/Util'),
		AWS = require('aws-sdk'),
		Chargeback = app.Models.get('Chargeback'),
		User = app.Models.get('User'),
		Upload = app.Models.get('Upload'),
		log = app.get('log');
		
		

	app.post('/api/v1/submitchargeback?', mw.auth(), function(req, res, next) {

		req.assert('_id', 'An _id for a chargebacks is required.').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			return res.json(400, errors );
		}

		if (!process.env.SQS_QUEUE_DOCGEN) {
			var err = new Error('process.env.SQS_QUEUE_DOCGEN missing.');
			log.log(err);
			return next(err);
		}

		var sqs = new AWS.SQS();

		
		// wrap aws into streamable function
		function send(cb) {
			return _(function (push, next) {
				var msg_body = {
					'QueueUrl': "https://sqs." + process.env.AWS_REGION + ".amazonaws.com/" + process.env.SQS_QUEUE_DOCGEN,
					'DelaySeconds': 0,	// AWS SQS delay
					'MessageBody': JSON.stringify(cb)
				};
				sqs.sendMessage(msg_body, function(err,data) {
					push(err, cb);
					push(null, _.nil);
				});
			});
		}


		res.header('Content-Type', 'application/json');

		_( Chargeback.findById( req.body._id )
			.stream() )
		.stopOnError(next)
		.otherwise(function() {
			log.log('Chargeback does not exist.');
			return res.json(400, { '_id': 'Chargeback does not exist.' } );
		})
		.map(function(cb) {
			// add callback so docgen can notify when doc is ready or if it errored.
			// Start with local as default
			var url = "http://localhost:5000/api/v1/docgen/" + cb._id;
			var	errUrl =  "http://localhost:5000/api/v1/docgenerr/" + cb._id;
			if (process.env.NODE_ENV == "staging") {
				url = "http://cartdev.chargeback.com/api/v1/docgen/" + cb._id;
				errUrl = "http://cartdev.chargeback.com/api/v1/docgenerr/" + cb._id;
			} else if (process.env.NODE_ENV == "production") {
				url = "http://cart.chargeback.com/api/v1/docgen/" + cb._id;
				errUrl = "http://cart.chargeback.com/api/v1/docgenerr/" + cb._id;
			}
			cb.set('callback', url, { 'strict': false })
			cb.set('errcallback', errUrl, { 'strict': false });
			return cb;
		})
		.flatMap(send)
		.map(function(cb) {
			cb.status = 'Sent';
			return cb;
		 })
		.flatMap(Util.saveStream)
		.map( JSON.stringify )
		.pipe(res);


	});

};
