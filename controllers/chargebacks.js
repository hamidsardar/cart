module.exports = function(app) {

	var _ = require('highland'),
		mongoose = require('mongoose'),
		lodash = require('lodash'),
		$ = require('seq'),
		mw = require('./middleware'),
		moment = require('moment'),
		Util = require('../lib/Util'),
		csv = require('express-csv'),
		Chargeback = app.Models.get('Chargeback'),
		User = app.Models.get('User'),
		Upload = app.Models.get('Upload'),
		log = app.get('log');

	/**
	 * Saves a chargeback to a user, using the request body to create the chargeback
	 * @param {object} cb - Object with chargeback information
	 * @param {object} user - Object with user information
	 * @param {boolean} isManual - If chargeback was entered manually, set to true
	 * */
	function saveChargeback(cb, user, isManual) {

		if (!cb.portal_data) {
			cb.portal_data = {};
		}
		if (!cb.portal_data.Portal) {
			// sort of redundant, as it'll also be the parent, however import may set
			// Portal if we're importing more than one Acquirer at once?
			cb.portal_data.Portal = user.parent.name;
		}

		// Is CardNumber specified?
		if(cb.hasOwnProperty('CardNumber')) {
			// get the prefix and suffix.
			var regx = new RegExp("x",'g');
			var ccnum = cb.CardNumber.toLowerCase().replace(regx, "*");
			var ccPrefix = ccnum.slice(0,4);
			var ccSuffix = ccnum.slice(-4);
			cb.portal_data.CcPrefix = ccPrefix;
			cb.portal_data.CcSuffix = ccSuffix;
		}

		Chargeback.clearNulls(cb, 'crm_data');
		Chargeback.clearNulls(cb, 'gateway_data');
		Chargeback.clearNulls(cb, 'shipping_data');
		Chargeback.clearNulls(cb, 'portal_data');
		Chargeback.cleanDollarAmounts(cb, ["portal_data.ChargebackAmt","gateway_data.TransAmt","gateway_data.Originating.TransAmt","crm_data.PricePoint","crm_data.RefundAmount"]);

		var chargeback = new Chargeback();
		chargeback.crm_data = cb.crm_data;
		chargeback.portal_data = cb.portal_data;
		chargeback.shipping_data = cb.shipping_data;
		chargeback.gateway_data = cb.gateway_data;
		chargeback.chargebackDate = new Date(cb.chargebackDate);
		chargeback.manual = isManual;

		if ('cardSwipe' in cb) {
			chargeback.type = cb.cardSwipe.toLowerCase();
			chargeback.status = "In-Progress";
		} else {
			chargeback.status = "New";
		}

		if ('internal_type' in cb) {
			chargeback.internal_type = cb.internal_type;
		}

		if ('MidNumber' in cb) {
			chargeback.portal_data.MidNumber = cb.portal_data.MidNumber;
		}

		if ('currency' in cb) {
			chargeback.gateway_data.Currency = cb.gateway_data.Currency;
		}

		if('fullName' in cb) {
			chargeback.gateway_data.FullName = cb.fullName;
			var name_ll = cb.fullName.split(" ");
			if(name_ll.length > 2) {
				// May have middle name
				chargeback.gateway_data.FirstName = name_ll[0];
				chargeback.gateway_data.MiddleName = name_ll[1];
				chargeback.gateway_data.LastName = name_ll[name_ll.len -1];
			} else {
				chargeback.gateway_data.FirstName = name_ll[0];
				chargeback.gateway_data.LastName = name_ll[1];
			}

		}

		if (!chargeback.gateway_data.TransType) {
			chargeback.gateway_data.TransType = "Card Settle";
		}
		if (!chargeback.gateway_data.TransStatus) {
			chargeback.gateway_data.TransStatus = "Complete";
		}

		// Code for both 'sendTo' and 'send_to' existed before, so both are included here. "sendTo" may come from
		// CSV Uploads while "send_to" may come from manual entries.
		if('sendTo' in cb) {
			var sendTo_ll = cb.sendTo.split(":");
			chargeback.send_to[sendTo_ll[0]] = sendTo_ll[1];
		}

		if (cb.send_to && cb.send_to.email) {
			chargeback.set('send_to.email', cb.send_to.email);
		}
		if (cb.send_to && cb.send_to.fax) {
			chargeback.set('send_to.fax', cb.send_to.fax);
		}

		// If not a subuser, set the parent as themselves.
		if ('parent' in user && typeof user.parent.name !== "undefined") {
			chargeback.parent = User.toMicro(user.parent);
		} else {
			chargeback.parent = User.toMicro(user);
		}

		chargeback.user = User.toMicro(user);

		chargeback.save(this);

		return chargeback;

	}

	app.get('/api/v1/chargebacks?', mw.auth(), function(req, res, next) {

		// build query...
		var query = Chargeback.search(req);
		
		if (req.query.export) {
			
			var headers = [
				'MID',
				'CaseNum',
				'ChargebackDate',
				'CbAmount',
				'Currency',
				'ReasonCode',
				'ReasonText',
				'CcPrefix',
				'CcSuffix',
				'TransId',
				'TransAmt',
				'TransDate',
				'FirstName',
				'LastName',
				'BillingAddr1',
				'BillingAddr2',
				'BillingCity',
				'BillingCountry',
				'BillingPostal',
				'BillingState',
				'AVS',
				'CVV',
				'Email',
				'TrackingNumber',
				'TrackingSummary',
				'IPAddress',
				'DeliveryAddr1',
				'DeliveryAddr2',
				'DeliveryCity',
				'DeliveryCountry',
				'DeliveryPostal',
				'DeliveryState'
			];

			var testAndClean = function(data, v1, v2) {
				if (v2) {
					if (data[v1] && data[v1][v2]) {
						return data[v1][v2] + "";
					} else {
						return "";
					}
				} else {
					if (data[v1]) {
						return data[v1] + "";
					} else {
						return "";
					}
				}
			};
			
			_( Chargeback.find()
				.and(query)
				.sort('-chargebackDate')
				.lean()
				.stream() )
			.stopOnError(next)
			.map(function(dd) {
				// only pass certain values
				return [
					testAndClean(dd, 'portal_data', 'MidNumber'),
					testAndClean(dd, 'portal_data', 'CaseNumber'),
					testAndClean(dd, 'chargebackDate'),
					testAndClean(dd, 'portal_data', 'ChargebackAmt'),
					testAndClean(dd, 'portal_data', 'ReasonCode'),
					testAndClean(dd, 'portal_data', 'ReasonText'),
					testAndClean(dd, 'portal_data', 'CcPrefix'),
					testAndClean(dd, 'portal_data', 'CcSuffix'),
					testAndClean(dd, 'gateway_data', 'TransId'),
					testAndClean(dd, 'gateway_data', 'TransAmount'),
					testAndClean(dd, 'gateway_data', 'TransDate'),
					testAndClean(dd, 'gateway_data', 'Currency'),
					testAndClean(dd, 'gateway_data', 'FirstName'),
					testAndClean(dd, 'gateway_data', 'LastName'),
					testAndClean(dd, 'gateway_data', 'BillingAddr1'),
					testAndClean(dd, 'gateway_data', 'BillingAddr2'),
					testAndClean(dd, 'gateway_data', 'BillingCity'),
					testAndClean(dd, 'gateway_data', 'BillingCountry'),
					testAndClean(dd, 'gateway_data', 'BillingPostal'),
					testAndClean(dd, 'gateway_data', 'BillingState'),
					testAndClean(dd, 'gateway_data', 'AvsStatus'),
					testAndClean(dd, 'gateway_data', 'CvvStatus'),
					testAndClean(dd, 'crm_data', 'Email'),
					testAndClean(dd, 'shipping_data', 'TrackingNum'),
					testAndClean(dd, 'shipping_data', 'TrackingSum'),
					testAndClean(dd, 'crm_data', 'IpAddress'),
					testAndClean(dd, 'crm_data', 'DeliveryAddr1'),
					testAndClean(dd, 'crm_data', 'DeliveryAddr2'),
					testAndClean(dd, 'crm_data', 'DeliveryCity'),
					testAndClean(dd, 'crm_data', 'DeliveryCountry'),
					testAndClean(dd, 'crm_data', 'DeliveryPostal'),
					testAndClean(dd, 'crm_data', 'DeliveryState')
				];
			})
			.toArray(function(d) {
				res.header('content-disposition', 'attachment; filename=chargebacks.csv');
				d.unshift(headers);
				return res.csv(d);
			});
		
		} else {
			var limit = req.query.limit ? +req.query.limit : 30;
			var page = req.query.page ? +req.query.page - 1 : 0;
			_( Chargeback.find()
				.and(query)
				.skip( page * limit)
				.limit(limit)
				.sort('-chargebackDate')
				.lean()
				.stream() )
			.stopOnError(next)
			.toArray(function(data) {
				res.header('Content-Type', 'application/json');
				res.send(data);
			});

		}
		
	});

	app.get('/api/v1/chargeback/:_id', mw.auth(), function(req, res, next) {

		res.header('Content-Type', 'application/json');
		var query = {
			'_id': req.params._id,
			'$or': [
				{ 'user._id': req.user._id },
				{ 'parent._id': req.user._id }
			]};
		_(Chargeback.findOne(query).lean().stream({ transform: JSON.stringify }))
			.stopOnError(next)
			.pipe(res);

	});

	// Used for CSV Uploads
	app.post('/api/v1/chargebacks', mw.auth(), function(req, res, next) {

		req.assert('chargebacks', 'An array of chargebacks is required.').notEmpty();
		req.assert('user', 'A user object is required.').notEmpty();
			
		var errors = req.validationErrors();
		if (errors) {
			return res.json(400, errors );
		}

		if (!req.body.chargebacks.length) {
			return res.json(401, { 'chargebacks': 'An array of chargebacks is required.'});
		}

		// Deprecated by ZAD; 2015-09-01; Children are no longer created this way
		// --The code is needed to pass old tests, but should eventually be removed
		var cc = false;
		if (req.body.createChildren) {
			cc = req.body.createChildren;
		}
		if (cc && (!req.body.chargebacks[0].portal_data || !req.body.chargebacks[0].portal_data.MidNumber)) {
			return res.json(401, { 'createChildren': 'portal_data.MidNumber is required to createChildren accounts'});
		}


		$()
		.par('user', function() {
			User.findById( req.body.user._id , this);
		})
		// Deprecated by ZAD; 2015-08-31; This variable appears to be unused
		// --The code is needed to pass old tests, but should eventually be removed
		.par('users', function() {
			var top = this;
			var id = new mongoose.Types.ObjectId(req.body.user._id);

			User.find({ 'parent._id': id }, function(err, data) {
				if (err) { return top(err); }
				var keyed_users = {};
				//_.each(data, function(d, a) {
				lodash.each(data, function(d) {
					keyed_users[ d.username ] = d;
				});
				top(null, keyed_users);
			});
		})
		.seq(function() {
			this(null, req.body.chargebacks);
		})
		.flatten()
		// Deprecated by ZAD; 2015-08-31; Children are no longer created this way
		// --The code is needed to pass old tests, but should eventually be removed
		.seqEach(function(cb) {

			// don't create children
			if (!cc) { return this(); }

			var top = this,
				merchant = req.user.name;
			if (cb.merchant) {
				merchant = cb.merchant;
			}

			// if user does not exist, create it and add to ref array
			if (!this.vars.users[ cb.portal_data.MidNumber ]) {
				var user = new User({
					'name': merchant,
					'username': cb.portal_data.MidNumber,
					'timestamps.createdOn': new Date(),
					'parent': User.toMicro(top.vars.user.parent)
				});
				user.save(function(err,data) {
					if (err) { return top(err); }
					top.vars.users[ cb.portal_data.MidNumber ] = data;
					top();
				});
			} else {
				top();
			}

		})
		.seq(function() {
			this(null, req.body.chargebacks);
		})
		.flatten()
		.seqEach(function(cb) {
			console.log("CSV cb");
			console.log(cb);

			saveChargeback(cb, this.vars.user, false);

			this();

		})
		.seq(function() {

			// cache busting on static api end point
			res.header('Content-Type', 'application/json');
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			return res.json({'success': true});

		})
		.catch(next);

	});

	
	// POSTING JUST ONE CHARGEBACK (MANUAL ENTRY)
	app.post('/api/v1/chargeback', mw.auth(), function(req, res, next) {

		//req.assert('portal_data.MidNumber', 'A mid number is required.').isAlphanumeric();
		req.assert('portal_data.ChargebackAmt', 'An amount is required.').isFloat();
		req.assert('gateway_data.TransAmt', 'Must be an amount.').optional().isFloat();
		req.assert('crm_data.RefundAmount', 'Must be an amount.').optional().isFloat();
		req.assert('portal_data.CcPrefix', 'A valid credit card prefix is required.').len(1,6).isNumeric();
		req.assert('portal_data.CcSuffix', 'A valid credit card suffix is required.').len(4,6).isNumeric();
		req.assert('portal_data.ReasonCode', 'A reason code is required.').isAlphanumeric();
		req.assert('portal_data.ReasonText', 'Some reason text is required.').notEmpty();
		req.assert('internal_type', 'Must specify a type.').notEmpty();
		req.assert('chargebackDate', 'A valid chargeback date is required.').isDate();
		req.assert('gateway_data.Currency', 'A valid currency code is required.').notEmpty();
		
		var newCurrency = req.body.newCurrency;

		if(newCurrency == ""){
		  req.assert('newCurrency', 'A valid currency code is required.').notEmpty();
		}
		
		var errors = req.validationErrors();
		if (errors) {
			return res.json(400, errors );
		}

		if ((!req.body.portal_data.CcPrefix || req.body.portal_data.CcPrefix.length < 4) && !req.body.gateway_data.CcType) {
			return res.json(400, { 'CcPrefix': 'Enter 4 digits or select a credit card type.' });	
		}
		
		if (!req.body.gateway_data.CcType && !Util.detectCardType( req.body.portal_data.CcPrefix + "11010101" + req.body.portal_data.CcSuffix )) {
			return res.json(400, { 'CcPrefix': 'Invalid credit card prefix.' });	
		}      

		if (req.body.gateway_data && req.body.gateway_data.AvsStatus) {
			req.body.gateway_data.AvsStatus = req.body.gateway_data.AvsStatus.toUpperCase();
			// codes from http://www.emsecommerce.net/avs_cvv2_response_codes.htm
			if (!lodash.includes(['X', 'Y', 'A', 'W', 'Z', 'N', 'U', 'R', 'E', 'S', 'D', 'M', 'B', 'P', 'C', 'I', 'G', 'NA'], req.body.gateway_data.AvsStatus )) {
				return res.json(400, { 'AvsStatus': 'Invalid AVS code.' });	
			}
		}

		if (req.body.gateway_data && req.body.gateway_data.CvvStatus) {
			req.body.gateway_data.CvvStatus = req.body.gateway_data.CvvStatus.toUpperCase();
			// codes from http://www.emsecommerce.net/avs_cvv2_response_codes.htm
			if (!lodash.includes(['M', 'N', 'P', 'S', 'U'], req.body.gateway_data.CvvStatus )) {
				return res.json(400, { 'CvvStatus': 'Invalid CVV code.' });	
			}
		}

		
		$()
		.seq(function() {
			User.findById(req.user._id, this);
		})
		.seq(function(user) {

			if (!user) { return res.json(400, {'user': 'User not found.'} ); }

			var cb = req.body;

			console.log("Manual cb");
			console.log(cb);

			var chargeback = saveChargeback(cb, user, true);

			this(null, chargeback);

		})
		.seq(function(cb) {

			// cache busting on static api end point
			res.header('Content-Type', 'application/json');
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			return res.json(cb);

		})
		.catch(next);

	});


	app.put('/api/v1/chargeback/:_id', mw.auth(), function(req, res, next) {

		req.assert('portal_data.ChargebackAmt', 'An amount is required.').isFloat();
		req.assert('gateway_data.TransAmt', 'Must be an amount.').optional().isFloat();
		req.assert('crm_data.RefundAmount', 'Must be an amount.').optional().isFloat();
		req.assert('portal_data.CcPrefix', 'A valid credit card prefix is required.').len(1,6).isNumeric();
		req.assert('portal_data.CcSuffix', 'A valid credit card suffix is required.').len(4,6).isNumeric();
		req.assert('portal_data.ReasonText', 'Some reason text is required.').notEmpty();
		req.assert('chargebackDate', 'A valid chargeback date is required.').isDate();
		req.assert('gateway_data.Currency', 'A valid currency code is required.').notEmpty();

		var newCurrency = req.body.newCurrency;

		if(newCurrency == ""){
		  req.assert('newCurrency', 'A valid currency code is required.').notEmpty();
		}

		var errors = req.validationErrors();
		if (errors) {
			return res.json(400, errors );
		}

		if ((!req.body.portal_data.CcPrefix || req.body.portal_data.CcPrefix.length < 4) && !req.body.gateway_data.CcType) {
			return res.json(400, { 'CcPrefix': 'Enter 4 digits or select a credit card type.' });	
		}

		if (!req.body.gateway_data.CcType && !Util.detectCardType( req.body.portal_data.CcPrefix + "11010101" + req.body.portal_data.CcSuffix )) {
			return res.json(400, { 'CcPrefix': 'Invalid credit card prefix.' });	
		}
		
		if(req.body.gateway_data && req.body.gateway_data.AuthCode && req.body.gateway_data.AuthCode.toLowerCase() != 'na' &&  req.body.gateway_data.AuthCode.length!=6) {
			return res.json(400, {'AuthCode':'Enter 6 digits or NA if auth code is not available.'});

		}	

		if( req.body.gateway_data && req.body.gateway_data.AuthCode && req.body.gateway_data.AuthCode.length == 6)	{
			req.assert('gateway_data.AuthCode', 'Enter 6 digits or NA if auth code is not available.').isAlphanumeric();
                
			var errors2 = req.validationErrors();
                	if (errors2) {
                        	return res.json(400, errors2 );
                	}	
		}

		if( req.body.gateway_data && (	req.body.gateway_data.BillingAddr1 || 
						req.body.gateway_data.BillingAddr2 || 
						req.body.gateway_data.BillingCity || 
						req.body.gateway_data.BillingState||
						req.body.gateway_data.BillingCountry||
						req.body.gateway_data.BillingPostal))
		{
			req.assert( 'gateway_data.BillingAddr1', 'You must provide billing address line 1.').notEmpty();
			req.assert( 'gateway_data.BillingCity', 'Invalid Address: must specify city.').notEmpty();
			req.assert( 'gateway_data.BillingPostal', 'Invalid Address: must specify billing postal code.').notEmpty();

	    if( !req.body.gateway_data.BillingState)
	            req.assert( 'gateway_data.BillingCountry','Invalid Address: must specify state or foreign country').notEmpty();

			if( req.body.gateway_data.BillingCountry && req.body.gateway_data.BillingCountry.length>0 && req.body.gateway_data.BillingCountry != 'USA'  && req.body.gateway_data.BillingCountry != 'US')
				req.assert('gateway_data.BillingState','Enter a valid state code or NA for an international address').notEmpty();

			var errors3 = req.validationErrors();
                        if (errors3) {
                                return res.json(400, errors3 );
                        }
		}

		if (req.body.gateway_data && req.body.gateway_data.AvsStatus) {
			req.body.gateway_data.AvsStatus = req.body.gateway_data.AvsStatus.toUpperCase();
			// codes from http://www.emsecommerce.net/avs_cvv2_response_codes.htm
			if (!lodash.includes(['X', 'Y', 'A', 'W', 'Z', 'N', 'U', 'R', 'E', 'S', 'D', 'M', 'B', 'P', 'C', 'I', 'G', 'NA'], req.body.gateway_data.AvsStatus )) {
				return res.json(400, { 'AvsStatus': 'Invalid AVS code.' });	
			}
		}

		if (req.body.gateway_data && req.body.gateway_data.CvvStatus) {
			req.body.gateway_data.CvvStatus = req.body.gateway_data.CvvStatus.toUpperCase();
			// codes from http://www.emsecommerce.net/avs_cvv2_response_codes.htm
			if (!lodash.includes(['M', 'N', 'P', 'S', 'U'], req.body.gateway_data.CvvStatus )) {
				return res.json(400, { 'CvvStatus': 'Invalid CVV code. M, N, P, S, or U' });	
			}
		}


		// instead of findById, add query parameters to ensure privacy
		var to_remove = false;
		_( Chargeback.findOne()
			.where('_id', req.params._id)
			.or([
				{ 'user._id': req.user._id },
				{ 'parent._id': req.user._id }
			])
			.stream() )
		.map(function( data ) {
			
			var updated = lodash.omit(req.body, ['__v', '_id', 'createdOn', 'attachments']);
			data.set(updated);
			data.set('updatedOn', new Date());

			if (data.status == "New") {
				data.set('status', "In-Progress");	
			}

			// adds new ones and removes non-existent to data.attachments
			Upload.updateUploadArray(req.body.attachments, data.attachments, data.deleted_attachments);
			return data;
			
		})
		.flatMap(Util.saveStream)
		.map( JSON.stringify )
		.pipe(res);

	});

	app.put('/api/v1/hidechargeback/:_id', mw.auth(), function(req, res) {
		_( Chargeback.findOne()
			.where('_id', req.params._id)
			.or([
				{ 'user._id': req.user._id },
				{ 'parent._id': req.user._id }
			])
			.stream() )
			.map(function( data ) {

				data.set('visible', false);

				return data;

			})
			.flatMap(Util.saveStream)
			.map( JSON.stringify )
			.pipe(res);

	});
};

