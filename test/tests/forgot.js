var _ = require('highland'),
	lodash = require('lodash'),
	assert = require("assert"),
	should = require('should');


module.exports = function(app) {

	var request = require("supertest")(app),
		User = app.Models.get('User'),
		Chargeback = app.Models.get('Chargeback');

	describe('Test Forgot Password',function(){
		
		var config = app.settings.config,
			test_user = config.get('users')[2];
		
		describe('User creation',function(){
			it('should create user', function(done){
				var user = new User();
				user.set(test_user);
				user.save(function(err,data) {
					if (err) { throw err; }
					data.should.be.an.instanceOf(Object).and.have.property('_id');
					data.should.have.property('email', test_user.email);
					data.should.have.property('username', test_user.username);
					data.should.have.property('password');
					data.should.have.property('admin', false);
					assert.notEqual(data.password, test_user.password);
					done();
				});
			});
		});

		describe('POST /api/v1/forgot with invalid email', function(){
			it('should return 200', function(done){
				request
					.post('/api/v1/forgot')
					.send({ 'email': 'thewrongemail@wrong.com' })
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(err, res) {  
						if (err) { throw err; }
						done();
					});
			});
		});

		describe('POST /api/v1/forgot with valid email', function(){
			it('should return 200', function(done){
				request
					.post('/api/v1/forgot')
					.send(test_user)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(err, res) {  
						if (err) { throw err; }
						done();
					});
			});
		});

	});

};