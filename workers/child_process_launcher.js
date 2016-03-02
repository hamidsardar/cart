var child_process = require('child_process'),
	_ = require('underscore');


var	log = {
	log: function(m) {
		return console.dir(m, { colors: true, depth: null });
	},
	info: function(m) {
		return console.dir(m, { colors: true, depth: null });
	},
	debug: function(m) {
		return console.dir(m, { colors: true, depth: null });
	},
	notice: function(m) {
		return console.dir(m, { colors: true, depth: null });
	},
	warning: function(m) {
		return console.dir(m, { colors: true, depth: null });
	},
	err: function(m) {
		return console.dir(m, { colors: true, depth: null });
	}
};


var Launcher = {
	launch: function(p,opts) {
		log.log(p)
		var c = child_process.fork(p,opts, { silent: true });
		c.stdout.on('data', function (data) {	
			var b = new Buffer(data);
			log.log(data.toString().trim());
		});
	}
};

module.exports = Launcher;