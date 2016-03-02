module.exports = function(app) {

	var _ = require('highland'),
		lodash = require('lodash'),
		Util = require('../lib/Util'),
		Chargeback = app.Models.get('Chargeback'),
		mw = require('./middleware'),
		log = app.get('log');
		
	// Alert CART that the docgen was successful.
	app.get('/api/v1/docgen/:_id?', function(req, res, next) {

		req.assert('_id', 'An _id for a chargebacks is required.').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			return res.json(400, errors );
		}

		res.header('Content-Type', 'application/json');

		_( Chargeback.findById( req.params._id )
			.stream() )
		.stopOnError(next)
		.otherwise(function() {
			log.log('Chargeback does not exist.');
			return res.json(400, { '_id': 'Chargeback does not exist.' } );
		})
		.map(function(cb) {
			// Save the id for the pdf in the S3 bucket.
			cb.docgen = process.env.DOCGEN + cb._id + ".pdf";
			return cb;
		})
		.flatMap(Util.saveStream)
		.map( JSON.stringify )
		.pipe(res);

	});

	app.post('/api/v1/docgenerr/:_id?', function(req, res, next) {

		req.assert('_id', 'An _id for a chargebacks is required.').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			return res.json(400, errors );
		}

		res.header('Content-Type', 'application/json');

		_( Chargeback.findById( req.params._id )
			.stream() )
			.stopOnError(next)
			.otherwise(function() {
				log.log('Chargeback does not exist.');
				return res.json(400, { '_id': 'Chargeback does not exist.' } );
			})
			.map(function(cb) {
				// Mark the status as errored and save the error.
				cb.status = 'Errored';
				cb.errInfo = req.body.status;
				return cb;
			})
			.flatMap(Util.saveStream)
			.map( JSON.stringify )
			.pipe(res);

	});

};