var _ = require('highland'),
	lodash = require('lodash'),
	assert = require("assert"),
	should = require('should');


module.exports = function(app) {

	describe('Test Docgen Toggles',function(){

		var request = require("supertest")(app),
			Chargeback = app.Models.get('Chargeback');
			

		var cbs = [];
		
		
		describe('Search chargebacks where docgen does not exist', function(){
			it('should return arary since false is default', function(done){
				_( Chargeback.find()
					.where('docgen')
					.exists(false)
					.lean()
					.stream() )
				.stopOnError(function(err) { throw err; })
				.toArray(function(data) {
					data.should.be.instanceof(Array);
					cbs = data;
					done();
				});
			});
		});

		describe('GET /api/v1/docgen/_id', function(){
			var completed;
			it('should return 200', function(done){
				request
					.get('/api/v1/docgen/' + cbs[0]._id )
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(e, res) {  
						if (e) { console.log(e); done(e); }
						completed = res.body;
						done();
					});
			});
			it('should have _id', function(done){
				completed.should.have.property('_id');
				done();
			});
			it('should have docgen url', function(done){
				completed.should.have.property('docgen').startWith(process.env.DOCGEN);
				done();
			});
		});

	});

};