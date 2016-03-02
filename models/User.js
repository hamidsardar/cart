module.exports = function(app) {
	const MODEL = 'User';
	if (app.Models.isLoaded(MODEL)) { return app.Models.get(MODEL); }

	var lodash = require('lodash'),
		moment = require('moment'),
		Util = require('../lib/Util'),
		log = app.get('log'),
		db = app.settings.db,
		Schema = db.Schema,
		ObjectId = Schema.ObjectId,
		UserMicro = require('./UserMicro');


	var UserSchema = new Schema({
		'name': { type: String, required: true },
		'username': { type: String, required: true, index: true },
		'email': { type: String, index: true, sparse: true },
		'password': { type: String, set: Util.hash_password },
		'active': { type: Boolean, default: true },
		'admin': { type: Boolean, default: false },
		'license': {type: String},
		'send_to': {
			'email': { type: String },
			'fax': { type: String }
		},
		'timestamps': {
			'createdOn': { 'type': Date, 'required': true, 'default': new Date()},
			'lastLogin': { type: Date },
			'firstLogin': { type: Date },
			'forgotSent': { type: Date }
		},
		'parent':{
			'_id':      { type: ObjectId },
			'email':    { type: String },
			'username': { type: String },
			'name':     { type: String },
			'active':   { type: Boolean }
		},
		'meta': {
			'useragent': {type: String},
			'lastIp': {type: String},
			'registeredIp': {type: String}
		}
	}, {strict: true})

	.pre('save', function (next) {
		if (this.isNew) { return next(); }
		if (
			this.isModified('username') ||
			this.isModified('name') ||
			this.isModified('email') ||
			this.isModified('active')
		) {
			return this.propagateMicro(next);
		}
		next();
	})

	.plugin(UserMicro, { path: 'parent', objectid: ObjectId });


	db.model('User', UserSchema);
	var User = db.model('User');

	User.loadDependencies = function() {
		Chargeback = app.Models.get('Chargeback');
	};

	User.toMicro = function(user) {
		return {
			'_id': user._id,
			'email': user.email,
			'username': user.username,
			'name': user.name,
			'active': user.active
		};
	};

	User.prototype.propagateMicro = function propagateMicro(next) {

		var user = this,
			options = {multi:true, safe:true},
			user_obj = {
				'_id': user._id,
				'name': user.name,
				'username': user.username,
				'email': user.email,
				'active': user.active
			};

		Chargeback.update( {'user._id': user._id}, { '$set': { 'user': user_obj } }, options, function(err,data) {
			next(err,data);
		});
	
	};


	User.isChild = function(parent, child, next) {
		var query = User.find();
		query.where('_id').equals(child);
		query.where('parent._id').equals(parent);

		if (process.env.NODE_ENV == "development") {
			log.log('Child Query...');
			log.log(query._conditions);
			log.log(query.options);
		}

		query.exec(next);
	};

	return User;
};
