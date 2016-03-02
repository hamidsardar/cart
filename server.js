#!/usr/bin/env node

if (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "staging") {
	var newrelic = require('newrelic');
}

var app = require("./index"),
	log = app.get('log');

// start workers
var launcher = require('./workers/child_process_launcher');
launcher.launch(__dirname + '/node_modules/thumbd/bin/thumbd', ['server'])

// start server
var port = process.env.PORT || 5000;
app.listen(port, function() {
	log.log("Listening on " + port);
});