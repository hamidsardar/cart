

describe('user module', function() {

	var UserService, scope, $window, $httpBackend, authRequestHandler;

	beforeEach(module("my.templates")); 
	beforeEach(module("user")); 
	
	
	beforeEach(inject(function($injector, _$window_) {
		
		$window = _$window_;

		$httpBackend = $injector.get('$httpBackend'); 
		UserService = $injector.get('UserService');
		UserService.logout();	// clear things out
		
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});



	describe('UserService', function() {
		
		describe('instantiate', function() {
			it('should have login function', function() {
				expect(UserService.login).toBeDefined();
				expect(angular.isFunction(UserService.login)).toEqual(true);
			});
			it('should have logout function', function() {
				expect(UserService.logout).toBeDefined();
				expect(angular.isFunction(UserService.logout)).toEqual(true);
			});
			it('should have getCurrentUser function', function() {
				expect(UserService.getCurrentUser).toBeDefined();
				expect(angular.isFunction(UserService.getCurrentUser)).toEqual(true);
			});
			it('should have getToken function', function() {
				expect(UserService.getToken).toBeDefined();
				expect(angular.isFunction(UserService.getToken)).toEqual(true);
			});
			it('should have setToken function', function() {
				expect(UserService.setToken).toBeDefined();
				expect(angular.isFunction(UserService.setToken)).toEqual(true);
			});
			it('should have isAuthenticated function', function() {
				expect(UserService.isAuthenticated).toBeDefined();
				expect(angular.isFunction(UserService.isAuthenticated)).toEqual(true);
			});
			it('should have setUser function', function() {
				expect(UserService.setUser).toBeDefined();
				expect(angular.isFunction(UserService.setUser)).toEqual(true);
			});
		});

		
		describe('UserService bad login', function() {
			it('should return 401', function() {
				$httpBackend.expectPOST('/api/v1/login')
					.respond(401, {});
				UserService.login().then(function(data) {
					expect(err.status).toEqual(401);
				},function(err, status) {
					expect(err.status).toEqual(401);
				});
				$httpBackend.flush();
			});
		});
			
		describe('UserService valid login', function() {
			it('should login', function() {
				$httpBackend.expectPOST('/api/v1/login')
					.respond(200, { '_id': 1234567890, fname: 'Larry', lname: 'Jounce', authtoken: 'abcdefghi123456789'}, {});
				UserService.login().then(function(data) {
					expect(UserService.getCurrentUser()._id).toEqual(1234567890);
					expect(UserService.getToken()).toEqual('abcdefghi123456789');
				},function(err) {
					expect(UserService.getToken()).toEqual('abcdefghi123456789');
				});
				$httpBackend.flush();
			});
		});
			
	});

});