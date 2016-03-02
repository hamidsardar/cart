var config = require('nconf').env().argv().file({file: __dirname + "/config.json" });

if (!process.env.NODE_ENV) {
	require('dotenv').load({path: __dirname + '/../.env-test'});
}

var app = require("../index");
app.set('config', config);


describe('Initializing Tests',function(){
	before(function (done) {
		if (app.settings.db.connection) {
			app.settings.db.connection.close();
		}
		app.settings.db.models = {};		// without this we'll get OverwriteModelError
		app.settings.db.modelSchemas = {};
		app.settings.db.connect(process.env.MONGO_URI, function(err,db) {
			if (err) { throw err; }
			var mongo = process.env.MONGO_URI.split(/@/);
			if (mongo[1]) {
				console.log('\tMONGODB CONNECTED - ' + mongo[1]);
			} else {
				console.log('\tMONGODB CONNECTED - ' + mongo);	
			}
			done();
		});
	});
	describe('Starting Tests',function(){
		require('./tests/clear')(app);
		require('./tests/login')(app);
		require('./tests/user')(app);
		require('./tests/forgot')(app);
		require('./tests/chargeback')(app);
		require('./tests/reports')(app);
		require('./tests/cardTypes')(app);
		require('./tests/s3')(app);
		require('./tests/docgen')(app);
	});
	after(function (done) {
		app.settings.db.connection.close();
		app.settings.db.models = {};		// without this we'll get OverwriteModelError
		app.settings.db.modelSchemas = {};
		done();
	});
});


