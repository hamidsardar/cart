'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('chargeback', function() {

	describe('homepage', function() {

		beforeEach(function() {
			browser.get('/');
		});

		it('should render home when user navigates to /', function() {
			expect(element.all(by.css('[ui-view] h3')).first().getText()).
			toMatch(/Homepage/);
		});

	});

	describe('login', function() {

		beforeEach(function() {
			browser.get('/login');
		});

		it('should render login when user navigates to /login', function() {
			expect(element.all(by.css('[ui-view] h2')).first().getText()).
			toMatch(/Login/);
		});

	});

});