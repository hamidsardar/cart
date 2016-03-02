var assert = require("assert"),
	should = require('should');


module.exports = function(app) {

	describe('Test Card Type Detection',function(){

		var Util = require('../../lib/Util'),
			config = app.settings.config;

		var login = false;
		describe('Amex', function() { 

			var pre = 3787,
				post = 3004,
				type = Util.detectCardType( pre + "11010101" + post );

			it('should be amex', function(done) {
				type.should.be.eql('AMEX');
				done();
			});

		});

		describe('Visa', function() { 
			
			var pre = 4716,
				post = 8396,
				type = Util.detectCardType( pre + "11010101" + post );

			it('should be visa', function(done) {
				type.should.be.eql('VISA');
				done();
			});

		});

		describe('MasterCard', function() { 
			
			var pre = 5255,
				post = 1729,
				type = Util.detectCardType( pre + "11010101" + post );

			it('should be MASTERCARD', function(done) {
				type.should.be.eql('MASTERCARD');
				done();
			});

		});

		describe('Discover', function() { 
			
			var pre = 6011,
				post = 5303,
				type = Util.detectCardType( pre + "11010101" + post );

			it('should be discover', function(done) {
				type.should.be.eql('DISCOVER');
				done();
			});

		});

		//describe('MAESTRO', function() {
		//
		//	var pre = 5020,
		//		post = 0785,
		//		type = Util.detectCardType( pre + "11010101" + post );
        //
		//	it('should be Maestro', function(done) {
		//		type.should.be.eql('MAESTRO');
		//		done();
		//	});
        //
		//});
        //
		//describe('Diners Club', function() {
		//
		//	var pre = 3646,
		//		post = 6671,
		//		type = Util.detectCardType( pre + "11010101" + post );
        //
		//	it('should be Diners Club ', function(done) {
		//		type.should.be.eql('DINERS');
		//		done();
		//	});
        //
		//});
        //
		//describe('Diners Club - US', function() {
		//	// On November 8, 2004, MasterCard and Diners Club formed an alliance. Diners Club cards issued in Canada and the United States start with 54 or 55 and are treated as MasterCards worldwide
		//	var pre = 5561,
		//		post = 7551,
		//		type = Util.detectCardType( pre + "11010101" + post );
        //
		//	it('should be mastercard', function(done) {
		//		type.should.be.eql('MASTERCARD');
		//		done();
		//	});
        //
		//});

	});

};