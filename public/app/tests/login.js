

describe('login module', function() {

	var UserService, AUTH_EVENTS, locationProvider, scope, $window, $httpBackend, authRequestHandler;

	beforeEach(module("my.templates")); 
	beforeEach(module("user")); 
	
	beforeEach(function(){
		module('login', function($locationProvider) {
			locationProvider = $locationProvider;
			$locationProvider.html5Mode(true);
		});
	});

	beforeEach(inject(function($injector, _$window_) {
		
		$window = _$window_;

		$httpBackend = $injector.get('$httpBackend'); 
		AUTH_EVENTS = $injector.get('AUTH_EVENTS');

		UserService = $injector.get('UserService');
		UserService.logout();
		
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});



	describe('login router', function(){
		it('test login url', inject(function ($state) {
			expect($state.href("login")).toEqual("/login");
		}));
		it('test logout url', inject(function ($state) {
			expect($state.href("logout")).toEqual("/logout");
		}));
		it('test misc url', inject(function ($state) {
			expect($state.href("jgs")).toBeNull();
		}));
	});

	describe('login controller', function(){

		it('should instantiate', inject(function($rootScope, $controller) {
			
			scope = $rootScope.$new();
			var ctrl = $controller('LoginController', { $scope: scope });
			
			expect(scope.login).toBeDefined();
			expect(scope.credentials).toBeDefined();
			expect(scope.errors).toBeDefined();
		
		}));

	});

	describe('Token Header Injection', function() {
		
		it('should have Authorization token in hearder', function() {
			var token = "token_to_pass_in_header";
			UserService.setToken(token);
			
			$httpBackend.when('GET', '/api/v1/user', null, function(headers) {
				expect(headers.Authorization).toBe(token);
			}).respond(200, {});
		});

		it('should NOT have Authorization token in hearder', function() {
			UserService.logout();
			$httpBackend.when('GET', '/api/v1/user', null, function(headers) {
				expect(config.headers['Authorization']).toBe(undefined);
			}).respond(200, {});
		});

	});


});