// postInstall.js
var env = process.env.NODE_ENV,
	exec = require('child_process').exec;

if (env !== 'production' && env != "staging") {
    
    exec('./node_modules/bower/bin/bower install', function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		return process.exit(0);
	});
    
}