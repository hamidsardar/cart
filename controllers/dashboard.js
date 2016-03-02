module.exports = function(app) {

	var _ = require('underscore'),
		$ = require('seq'),
		mw = require('./middleware'),
		mongoose = require('mongoose'),
		Chargeback = app.Models.get('Chargeback'),
		User = app.Models.get('User'),
		log = app.get('log');
		

	app.get('/api/v1/dashboard', mw.auth(), function(req, res, next) {

		var params = req.query;
		$()
		.seq(function() {
			if (params.user) {
				// if filtering by a user, ensure user is child of current user
				User.isChild(req.user._id, params.user, this);
			} else {
				this(null,true);
			}
		})
		.seq(function(pass) {
			if (!pass) {
				// if current user is not parent of filtered user, then we 
				// have a security problem, so dump out...
				log.log(req.user._id + ' trying to access ' + params.user);
				return res.json(401, 'Unauthorized');
			}
			this();
		})
		.par('amount', function() {
			
			var agg = [
					{ $match: Chargeback.setMatch(req) },
					{ $project: {
						_id: 0,
						amt: '$portal_data.ChargebackAmt',
						status: '$status'
					}},
					{ $group: {
						'_id': { 'status' : "$status" }, 
						'sum': { '$sum': '$amt' },
						'count': { '$sum': 1 }
					}}
				];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})
		.par('totals', function() {
			
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					amt: '$portal_data.ChargebackAmt',
					status: '$status'
				}},
				{ $group: {
					'_id': 0,
					'sum': { '$sum': '$amt' },
					'count': { '$sum': 1 }
				}}
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})
		.par('top_mids_volume', function() {
			
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					amt: '$portal_data.ChargebackAmt',
					mid: '$portal_data.MidNumber'
				}},
				{ $group: {
					'_id': { 'mid': '$mid' },
					'sum': { '$sum': '$amt' },
					'count': { '$sum': 1 }
				}},
				{ $sort: {
					'sum': -1
				}},
				
				{ $limit: 8 }
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})
		.par('top_mids_count', function() {
			
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					amt: '$portal_data.ChargebackAmt',
					mid: '$portal_data.MidNumber'
				}},
				{ $group: {
					'_id': { 'mid': '$mid' },
					'sum': { '$sum': '$amt' },
					'count': { '$sum': 1 }
				}},
				{ $sort: {
					'count': -1
				}},
				
				{ $limit: 8 }
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})

		.par('currency', function() {	
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					currency: '$gateway_data.Currency',
					date: '$createdOn'
				}},

				{ $group: {
					'_id': { 'currency': '$currency', 'date': '$date' }
					
				}},
				
				{ $sort: { 
					'timestamp': -1 
				}},
    			{ $limit: 1 }
				
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})

		.par('top_fliers_volume', function() {
			
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					amt: '$portal_data.ChargebackAmt',
					name: '$gateway_data.FullName'
				}},
				{ $group: {
					'_id': { 'name': '$name' },
					'sum': { '$sum': '$amt' },
					'count': { '$sum': 1 }
				}},
				{ $sort: {
					'sum': -1
				}},
				{ $limit: 8 }
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})
		.par('top_fliers_count', function() {
			
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					amt: '$portal_data.ChargebackAmt',
					name: '$gateway_data.FullName'
				}},
				{ $group: {
					'_id': { 'name': '$name' },
					'sum': { '$sum': '$amt' },
					'count': { '$sum': 1 }
				}},
				{ $sort: {
					'count': -1
				}},
				{ $limit: 8 }
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})
		.par('cvv_match_volume', function() {
			
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					amt: '$portal_data.ChargebackAmt',
					cvv: '$gateway_data.CvvStatus'
				}},
				{ $group: {
					'_id': { 'cvv': '$cvv' },
					'sum': { '$sum': '$amt' },
					'count': { '$sum': 1 }
				}},
				{ $sort: {
					'sum': -1
				}},
				{ $limit: 8 }
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})
		.par('cvv_match_count', function() {
			
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					amt: '$portal_data.ChargebackAmt',
					cvv: '$gateway_data.CvvStatus'
				}},
				{ $group: {
					'_id': { 'cvv': '$cvv' },
					'sum': { '$sum': '$amt' },
					'count': { '$sum': 1 }
				}},
				{ $sort: {
					'count': -1
				}},
				{ $limit: 8 }
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})
		.par('avs_match_volume', function() {
			
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					amt: '$portal_data.ChargebackAmt',
					avs: '$gateway_data.AvsStatus'
				}},
				{ $group: {
					'_id': { 'avs': '$avs' },
					'sum': { '$sum': '$amt' },
					'count': { '$sum': 1 }
				}},
				{ $sort: {
					'sum': -1
				}},
				{ $limit: 8 }
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})
		.par('avs_match_count', function() {
			
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					amt: '$portal_data.ChargebackAmt',
					avs: '$gateway_data.AvsStatus'
				}},
				{ $group: {
					'_id': { 'avs': '$avs' },
					'sum': { '$sum': '$amt' },
					'count': { '$sum': 1 }
				}},
				{ $sort: {
					'count': -1
				}},
				{ $limit: 8 }
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})
		.par('del_add_match', function() {
			
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ $project: {
					_id: 0,
					amt: '$portal_data.ChargebackAmt',
					delAdd: '$crm_data.DeliveryAddr1'
				}},
				{ $group: {
					'_id': { 'delAdd': '$delAdd' },
					'sum': { '$sum': '$amt' },
					'count': { '$sum': 1 }
				}}
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}
			Chargeback.aggregate(agg, this);

		})
		.par('bill_add_match', function() {
			var agg = [
				{ $match: Chargeback.setMatch(req) },
				{ '$project': {
					'_id': 0,
					'billAdd': '$gateway_data.BillingAddr1',
					'amt': '$portal_data.ChargebackAmt'
				}},

				{ '$group': {
					'_id': { 'billAdd' : '$billAdd' }, 
					'count': { '$sum': 1 },
					'sum': { '$sum': '$amt' }
				}}
			];
			
			if (process.env.NODE_ENV == "development") {
				log.log(agg);
			}

			Chargeback.aggregate(agg, this);

		})
		.par('wonlost', function() {
			
			var search = [
				{ '$match': Chargeback.setMatch(req) },
				{ '$project': {
					'_id': 0,
					'status': "$status",
					'amt': '$portal_data.ChargebackAmt'
				} },
				{ '$group': {
					'_id': { 'status' : "$status" }, 
					'count': { '$sum': 1 },
					'sum': { '$sum': '$amt' }
				}}
			];

			if (process.env.NODE_ENV == "development") {
				log.log(search);
			}
			Chargeback.aggregate(search, this);

		})
		.seq(function() {
				
			var out = {
				'total': (this.vars.totals[0] || { 'sum': 0, 'count': 0 })
			};
			
			_.each(this.vars.amount, function(item) {
				out[item._id.status] = {
					count: item.count,
					sum: item.sum
				};
			});

			out['Complete'] = {
				count: 0,
				sum: 0
			};

			if (out.Won && out.Lost){
				out.Complete.count = out.Won.count + out.Lost.count;
				out.Complete.sum = out.Won.sum + out.Lost.sum;
			} else if (out.Won) {
				out.Complete.count = out.Won.count;
				out.Complete.sum = out.Won.sum;
			} else if (out.Lost) {
				out.Complete.count = out.Lost.count;
				out.Complete.sum = out.Lost.sum;
			}

			var top_mids_vol = [];
			_.each(this.vars.top_mids_volume, function(item) {
				top_mids_vol.push( { mid: item._id.mid, amt: item.sum } );
			});
			
			out.midVol = top_mids_vol;

			var selected_currency= [];
			_.each(this.vars.currency, function(item) {
				selected_currency.push( {currency: item._id.currency, date: item._id.date } );
			});

			out.selectedCurrency = selected_currency;
			
			out.midVol = top_mids_vol;

			var top_mids_ct = [];
			_.each(this.vars.top_mids_count, function(item) {
				top_mids_ct.push( { mid: item._id.mid, count: item.count } );
			});

			out.midCt = top_mids_ct;

			// top fliers by volume
			var top_fliers_vol = [];
			_.each(this.vars.top_fliers_volume, function(item) {
				top_fliers_vol.push( { name: item._id.name, amt: item.sum } );
			});

			out.fliersVol = top_fliers_vol;

			//top fliers by count
			var top_fliers_ct = [];
			_.each(this.vars.top_fliers_count, function(item) {
				top_fliers_ct.push( { name: item._id.name, count: item.count } );
			});

			out.fliersCt = top_fliers_ct;

			//top cvvv matches by volume
			var cvv_match_vol = [];
			_.each(this.vars.cvv_match_volume, function(item) {
				if (item._id.cvv == null ){
					item._id.cvv = "No CVV Status";
				}
				cvv_match_vol.push( { cvv: item._id.cvv, amt: item.sum } );
			});

			out.cvvVol = cvv_match_vol;

			//top cvv matchex by count
			var cvv_match_ct = [];
			_.each(this.vars.cvv_match_count, function(item) {
				if (item._id.cvv == null ){
					item._id.cvv = "No CVV Status";
				}
				cvv_match_ct.push( { cvv: item._id.cvv, count: item.count } );
			});

			out.cvvCt = cvv_match_ct;

			//top avs matches by volume
			var avs_match_vol = [];
			_.each(this.vars.avs_match_volume, function(item) {
				if (item._id.avs == null ){
					item._id.avs = "No AVS Status";
				}
				avs_match_vol.push( { avs: item._id.avs, amt: item.sum } );
			});

			out.avsVol = avs_match_vol;

			//top avs matches by count
			var avs_match_ct = [];
			_.each(this.vars.avs_match_count, function(item) {
				if (item._id.avs == null ){
					item._id.avs = "No AVS Status";
				}
				avs_match_ct.push( { avs: item._id.avs, count: item.count } );
			});

			out.avsCt = avs_match_ct;

			//address matching
			var del_match_ct = [];
			_.each(this.vars.del_add_match, function(item) {
					if (item._id.delAdd != null) {
						del_match_ct.push( {delAdd: item._id.delAdd, count: item.count } );
					}
			});		

			out.delCt = del_match_ct;

			var bill_match_ct = [];
			_.each(this.vars.bill_add_match, function(item) {
					if (item._id.billAdd != null) {
						del_match_ct.push( {billAdd: item._id.billAdd, count: item.count } );
						bill_match_ct.push({billAdd: item._id.billAdd, count: item.count } );
					}
			});

			out.billCt = bill_match_ct;

			//for address matching totals
			var addTotal = 0;
			var addMatch = 0;
			var matchPercent = "";

			//count billing addresses
			_.each(out.billCt, function (){
				addTotal += 1;
			});
			
			//find shipping address matches	
			_.each(out.delCt, function (d){
				if (d.billAdd == d.delAdd) {
					addMatch ++;
				}
				matchPercent = Math.floor((addMatch / addTotal) * 100) + "%"; 
			});

			out.addMatch = addMatch;
			out.matchPercent = matchPercent;

			//@TODO: billing and win-loss
			out.billing = {
				count: out.total.count / 2,
				sum: out.total.sum / 2
			};

			out.won_amount = 0;
			out.hwl = false;
			out.winloss = {
				"won": 0,
				"pending": 0,
                "lost": 0,
                "count": 0
			};

			_.each(this.vars.wonlost, function(wl) {
				if (wl._id.status == "Won" || wl._id.status == "Lost") {
					out.winloss.count += wl.count;	// tally counts
					if (wl._id.status == "Won") {
						out.winloss.won = wl.count;
						out.won_amount = wl.amount;
						out.hwl = true;
					} else if (wl._id.status == "Lost") {
						out.winloss.lost = wl.count;
						out.lost_amount = wl.amount;
					}
				} else {
					out.winloss.pending += wl.count;
				}
			});
			
			// cache busting on static api end point
			res.header('Content-Type', 'application/json');
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			return res.json(out);

		})
		.catch(next);

	});

};