

describe('reporting module', function() {

	var ReportingService, UserService, AUTH_EVENTS, $window, locationProvider, scope, $httpBackend;

	beforeEach(module("my.templates")); 

	beforeEach(function(){
	    module('login', function($locationProvider) {
	    	locationProvider = $locationProvider;
	    	$locationProvider.html5Mode(true);
	    });
	});

	beforeEach(module("reporting")); 

	beforeEach(inject(function($injector, _$window_) {
		
		$window = _$window_;
		delete $window.sessionStorage.token;	// have to clear this out, oddly stays persistent

		$httpBackend = $injector.get('$httpBackend'); 
		AUTH_EVENTS = $injector.get('AUTH_EVENTS');

		UserService = $injector.get('UserService');
		UserService.logout();

		ReportingService = $injector.get('ReportingService');
		
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe('reporting router', function(){
		
		
	});

	describe('reporting controller', function(){
		it('should instantiate', inject(function($rootScope, $controller) {
			
			var token = 'authed';
			UserService.setToken(token);
			
			$httpBackend.expectGET('/api/v1/user')
					.respond(200, { '_id': 123456, name: 'test'});

			scope = $rootScope.$new();
			var ctrl = $controller('ReportingController', { $scope: scope });
			expect(scope.data).toBeDefined();
			expect(angular.isFunction(scope.setSelected)).toEqual(true);
			expect(angular.isFunction(scope.setMerchant)).toEqual(true);
			expect(angular.isFunction(scope.getReports)).toEqual(true);
			expect(angular.isFunction(scope.getStatusData)).toEqual(true);
			expect(angular.isFunction(scope.getProcessorStatusData)).toEqual(true);
			expect(angular.isFunction(scope.getMidStatusData)).toEqual(true);
			expect(angular.isFunction(scope.getTypeData)).toEqual(true);
			expect(angular.isFunction(scope.getProcessorTypeData)).toEqual(true);
			expect(angular.isFunction(scope.getMidTypeData)).toEqual(true);
			expect(angular.isFunction(scope.clearOtherData)).toEqual(true);
			$httpBackend.flush();
		}));
	});

	describe('ReportingService', function() {
		
		describe('instantiate', function() {
			it('should have get function', function() {
				expect(ReportingService.getReports).toBeDefined();
				expect(angular.isFunction(ReportingService.getReports)).toEqual(true);
			});
		});
		
		describe('ReportingService function calls', function() {
			
			beforeEach(function() {
				var token = 'authed';
				UserService.setToken(token);

				ReportingService.setDates({
					start: {
						val: 1234,
						opened: false
					},
					end: {
						val: 1234,
						opened: false
					}
				});
				var merchants = [{
					name: 'Merch A',
					mids: [{
						mid: "123234345"
					},{
						mid: "23423454545456456"
					},{
						mid: "098098230458345"
					}

					]
				},{
					name: 'Merch B',
					mids: [{
						mid: "123245"
					},{
						mid: "20000005456456"
					},{
						mid: "0978787830458345"
					}

					]
				}];
				ReportingService.setMerchants(merchants);
				ReportingService.setMerchant( 0 );

			});

			it('getReports', function() {
				
				$httpBackend.expectGET('/api/v1/dashboard')
					.respond(200, { '_id': 123456, name: 'test'});

				ReportingService.getReports().then(function(data) {
					expect(data._id).toEqual(123456);
				},function(err) {
					expect(data._id).toEqual(123456);
				});
				$httpBackend.flush();
			});
			it('getStatusData', function() {
				$httpBackend.expectGET(/\/api\/v1\/report\/status?.*$/)
					.respond(200, { '_id': 123456, name: 'test'});

				ReportingService.getStatusData().then(function(data) {
					expect(data.data._id).toEqual(123456);
				},function(err) {
					expect(data.data._id).toEqual(123456);
				});
				$httpBackend.flush();
			});
			it('getMidStatusData', function() {
				$httpBackend.expectGET(/\/api\/v1\/report\/midStatus\?.*$/)
					.respond(200, { '_id': 123456, name: 'test'});

				ReportingService.getMidStatusData().then(function(data) {
					expect(data.data._id).toEqual(123456);
				},function(err) {
					expect(data.data._id).toEqual(123456);
				});
				$httpBackend.flush();
			});
			it('getTypeData', function() {
				$httpBackend.expectGET(/\/api\/v1\/report\/cctypes\?.*$/)
					.respond(200, { 'byCount': 123456, 'byVolume': 123456});

				ReportingService.getTypeData().then(function(data) {
					expect(data.data.byCount).toEqual(123456);
				},function(err) {
					expect(data.data._id).toEqual(123456);
				});
				$httpBackend.flush();
			});
			it('getMidTypeData', function() {
				$httpBackend.expectGET(/\/api\/v1\/report\/midTypes\?.*$/)
					.respond(200, { '_id': 123456, name: 'test'});

				ReportingService.getMidTypeData().then(function(data) {
					expect(data.data._id).toEqual(123456);
				},function(err) {
					expect(data.data._id).toEqual(123456);
				});
				$httpBackend.flush();
			});
		});
			
	});

});