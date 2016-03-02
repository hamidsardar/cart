

describe('graphing directive', function() {

	var UserService, AUTH_EVENTS, $window, locationProvider, scope, $httpBackend;

	beforeEach(module("my.templates")); 

	beforeEach(function(){
	    module('login', function($locationProvider) {
	    	locationProvider = $locationProvider;
	    	$locationProvider.html5Mode(true);
	    });
	});

	beforeEach(module("graphing"));
	
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

	
	describe('directive: graphing', function() {
		var element, scope;

		beforeEach(inject(function($rootScope, $compile, $controller) {
			
			var token = 'authed';
			UserService.setToken(token);

			$httpBackend.expectGET('/api/v1/user')
					.respond(200, { '_id': 123456, name: 'test'});

			scope = $rootScope.$new();
			var ctrl = $controller('ReportingController', { $scope: scope });

			$rootScope.g = {"label":"MID: 36501","filtertype":"status","grouptype":"status","data_type":"number","data":[{"name":"Received","val":346},{"name":"Bundled","val":200},{"name":"Waiting","val":479},{"name":"Responded","val":97},{"name":"Accepted","val":382},{"name":"Late","val":412},{"name":"Won","val":239},{"name":"Pre-arb","val":187},{"name":"Presented","val":278},{"name":"Lost","val":209}],"searchField":"MID: 36501"};
			
			var el = '<div class="pie" pie graph-data="{{g}}" ></div>';
			element = $compile(el)(scope);
			scope.$digest();
			$httpBackend.flush();
		}));

		it("should have svg element with 100% width", function() {
			expect(element.find('svg').attr('width')).toBe('100%');
			expect(element.find('svg').attr('height')).toBe('100%');
			//expect(element.find('svg').attr('preserveAspectRatio')).toBe('xMinYMin');
		});

		it("should contain 10 pie pieces", function() {
			//console.log(element.find('svg > g.center_group > text.report-type').text());
			expect(element.find('svg > g.arc > path').length).toEqual(10);
			expect(element.find('svg > g.label_group > line').attr('stroke')).toBe('gray');
			expect(element.find('svg > g.label_group > text.units').length).toBeGreaterThan(1);
			expect(element.find('svg > g.label_group > text.value').length).toBeGreaterThan(1);
			expect(element.find('svg > g.center_group')).toBeDefined();
			expect(element.find('svg > g.center_group > circle')).toBeDefined();
			expect(element.find('svg > g.center_group > text.report-type').text()).toBe('MID: 36501');
			expect(element.find('svg > g.center_group > text.label').text()).toBe('TOTAL');
		});

	});

});