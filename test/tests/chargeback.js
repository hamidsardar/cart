var _ = require('highland'),
	lodash = require('lodash'),
	assert = require("assert"),
	should = require('should');


module.exports = function(app) {

	describe('Test Chargebacks',function(){

		var request = require("supertest")(app),
			User = app.Models.get('User'),
			Chargeback = app.Models.get('Chargeback'),
			config = app.settings.config;

		var login = false;
		describe('POST /api/v1/login valid', function(){
			it('should return 200', function(done){
				var user = config.get('users')[0];
				request
					.post('/api/v1/login')
					.send(user)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						login = res.body;
						done();
					});
			});
		});


		var db_cb;
		describe('Create chargeback and test data manipulation', function(){
			it('should return object with _id', function(done){
				var c = lodash.clone(config.get('chargebacks'))[0];
				var cb = new Chargeback();
				cb.set('crm_data', c.crm_data);
				cb.set('portal_data', c.portal_data);
				cb.set('shipping_data', c.shipping_data);
				cb.set('gateway_data', c.gateway_data);
				cb.set('user', login);
				cb.set('status', 'New');
				cb.set('chargebackDate', c.chargebackDate);
				cb.save(function(err,d) {
					if (err) { throw err; }
					db_cb = d.toJSON();
					db_cb.should.be.an.instanceOf(Object).and.have.property('_id');
					done();
				});
			});
			// the following test all the data manipulation that goes on within
			// the Chargeback model during presave.
			it('should have status=New', function(done){
				db_cb.should.have.property('status', 'New');
				done();
			});
			it('should have createdOn as Date', function(done){
				db_cb.createdOn.should.be.an.instanceOf(Date);
				done();
			});
			it('should have gateway_data.CcType=VISA', function(done){
				db_cb.should.have.property('gateway_data').with.property('CcType', 'VISA');
				done();
			});
			it('should have refunded=true', function(done){
				db_cb.should.have.property('refunded', true);
				done();
			});
			it('should have shipped=true', function(done){
				db_cb.should.have.property('shipped', true);
				done();
			});
			it('should have shipped=true', function(done){
				db_cb.should.have.property('recurring', false);
				done();
			});
			it('should have gateway_data.FullName', function(done){
				db_cb.should.have.property('gateway_data').with.property('FullName', config.get('chargebacks')[0].gateway_data.FirstName + " " + config.get('chargebacks')[0].gateway_data.LastName);
				done();
			});
			it('should have chargebackDate as Date', function(done){
				db_cb.chargebackDate.should.be.an.instanceOf(Date);
				done();
			});
			it('should have gateway_data.TransDate as Date', function(done){
				db_cb.gateway_data.TransDate.should.be.an.instanceOf(Date);
				done();
			});
			it('should have gateway_data.OrderDate as Date', function(done){
				db_cb.crm_data.OrderDate.should.be.an.instanceOf(Date);
				done();
			});
			it('should have gateway_data.CancelDateSystem as Date', function(done){
				db_cb.crm_data.CancelDateSystem.should.be.an.instanceOf(Date);
				done();
			});
			it('should have gateway_data.RefundDateFull as Date', function(done){
				db_cb.crm_data.RefundDateFull.should.be.an.instanceOf(Date);
				done();
			});
			it('should have gateway_data.RefundDatePartial as Date', function(done){
				db_cb.crm_data.RefundDatePartial.should.be.an.instanceOf(Date);
				done();
			});
			it('should have shipping_data.ShippingDate as Date', function(done){
				db_cb.shipping_data.ShippingDate.should.be.an.instanceOf(Date);
				done();
			});
			it('should have crm_data. ProductCrmName should not exist', function(done){
				db_cb.should.have.property('crm_data').and.should.not.have.property('ProductCrmName');
				done();
			});
			it('should have portal_data. Portal should not exist', function(done){
				db_cb.should.have.property('portal_data').and.should.not.have.property('Portal');
				done();
			});
			it('should not have parent property', function(done){
				db_cb.should.not.have.property('parent');
				done();
			});
			it('should have user with user.name and user._id', function(done){
				db_cb.should.have.property('user').with.property('_id');
				db_cb.should.have.property('user').with.property('name', config.get('users')[0].name);
				done();
			});
		});


		describe('Search chargebacks with logged in user.', function(){
			it('should return arary with length=1', function(done){
				var q = Chargeback.search({
					user: login,
					query: {}
				});

				_( Chargeback.find()
					.and(q)
					.lean()
					.stream() )
				.stopOnError(function(err) { throw err; })
				.toArray(function(data) {
					data.should.be.instanceof(Array).and.have.lengthOf(1);
					done();
				});
			});
		});

		
		// stub user._id to make sure chargebacks aren't returned anonymously
		describe('Search chargebacks with non-user.', function(){
			it('should return empty array', function(done){
				var q = Chargeback.search({
					user: {
						'_id': "54ef98adf1a824ed278b6b3c"
					},
					query: {}
				});

				_( Chargeback.find()
					.and(q)
					.lean()
					.stream() )
				.stopOnError(function(err) { throw err; })
				.toArray(function(data) {
					data.should.be.instanceof(Array).and.have.lengthOf(0);
					done();
				});

			});
		});


		describe('Update a chargeback and test data manipulation', function(){
			var data;
			it('should return object with _id', function(done){
				Chargeback.findById(db_cb._id, function(err, d) {
					if (err) { throw err; }
					d.set('status', "In Progress");
					d.set('updatedOn', new Date());
					d.set('portal_data.CcPrefix', '5329');	// set prefix and suffix to mastercard
					d.set('portal_data.CcSuffix', '8332');
					d.save(function(err, sd) {
						if (err) { throw err; }
						data = sd.toJSON();
						data.should.be.an.instanceOf(Object).and.have.property('_id');	
						done();
					});
				});
			});
			// the following test all the data manipulation that goes on within
			// the Chargeback model during presave.
			it('should have status=In Progress', function(done){
				data.should.have.property('status', 'In Progress');
				done();
			});
			it('should have createdOn as Date', function(done){
				data.createdOn.should.be.an.instanceOf(Date);
				data.createdOn.valueOf().should.equal(db_cb.createdOn.valueOf());
				done();
			});
			it('should have updatedOn as Date', function(done){
				data.updatedOn.should.be.an.instanceOf(Date);
				done();
			});
			it('should have gateway_data.CcType=MASTERCARD', function(done){
				data.should.have.property('gateway_data').with.property('CcType', 'MASTERCARD');
				done();
			});
		});


		//TODO: Child creation used to be tested here by passing "'createChildren': true" in the request, but
		//child creation is no longer done in that way. A new test should be made for that.
		describe('POST /api/v1/chargebacks', function(){
			it('should return 200', function(done){
				var cb = config.get('chargebacks');
				request
					.post('/api/v1/chargebacks')
					.send({
						'chargebacks': cb,
						'createChildren': false,
						'user': login
					})
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('authorization', login.authtoken)
					.expect(200)
					.end(function(e, res) {
						if (e) {
							console.log(e);
							done(e);
						}
						done();
					});
			});
		});

		describe('Test new data', function(){
			var users,
				other;
			//Make sure a child was not created, as the child creation process has changed
			it('current users should now be 1', function(done){
				request
					.get('/api/v1/users')
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('authorization', login.authtoken)
					.expect(200)
					.end(function(e, res) {
						if (e) { console.log(e); done(e); }
						users = res.body;
						users.should.be.instanceof(Array).and.have.lengthOf(1);
						done();
					});
			});
			// @TODO: count doesn't work here, adding users a lot, need to look for new user somehow
			// it('total users should be 4', function(done){
			// 	User.count(function(err,c) {
			// 		if (err) { throw err; }
			// 		c.should.equal(4);
			// 		done();
			// 	});
			// });
			it('chargeback query should return array with length=2', function(done){
				var q = Chargeback.search({
					user: login,
					query: {}
				});

				_( Chargeback.find()
					.and(q)
					.lean()
					.stream() )
				.stopOnError(function(err) { throw err; })
				.toArray(function(data) {
					data.should.be.instanceof(Array).and.have.lengthOf(2);
					done();
				});

			});

			//These tests were meant to be run after a new user was created, but the child creation process has changed
			//it('new user should return array with length=1', function(done){
			//	lodash.each(users, function(u) {
			//		if (u._id + '' != login._id + '') {
			//			other = u._id;
			//		}
			//	});
			//	var q = Chargeback.search({
			//		'user': {
			//			'_id': other
			//		},
			//		query: {}
			//	});
            //
			//	_( Chargeback.find()
			//		.and(q)
			//		.lean()
			//		.stream() )
			//	.stopOnError(function(err) { throw err; })
			//	.toArray(function(data) {
			//		data.should.be.instanceof(Array).and.have.lengthOf(1);
			//		done();
			//	});
            //
			//});
			//it('chargeback query with user param should return array with length=1', function(done){
			//	var q = Chargeback.search({
			//		user: login,
			//		query: {
			//			user: other
			//		}
			//	});
            //
			//	_( Chargeback.find()
			//		.and(q)
			//		.lean()
			//		.stream() )
			//	.stopOnError(function(err) { throw err; })
			//	.toArray(function(data) {
			//		data.should.be.instanceof(Array).and.have.lengthOf(2);
			//		done();
			//	});
            //
			//});
		});

	});

};