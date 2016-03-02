

describe('forgot module', function() {

	var ForgotService, $window, locationProvider, scope, $httpBackend;

	beforeEach(module("my.templates")); 

	beforeEach(function(){
	    module('forgot', function($locationProvider) {
	    	locationProvider = $locationProvider;
	    	$locationProvider.html5Mode(true);
	    });
	});

	beforeEach(inject(function($injector, _$window_) {
		
		$window = _$window_;
		delete $window.sessionStorage.token;	// have to clear this out, oddly stays persistent

		$httpBackend = $injector.get('$httpBackend'); 
		var Service = $injector.get('ForgotService');
		ForgotService = new Service();
		
		
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe('forgot router', function(){
		it('test forgot url', inject(function ($state) {
			expect($state.href("forgot")).toEqual("/forgot");
		}));
	});

	describe('forgot controller', function(){
		it('should instantiate', inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
			var ctrl = $controller('ForgotController', { $scope: scope });
			expect(scope.data).toBeDefined();
			expect(scope.errors).toBeDefined();
		}));
	});

	describe('ForgotService', function() {
		
		describe('instantiate', function() {
			it('should have post function', function() {
				expect(ForgotService.post).toBeDefined();
				expect(angular.isFunction(ForgotService.post)).toEqual(true);
			});
		});
		
		describe('ForgotService call forgot', function() {
			it('should post', function() {
				$httpBackend.expectPOST('/api/v1/forgot')
					.respond(200, { 'success': true }, {});
				ForgotService.post().then(function(data) {
					expect(ForgotService.success).toBe(true);
				},function(err) {
					expect(ForgotService.success).toBe(true);
				});
				$httpBackend.flush();
			});
		});
			
	});

});