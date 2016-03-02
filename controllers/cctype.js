module.exports = function(app) {

	var mw = require('./middleware'),
		Util = require('../lib/Util'),
		log = app.get('log');
		
	app.get('/api/v1/cctype/:card?', mw.auth(), function(req, res, next) {

		req.assert('card', 'A card number is required. No dashes.').isNumeric();
		var errors = req.validationErrors();
		if (errors) {
			return res.json(400, errors );
		}

		// cache busting on static api end point
		res.header('Content-Type', 'application/json');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		return res.json({'cctype': Util.detectCardType( req.params.card + '' ) });

	});

};