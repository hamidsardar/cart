
var _ = require('highland'),
	fs = require('fs'),
	path = require('path'),
	bcrypt = require('bcrypt');


Util = {

	/**
	* @returns A bcrypt'ed representation of the given string
	*/
	hash_password: function(str) {
		var salt = bcrypt.genSaltSync(4),
			hash = bcrypt.hashSync(str, salt);
		return hash;
	},


	// Wraps mongo style save into stream format, would be nice to use
	// _.wrapCallback, but since data is nomrally passed through a stream already,
	// it is convoluted to wrap something and call it as the same time. Or maybe 
	// I just don't know how to do that.
	saveStream: function(data) {
		// create a new Stream
		return _(function (push, next) {
			// do something async when we read from the Stream
			data.save(function(err,d) {
				push(err, d);
				push(null, _.nil);
			});
		});
	},


	detectCardType: function(number) {
		var re = {
			//electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
			//maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
			//dankort: /^(5019)\d+$/,
			//interpayment: /^(636)\d+$/,
			//unionpay: /^(62|88)\d+$/,
			//visa: /^4\d+$/,
			//mastercard: /^5[12345]\d+$/,
			//amex: /^3[47]\d+$/,
			//diners: /^3\d+$/,
			//discover: /^6\d+$/,
			//jcb: /^(?:2131|1800|35\d{3})\d{11}$/
			// TODO: Fix this kludge I have put in at Chases request. 2015-07-31 TAJ
			visa: /^4\d+$/,
			mastercard: /^5\d+$/,
			amex: /^3\d+$/,
			discover: /^6\d+$/
		};
		//if (re.electron.test(number)) {
		//	return 'ELECTRON';
		//} else if (re.maestro.test(number)) {
		//	return 'MAESTRO';
		//} else if (re.dankort.test(number)) {
		//	return 'DANKORT';
		//} else if (re.interpayment.test(number)) {
		//	return 'INTERPAYMENT';
		//} else if (re.unionpay.test(number)) {
		//	return 'UNIONPAY';
		//} else if (re.visa.test(number)) {
		if (re.visa.test(number)) {
			return 'VISA';
		} else if (re.mastercard.test(number)) {
			return 'MASTERCARD';
		} else if (re.amex.test(number)) {
			return 'AMEX';
		//} else if (re.diners.test(number)) {
		//	return 'DINERS';
		} else if (re.discover.test(number)) {
			return 'DISCOVER';
		//} else if (re.jcb.test(number)) {
		//	return 'JCB';
		} else {
			return undefined;
		}
	},

	/**
	* @returns A boolean indicating whether or not the password is correct
	*/
	compare_password: function(str, password) {
		return bcrypt.compareSync(str, password);

	},

	
	/**
	* Returns the best guess for the client's stats
	*/
	getClientAddress: function(req) {
		var ipAddress;
		
		// Amazon EC2 / Heroku workaround to get real client IP
		var forwardedIpsStr = req.header('x-forwarded-for');
		
		if (forwardedIpsStr) {
			// 'x-forwarded-for' header may return multiple IP addresses in
			// the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
			// the first one
			var forwardedIps = forwardedIpsStr.split(',');
			ipAddress = forwardedIps[0];
		}
		
		if (!ipAddress) {
			// Ensure getting client IP address still works in
			// development environment
			ipAddress = req.connection.remoteAddress;
		}

		return ipAddress;
	},

	getClientUseragent: function(req) {
		return req.headers['user-agent'];
	}



};

module.exports = Util;

