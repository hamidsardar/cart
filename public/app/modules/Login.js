(function() {

	angular.module('login', ['ui.router', 'user'])
	
	.constant('AUTH_EVENTS', {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	})

	.config(['$stateProvider', function( $stateProvider ) {
		
		$stateProvider
		.state('login', {
			url: '/login',
			controller: 'LoginController',
			templateUrl: '/app/templates/login.html'
		})
		.state('logout', {
			url: '/logout',
			controller: 'LogoutController'
		});
	}])
	
	.controller('LogoutController', ['$state', '$rootScope', 'AUTH_EVENTS', function($state, $rootScope, AUTH_EVENTS) {
		$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
		$state.go('login');
	}])

	.controller('LoginController', 
		[ '$scope', '$rootScope', 'AUTH_EVENTS', 'UserService', '$state', '$window', '$timeout','UtilService',
		function ($scope, $rootScope, AUTH_EVENTS, UserService, $state, $window, $timeout, UtilService) {
		
		$scope.credentials = {};
		$scope.errors = {};

		// watch for changes to clear out errors
		$scope.$watch("credentials", function(newValue, oldValue){
			$scope.errors = {};
			$scope.$broadcast('show-errors-reset');
			var popups = document.querySelectorAll('.popover');
			_.each(popups, function(p) { p.remove(); });
		},true);


		$scope.clearErrors = function(credentials){
			$timeout(function () {
				if ($scope.errors.username) {
					$scope.credentials.username = "";
				}
				if ($scope.errors.password) {
					$scope.credentials.password = "";
				}
			}, 2000);
		};

		$scope.login = function(credentials) {
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.loginForm.$valid) {
				$scope.loginService = UserService.login(credentials).then(function (user) {
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					$scope.credentials = {};
					var dest = 'dashboard';
					$state.go(dest);
				}, function (res) {
					$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
					$scope.errors = UtilService.formatErrors(res.data);

				});

			}

		};


		if (UserService.isAuthenticated()) {
			var dest = 'dashboard';
			return $state.go(dest);
		}

	}])

	
	// check routes every time they change for authorized state
	.run(
		['$rootScope', 'AUTH_EVENTS', 'UserService', '$state',
		function ($rootScope, AUTH_EVENTS, UserService, $state) {
		
		$rootScope.$on('$stateChangeStart', function (event, next) {
			if (next.requiresAuth && !UserService.isAuthenticated()) {
				event.preventDefault();
				$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
			}
		});
		
		// listen for logout or session expirations and send to login page.
		$rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
			//@TODO: could include login in popup to prevent abrupt redirect
			UserService.logout();
			$rootScope.currentUser = null;	// get rid of user state (navigation)
			$state.go('login');
		});

		$rootScope.$on(AUTH_EVENTS.sessionTimeout, function() {
			//@TODO: could include login in popup to prevent abrupt redirect
			UserService.logout();
			$state.go('login');
		});

	}])


	.factory('AuthInterceptor', ['$rootScope', '$window', '$q', '$injector', 'AUTH_EVENTS', function ($rootScope, $window, $q, $injector, AUTH_EVENTS) {
		return {
			request: function (config) {
				config.headers = config.headers || {};
				if ($window.sessionStorage.token) {
					config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
				}
				return config;
			},
			responseError: function (response) { 
				$rootScope.$broadcast({
					401: AUTH_EVENTS.notAuthenticated,
					403: AUTH_EVENTS.notAuthorized,
					419: AUTH_EVENTS.sessionTimeout,
					440: AUTH_EVENTS.sessionTimeout
				}[response.status], response);
				return $q.reject(response);
			}
		};
	}])

	// look for any API requests that return 401, 403, 419, or 440 and broadcast appropriately
	.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('AuthInterceptor');
	}]);

})();
