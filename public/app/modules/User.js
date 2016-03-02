(function() {

	angular.module('user', [])
	
	.controller('UserController', [ '$scope', 'UserService', function($scope, UserService) {
		
		$scope.data = null;
		
	}])

	.service('UserService', ['$http', '$window', '$timeout', function ($http, $window, $timeout) {
		
		this.login = function(d) {
			var self = this;
			return $http
				.post('/api/v1/login', d)
				.then(function (res) {
					
					self.setToken(res.data.authtoken);
					self.markTime();
					delete res.data.authtoken;	// don't have token in current user
					if(res.data.parent === undefined) {
						res.data.parent = {name:''};
					}

					// manually set current user (vs additional ajax request)
					self.setUser(res.data);

					return res.data;
				});
		};

		this.alogin = function(d) {
			var self = this;
			return $http
				.post('/api/v1/admin/login', d)
				.then(function (res) {
					
					self.setToken(res.data.authtoken);
					self.markTime();
					delete res.data.authtoken;	// don't have token in current user
					
					// manually set current user (vs additional ajax request)
					self.setUser(res.data);

					return res.data;
				});
		};

		this.getCurrentUser = function(d) {
			
			if (!this.isAuthenticated()) {
				return false;
			}

			if ($window.sessionStorage.user) {
				return JSON.parse($window.sessionStorage.user);
			}

			var self = this;
			return $http
				.get('/api/v1/user')
				.then(function (res) {
					return self.setUser(res.data);
				},function(res) {
					return false;
				});
		};

		this.markTime = function() {
			$window.sessionStorage.lastAction = moment().valueOf();
		};

		this.sessionDuration = function() {
			if (!$window.sessionStorage.lastAction) {
				return ((60 * 60) * 24) * 1000;
			}
			return parseInt(moment().valueOf()) - parseInt($window.sessionStorage.lastAction);
		};
		
		this.refreshSession = function() {
			var top = this;
			$timeout(function() {
				$http
					.get('/api/v1/refresh')
					.then(function (res) {
						top.setToken(res.data.authtoken);
						top.markTime();
						console.log('Session refreshed.');
					},function(res) {
						console.log('Problem refreshing session.');
					});
			},500);
		};

		this.setToken = function(token) {
			$window.sessionStorage.token = token;
			return true;
		};

		this.getToken = function() {
			if ($window.sessionStorage.token) {
				return $window.sessionStorage.token;
			}
			return false;
		};

		this.isAuthenticated = function () {
			if (this.getToken && this.getToken()) {
				return true;
			}
			return false;
    	};

		this.setUser = function(user) {
			$window.sessionStorage.user = JSON.stringify(user);
			return this.user;
		};

		this.logout = function() {
			delete $window.sessionStorage.token;
			delete $window.sessionStorage.user;
			return true;	
		};

		this.getChildren = function() {
			return $http.get('/api/v1/users');
		};

	}]);	

})();