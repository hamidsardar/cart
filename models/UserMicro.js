module.exports = function UserMicroPlugin(schema, options) {

	var obj = {},
		path = 'user';

	if (options && options.path) {
		path = options.path;
	}

	obj[path] = {
		'_id': { type: options.objectid, ref: 'User' },
		'username': { type: String },
		'name': { type: String },
		'email': { type: String },
		'active': { type: Boolean }
	};

	schema.add(obj);

};