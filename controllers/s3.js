module.exports = function(app) {

	var mongoose = require('mongoose'),
		path = require('path'),
		moment = require('moment'),
		mw = require('./middleware'),
		log = app.get('log'),
		crypto = require( "crypto" ),
		AWS = require('aws-sdk'),
		S3Tracker = app.Models.get('S3Tracker');

	/*
		The s3 route creates a data object that includes a signature allowing a web client to 
		directly upload to S3. S3 will require all fields below in order to successfully upload directly.
	*/
	app.get('/api/v1/s3?', mw.auth(), function(req, res, next) {

		var expires = moment().add(10, 'minutes').toISOString();
		//log.log(expires);

		var filename = path.basename(req.query.filename),
			extension = path.extname(req.query.filename),
			id = new mongoose.Types.ObjectId,
			acl = "public-read",
			key = "vault/" + id + extension,
			policy = { "expiration": expires,	//"2020-12-01T12:00:00.000Z",
			"conditions": [
				{"bucket": process.env.BUCKET},
				["starts-with", "$key", key],
				{"acl": acl},
				["starts-with", "$Content-Type", req.query.contentType],
				["content-length-range", 0, 524288000]
			]
		};

		var policyBase64 = new Buffer( JSON.stringify(policy) ).toString('base64');
		//log.log ( policyBase64 )

		var signature = crypto.createHmac( "sha1", process.env.AWS_SECRET ).update( policyBase64 ).digest( "base64" );
		//log.log( signature);

		var c_ext = "";
		if (extension == ".pdf") {
			c_ext = ".jpg";
		}

		
		// Save to tracker so we know what to delete, or basically
		// lost file harvesting.
		var n = new S3Tracker({
			'_id': id,
			'extension': extension
		});
		n.save(function(err,data) {
			
			return res.json({
				'path': 'https://' + process.env.BUCKET + '.s3.amazonaws.com/',
				'bucket': process.env.BUCKET,
				'key': key,
				'contentType': req.query.contentType,
				'AWSAccessKeyId': process.env.AWS_KEY,
				'acl': acl,
				'policy': policyBase64,
				'signature': signature,
				'photo': {
					'_id': id,
					'extension': extension,
					'filename': filename,
					'mimetype': req.query.contentType,
					'processed': false,
					'urls': {
						'orig': process.env.CDN + "/vault/" + id + extension
					}
				}
			});

		});

	});

	app.get('/api/v1/s3-link/:_id?', mw.auth(), function(req, res, next) {

		AWS.config.update({ region: 'us-west-2' });

		//var s3 = new AWS.S3(),
		//	params = { Bucket: "cart-pdfs", Key: req.params._id + ".pdf" };

		//s3.getSignedUrl('getObject', params, function (err, url) {
		//	res.json({'url': url});
		//});

		var s3 = new AWS.S3(),
			params = { Bucket: "cart-pdfs", Prefix: req.params._id };

		s3.listObjects(params, function(err, data) {
			if( data.Contents.length === 1) {
				params = {Bucket: "cart-pdfs", Key: data.Contents[0].Key};
				s3.getSignedUrl('getObject', params, function (err, url) {
					res.json({'url': url});
				});
			}
		});



	});

};