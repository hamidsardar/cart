
module.exports = function(app) {

	var User = app.Models.get('User'),
		Chargeback = app.Models.get('Chargeback');

	// start tests
	describe('Clear Database',function(){

		describe('User.remove()',function(){
			it('should remove without error', function(done){

				User.remove({}, function(err) {
					if (err) { throw err; }
					done();
				});
			
			});
		});

		describe('Chargeback.remove()',function(){
			it('should remove without error', function(done){

				Chargeback.remove({}, function(err) {
					if (err) { throw err; }
					done();
				});
			
			});
		});

	});

};