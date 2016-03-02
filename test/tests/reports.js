var lodash = require('lodash'),
	assert = require("assert"),
	should = require('should'),
	moment = require('moment');


module.exports = function(app) {

	describe('Reporting Endpoint Tests',function(){

		var request = require("supertest")(app),
				User = app.Models.get('User'),
				Chargeback = app.Models.get('Chargeback'),
				config = app.settings.config;

		
		var login = false,
			other = false;
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


		describe('GET /api/v1/history', function(){
			var data = [];
			it('should return 200', function(done){
				request
					.get('/api/v1/history')
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('authorization', login.authtoken)
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						data = res.body;
						done();
					});
			});
			it('should have length=1', function(done) {
				data.should.be.instanceof(Array).and.have.lengthOf(1);
				done();
			});
			it('should equal to 2', function(done) {
				data[0].count.should.be.equal(2);
				done();
			});
		});

		describe('GET /api/v1/users', function(){
			var data = [],
				users;
			//Make sure a child was not created, as the child creation process has changed
			it('current users should be 1', function(done){
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
						lodash.each(users, function(u) {
							if (u._id + '' != login._id + '') {
								other = u._id;
							}
						});
						done();
					});
			});

			//These tests were meant to be run after a new user was created, but the child creation process has changed
			//it('GET /api/v1/history?user=other should return 200', function(done){
			//	request
			//		.get('/api/v1/history?user=' + other)
			//		.set('Content-Type', 'application/json')
			//		.set('Accept', 'application/json')
			//		.set('authorization', login.authtoken)
			//		.expect(200)
			//		.end(function(e, res) {
			//			if (e) { console.log(e); done(e); }
			//			data = res.body;
			//			done();
			//		});
			//});
			//it('result should have length=1', function(done) {
			//	data.should.be.instanceof(Array).and.have.lengthOf(1);
			//	done();
			//});
			//it('result should equal 1', function(done) {
			//	data[0].count.should.be.equal(1);
			//	done();
			//});
		});
		

		describe('GET /api/v1/report/status', function(){
			var data;
			var start = new Date("2015-05-10").getTime().toString();
			var end = new Date("2015-05-14").getTime().toString();
			it('should return 200', function(done){
				request
//					.get('/api/v1/report/status?start=' + moment().subtract(2, 'day').valueOf() + "&end=" + moment().add(2, 'day').valueOf())
					.get('/api/v1/report/status?start=' + start + "&end=" + end)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('authorization', login.authtoken)
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						data = res.body;
						done();
					});
			});
			it('should have object byVolume and byCount', function(done) {
				data.should.be.an.instanceOf(Object).and.have.property('byVolume');
				data.should.be.an.instanceOf(Object).and.have.property('byCount');
				done();
			});
			it('data length should equal 1 and volume should be 8.98', function(done) {
				data.byVolume.data.should.be.instanceof(Array).and.have.lengthOf(2);
				data.byCount.data.should.be.instanceof(Array).and.have.lengthOf(2);
				data.byVolume.data[0].sum.should.be.equal(8.98);
				done();
			})
		});

		//These tests were meant to be run after a new user was created, but the child creation process has changed
		//describe('GET /api/v1/report/status?user=other', function(){
		//	var data;
		//	it('should return 200', function(done){
		//		request
		//			.get('/api/v1/report/status?user=' + other + '&start=' + moment().subtract(2, 'day').valueOf() + "&end=" + moment().add(2, 'day').valueOf())
		//			.set('Content-Type', 'application/json')
		//			.set('Accept', 'application/json')
		//			.set('authorization', login.authtoken)
		//			.expect(200)
		//			.end(function(e, res) {
		//				if (e) { console.log(e); done(e); }
		//				data = res.body;
		//				done();
		//			});
		//	});
		//	it('should have object with data', function(done) {
		//		data.byVolume.should.be.an.instanceOf(Object).and.have.property('data');
		//		data.byVolume.data[0].should.be.an.instanceOf(Object).and.have.property('sum', 8.98);
		//		done();
		//	});
		//
		//});

	});

};