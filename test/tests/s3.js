var _ = require('highland'),
	lodash = require('lodash'),
	assert = require("assert"),
	should = require('should');


module.exports = function(app) {

	var request = require("supertest")(app),
		User = app.Models.get('User'),
		Chargeback = app.Models.get('Chargeback');

	describe('S3 Upload Test',function(){
		
		var config = app.settings.config;
		
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

		describe('GET /api/v1/s3', function(){
			var data;
			it('should return 200', function(done){
				var cb = config.get('chargebacks');
				request
					.get('/api/v1/s3?filename=test.png&contentType=image/png')
					.set('authorization', login.authtoken)
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						data = res.body;
						done();
					});
			});
			it('should have AWSAccessKeyId', function(done){
				data.should.have.property('AWSAccessKeyId');
				done();
			});
			it('should have bucket=chargebackcom', function(done){
				data.should.have.property('bucket', 'chargebackcom');
				done();
			});
			it('should have path', function(done){
				data.should.have.property('path');
				done();
			});
			it('should have policy', function(done){
				data.should.have.property('policy');
				done();
			});
			it('should have signature', function(done){
				data.should.have.property('signature');
				done();
			});
			it('should have photo', function(done){
				data.should.have.property('photo');
				done();
			});
			it('should have contentType=image/png', function(done){
				data.should.have.property('contentType', 'image/png');
				done();
			});
		});

	});

};