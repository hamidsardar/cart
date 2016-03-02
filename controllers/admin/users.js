module.exports = function(app) {

	var _ = require('underscore'),
		highland = require('highland'),
		mw = require('../middleware'),
		$ = require('seq'),
		Util = require('../../lib/Util'),
		log = app.get('log'),
		User = app.Models.get('User');
		

	app.get('/api/v2/admin/users', mw.auth(), function(req, res, next){

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
					]},
					{'$or':[
						{'parent._id': req.user._id},
						{ '_id': req.user._id }
					]}
				]};
		} else {
			query = {
				'$or': [
					{ '_id': req.user._id },
					{ 'parent._id': req.user._id }
				]
			};
		}

		highland(User.find(query)
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

	app.get('/api/v1/admin/users', mw.auth(), function(req, res, next) {

		var params = req.query;
		var	query = User.find();

		if (params.query) {
			var pattern = new RegExp('.*'+params.query+'.*', 'i');
			query.or([
				{ 'name': pattern },
				{ 'username': pattern },
				{ 'email': pattern }
			]);
		}

		
		query.skip( (params.page ? ((+params.page - 1) * params.limit) : 0) );
		query.limit((params.limit ? params.limit : 50));

		if (params.sort) {
			query.sort( params.sort );
		} else {
			query.sort( 'name' );
		}

		log.log('User Query...');
		log.log(query._conditions);
		log.log(query.options);

		var np = false;
		query.select('-password');
		query.exec(function(err, data) {
			if (err) { return next(err); }
			res.json(data);
		});
	
	});

	


};