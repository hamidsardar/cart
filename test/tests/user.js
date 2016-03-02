var lodash = require('lodash'),
	assert = require("assert"),
	should = require('should');
	


module.exports = function(app) {

	var request = require("supertest")(app),
		User = app.Models.get('User'),
		Chargeback = app.Models.get('Chargeback');


	describe('Test User',function(){
		var config = app.settings.config;
		describe('User creation',function(){
			it('should create user', function(done){
				var user = new User();
				user.set(config.get('users')[0]);
				user.save(function(err,data) {
					if (err) { throw err; }
					data.should.be.an.instanceOf(Object).and.have.property('_id');
					data.should.have.property('email', config.get('users')[0].email);
					data.should.have.property('username', config.get('users')[0].username);
					data.should.have.property('password');
					// data.should.have.property('admin', false);
					assert.notEqual(data.password, config.get('users')[0].password);
					done();
				});
			});
		});

		describe('POST /api/v1/user with duplicate username', function(){
			it('should return 400', function(done){
				var user = config.get('users')[0];
				request
					.post('/api/v1/user')
					.send(user)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.expect(400)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						done();
					});
			
			});
		});

		describe('POST /api/v1/user with no username', function(){
			it('should return 400', function(done){
				var user = config.get('users')[0];
				request
					.post('/api/v1/user')
					.send(lodash.omit(user, 'username'))
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.expect(400)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						done();
					});
			});
		});

		var new_user = false;
		describe('POST /api/v1/user with new user', function(){
			it('should return 200', function(done){
				var user = config.get('users')[1];
				request
					.post('/api/v1/user')
					.send(user)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						data = res.body;
						data.should.be.an.instanceOf(Object).and.have.property('_id');
						data.should.have.property('email', config.get('users')[1].email);
						data.should.have.property('username', config.get('users')[1].username);
						data.should.not.have.property('password');
						// data.should.not.have.property('admin', false);
						new_user = data;
						done();
					});
			});
		});

		describe('PUT /api/v1/user with no auth header', function(){
			it('should return 401', function(done){
				var user = config.get('users')[1];
				request
					.put('/api/v1/user/' + new_user._id)
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
		describe('POST /api/v1/login valid', function(){
			it('should return 200', function(done){
				var user = config.get('users')[1];
				request
					.post('/api/v1/login')
					.send(user)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						var data = res.body;
						data.should.be.an.instanceOf(Object).and.have.property('_id');
						data.should.have.property('email', config.get('users')[1].email);
						data.should.have.property('username', config.get('users')[1].username);
						data.should.have.property('name', config.get('users')[1].name);
						data.should.have.property('authtoken');
						data.should.not.have.property('password');
						// data.should.not.have.property('admin', false);
						login = data;
						done();
					});
			});
		});

		describe('PUT /api/v1/user with new user', function(){
			it('should return 200', function(done){
				var user = lodash.clone(config.get('users')[1]);
				user.name = "new name";
				request
					.put('/api/v1/user/' + new_user._id)
					.send(user)
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('authorization', login.authtoken)
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						var data = res.body;
						data.should.be.an.instanceOf(Object).and.have.property('_id');
						data.should.have.property('email', config.get('users')[1].email);
						data.should.have.property('username', config.get('users')[1].username);
						data.should.have.property('name', "new name");
						data.should.not.have.property('password');
						// data.should.not.have.property('admin', false);
						done();
					});
			});
		});


		describe('GET /api/v1/users admin', function(){
			it('should return 200', function(done){
				request
					.get('/api/v1/users')
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('authorization', login.authtoken)
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						res.body.should.be.instanceof(Array);
						done();
					});
			});
		});
	});

};