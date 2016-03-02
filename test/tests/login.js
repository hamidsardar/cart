var lodash = require('lodash'),
	assert = require("assert"),
	should = require('should');
	
module.exports = function(app) {

	var request = require("supertest")(app),
		User = app.Models.get('User'),
		test_user = {
			"name": "CompanyLoginTest",
			"username": "usernameLoginTest",
			"password": "stinky",
			"email": "login@test.com",
			"admin": true
		};

	describe('Test Login',function(){
		
		describe('User creation for login test',function(){
			it('should create user', function(done){
				var user = new User(test_user);
				user.save(function(err,data) {
					if (err) { throw err; }
					data.should.be.an.instanceOf(Object).and.have.property('_id');
					data.should.have.property('email', test_user.email);
					data.should.have.property('username', test_user.username);
					data.should.have.property('password');
					// data.should.have.property('admin', true);
					assert.notEqual(data.password, test_user.password);
					done();
				});
			});
		});

		
		describe('POST /api/v1/login test invalid', function(){
			it('should return 401', function(done){
				var user = lodash.clone(test_user);
				user.password = "wrong";
				request
					.post('/api/v1/login')
					.send(user)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.expect(401)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						done();
					});
			});
		});

		var login = false;
		describe('POST /api/v1/login test valid', function(){
			it('should return 200', function(done){
				request
					.post('/api/v1/login')
					.send(test_user)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						var data = res.body;
						
						data.should.be.an.instanceOf(Object).and.have.property('_id');
						data.should.have.property('authtoken');
						data.should.have.property('email', test_user.email);
						data.should.have.property('username', test_user.username);
						
						login = data;
						done();
					});
			});
		});

		describe('GET /api/v1/refresh', function(){
			it('should return 200', function(done){
				request
					.get('/api/v1/refresh')
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('authorization', login.authtoken)
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						var data = res.body;
						
						data.should.be.an.instanceOf(Object).and.have.property('authtoken');
						done();
					});
			});
		});


		describe('GET /api/v1/refresh', function(){
			it('should return 401', function(done){
				request
					.get('/api/v1/refresh')
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('authorization', login.authtoken + 'makeinvalid')
					.expect(401)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						done();
					});
			});
		});


		
		describe('POST /api/v1/admin/login test invalid', function(){
			it('should return 200', function(done){
				request
					.post('/api/v1/admin/login')
					.send(test_user)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('authorization', login.authtoken)
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						var data = res.body;
						
						data.should.be.an.instanceOf(Object).and.have.property('_id');
						data.should.have.property('authtoken');
						data.should.have.property('email', test_user.email);
						data.should.have.property('username', test_user.username);

						done();
					});
			});
		});

		
	});

};