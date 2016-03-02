module.exports = function(app) {

	var _ = require('highland'),
		lodash = require('lodash'),
		Chargeback = app.Models.get('Chargeback'),
		Upload = app.Models.get('Upload'),
		log = app.get('log');


	app.post('/api/v1/processed/chargeback/:_id?', function(req, res, next) {

		log.log(req.body);
		
		// wrap aws into streamable function
		function process(data) {
			return _(function (push, next) {
				Upload.setProcessed(data, req.body.prefix, function(err,d) {
					push(err, {'success': true});
					push(null, _.nil);
				});
			});
		}


		_(
			Chargeback
			.findById(req.params._id)
			.stream()
		)
		.stopOnError(next)
		.otherwise(function() {
			return res.send(404);
		})
		.flatMap(process)
		.map( JSON.stringify )
		.pipe(res);

	});

};