

describe('account module', function() {

	var UserService, AUTH_EVENTS, AccountService, $window, locationProvider, scope, $httpBackend;

	beforeEach(module("my.templates")); 

	beforeEach(function(){
	    module('login', function($locationProvider) {
	    	locationProvider = $locationProvider;
	    	$locationProvider.html5Mode(true);
	    });
	});

	beforeEach(module("account")); 

	beforeEach(inject(function($injector, _$window_) {
		
		$window = _$window_;
		
		$httpBackend = $injector.get('$httpBackend'); 
		
		UserService = $injector.get('UserService');
		UserService.logout();

		AUTH_EVENTS = $injector.get('AUTH_EVENTS');

		AccountService = $injector.get('AccountService');
		
		
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe('account router', function(){
		it('test account url', inject(function ($state) {
			expect($state.href("account")).toEqual("/account");
		}));
	});

	describe('account controller', function(){
		it('should instantiate', inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
			var ctrl = $controller('AccountController', { $scope: scope });
			expect(scope.saved).toBeDefined();
			expect(scope.saved).toBe(false);
			expect(scope.errors).toBeDefined();
		}));
	});

	describe('AccountService', function() {
		
		describe('instantiate', function() {
			it('should have account function', function() {
				expect(AccountService.save).toBeDefined();
				expect(angular.isFunction(AccountService.save)).toEqual(true);
			});
		});
		
		describe('AccountService call save', function() {
			it('should save', function() {
				var token = 'authed';
				$window.sessionStorage.token = token;
				
				// double check auth headers are set
				$httpBackend.when('GET', '/api/v1/user/123456', null, function(headers) {
					expect(headers.Authorization).toBe(token);
	        	}).respond(200, {});

				// test PUT
				$httpBackend.expectPUT('/api/v1/user/123456')
	        		.respond(200, { '_id': 123456, name: 'test'}, {});

				AccountService.save({ _id: 123456, name: 'test' }).then(function(data) {
					expect(data._id).toEqual(123456);
				},function(err) {
					expect(data._id).toEqual(123456);
				});
				$httpBackend.flush();
			});
		});
			
	});

});