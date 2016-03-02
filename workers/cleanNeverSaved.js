process.env.CMDLINE = true;

var _ = require('highland'),
	//prompt = Promise.promisifyAll(require('prompt')),
	//moment = require('moment'),
	app = require("../index"),
	AWS = require('aws-sdk'),
	log = app.get('log');


var S3Tracker = app.Models.get('S3Tracker'),
	s3 = new AWS.S3();

setTimeout(function() {
	
	var deleteObject = function(data) {
		return _(function (push, next) {
			s3.deleteObject({
				Bucket: process.env.BUCKET,
				Key: "vault/" + data._id + data.extension
			}, function(err,d) {
				push(err, d);
				push(null, _.nil);
			});
		});
	};

	var removeAll = function(data) {
		return _(function (push, next) {
			S3Tracker.remove({}, function(err,d) {
				push(err, d);
				push(null, _.nil);
			});
		});
	};

	_( S3Tracker.find().stream() )
	.flatMap(deleteObject)
	.flatMap(removeAll)
	.stopOnError(function(e) {
		console.log(e);
		process.exit(1);
	})
	.apply(function(data) {
		console.log('done');
		process.exit(1);
	});

},1000);

