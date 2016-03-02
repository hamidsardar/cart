var ejs = require('ejs'),
	_ = require('highland'),
	fs = require('fs');


module.exports = function(app) {
	
	return {
		
		create: function(params) {
			// return streamable function
			return _(function (push, next) {
				
				if (!params.to) return push('no recipient specified');
				if (!params.subject) return push('no subject specified');
				if (!params.view) return push('no view specified');
				if (!params.category) return push('no category specified');
				if (!params.key) return push('no key specified');
				
				if (!params.data) {
					params.data = {};
				}
				if (!params.template) {
					params.template = "email-base";	// default
				}

				var views_path = __dirname + '/../views/',
					body = ejs.render(fs.readFileSync(views_path + "emails/" + params.view + '.ejs', 'utf8'), params.data );

				params['body'] = ejs.render(fs.readFileSync(views_path + params.template + ".ejs", 'utf8'), { body: body, subject: params.subject } );
				
				// this will be loaded based on which mail service we're using.
				var payload = false;


				var to = params.to;
				if (params.toname) {
					to = params.toname + " <" + to + ">";
				}
				
				payload = {
					"From"			: (params.fromname || process.env.MAIL_FROM_NAME) + " <" + (params.from || process.env.MAIL_FROM_EMAIL) + ">",
					"To"			: to,
					"Subject"		: params.subject,
					"Tag"			: params.category,
					"HtmlBody"		: params.body,
					"key"			: params.key
				};

				if (params.Cc) {
					payload.Cc = params.Cc;
				}

				if (params.replyTo) {
					payload.ReplyTo = params.replyTo;
				}

				if (params.attachments) {
					payload.Attachments = params.attachments;	
				}

				push(null, payload);
				push(null, _.nil);
			});

		},

		send: function(email) {
			
			// return streamable function
			return _(function (push, next) {
				var postmark = require('postmark'),
					client = new postmark.Client(email.key);
				client.sendEmail(email, function(error, success) {
					push(error, success);
					push(null, _.nil);
				});
			});

		},

		sendBatch: function(payloads, fn) {
			
			// needs refactoring to 1.0 postmark
			// var postmark = require('postmark')(process.env.POSTMARK_API_KEY);
			// postmark.batch(payloads, function(error, success) {
			// 	if (error) {
			// 		console.log(error);
			// 		return fn(error);
			// 	}
			// 	return fn(null,success);
			// });
		
		}

	};
};
