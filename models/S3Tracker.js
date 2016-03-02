	module.exports = function(app) {

	const MODEL = 'S3Tracker';
	if (app.Models.isLoaded(MODEL)) { return app.Models.get(MODEL); }

	var db = app.settings.db,
		$ = require('seq'),
		path = require('path'),
		Schema = db.Schema,
		ObjectId = Schema.ObjectId,
		Util = require(app.settings.root_dir + '/lib/Util'),
		_ = require('underscore');


	var S3TrackerSchema = new Schema({
		'_id': { 'type': String, 'required': true },
		'extension': { 'type': String, 'required': true },
		'createdOn': { 'type': Date, 'required': true, 'default': new Date()}
	}, { strict: true });

	db.model('S3Tracker', S3TrackerSchema);
	var S3Tracker = db.model('S3Tracker');


	S3Tracker.clear = function(obj, next) {

		if (_.isArray(obj)) {
			_.each(obj, function(o) {
				if (!o._id) {
					return next(new Error('No _id for S3Tracker.clear'));
				}
				if (!o.extension) {
					return next(new Error('No extension for S3Tracker.clear'));
				}
			});
		} else if (!obj._id) {
			return next(new Error('No _id for S3Tracker.clear'));
		} else if (!obj.extension) {
			return next(new Error('No extension for S3Tracker.clear'));
		}


		$()
		.seq(function() {
			if (_.isArray(obj)) {
				var ids = [];
				_.each(obj, function(o) {
					if (o._id) {
						ids.push(o._id);
					}
				});
				var query = S3Tracker.find();
				query.where('_id').in(ids);
				query.exec(this);
			} else {
				S3Tracker.findById( obj._id , this );
			}
		})
		.seq(function(result) {
			if (!result) {
				return this();
			}
			var items_to_remove = [];
			if (_.isArray(result)) {
				_.each(result, function(r) {
					items_to_remove.push(r._id);
				});
			} else {
				items_to_remove.push(result._id);
			}
			if (items_to_remove.length) {
				var rq = S3Tracker.find();
				rq.where('_id').in(items_to_remove);
				rq.remove(this);
			} else {
				this();
			}
		})
		.seq(function() {
			next();
		})
		.catch(next);

	};


	return S3Tracker;

};
