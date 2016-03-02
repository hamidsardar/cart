process.env.CMDLINE = true;

var _ = require('highland'),
	//prompt = Promise.promisifyAll(require('prompt')),
	//moment = require('moment'),
	app = require("../index"),
	AWS = require('aws-sdk'),
	log = app.get('log');


var Chargeback = app.Models.get('Chargeback'),
	s3 = new AWS.S3();

setTimeout(function() {
	
	var deleteObject = function(data) {
		return _(function (push, next) {
			console.log('S3 Removing: ' + data._id);
			s3.deleteObject({
				Bucket: process.env.BUCKET,
				Key: "vault/" + data._id + data.extension
			}, function(err,d) {
				push(err, data);
				push(null, _.nil);
			});
		});
	};

	var clearDeleted = function(data) {
		return _(function (push, next) {
			console.log('Removing: ' + data._id);
			Chargeback.update({'deleted_attachments._id': data._id},
				{ '$pull': { 'deleted_attachments': { '_id': data._id }}},
				function(err,d) {
					push(err, d);
					push(null, _.nil);
				}
			);
		});
	};

	_( Chargeback.find().where('deleted_attachments').exists(true).stream() )
	.map(function(data) {
		return data.deleted_attachments;
	})
	.flatten()
	.flatMap(deleteObject)
	.flatMap(clearDeleted)
	.stopOnError(function(e) {
		console.log(e);
		process.exit(1);
	})
	.apply(function(data) {
		console.log('done');
		process.exit(1);
	});

},1000);

