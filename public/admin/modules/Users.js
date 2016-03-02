(function() {

	angular.module('users', ['ui.router', 'ngAnimate', 'infinite-scroll', 'user'])
	
	.config(['$stateProvider', function( $stateProvider ) {
		
		$stateProvider.state('users', {
			url: '/admin/users',
			templateUrl: '/admin/templates/users.html',
			requiresAuth: true,
			controller: 'UsersController'
		});
	
	}])

	.controller('UsersController', ['$scope', '$timeout', 'UserService', 'UsersService', 'UsersAdminService', '$state', '$location', function($scope, $timeout, UserService, UsersService, UsersAdminService, $state, $location) {
		
		$scope.users = new UsersService();	
		$scope.usersAdmin = new UsersAdminService();
		$scope.load_start = false;
		$scope.load_end = false;
		$scope.admin = false;

		var getAdminStatus = function(){		
			var cu = UserService.getCurrentUser();		
			if (cu.admin === true){		
				$scope.admin = true;		
			} else {		
				$scope.admin = false;		
			}		
		};		
		
		getAdminStatus();

		$scope.login = function(username) {
			UserService.alogin({'username':username}).then(function (user) {
				window.location = "/dashboard";
			}, function (res) {
			});
		};

	}])

	.factory('UsersService', ['$http', '$timeout', '$state', '$window', function ($http, $timeout, $state, $window) {
		
		var UsersService = function() {
			this.data = [];
			this.busy = false;
			this.done = false;
			this.page = 1;
			this.query = '';
			this.lastQuery = '';
			this.filterTextTimeout = false;
			this.loaded = false;
		};

		UsersService.prototype.clear = function() {
			// reset
			this.page = 1;
			this.data = [];
			this.query = "";
			this.loaded = false;
			this.last_page = false;
			return;
		};
		

		UsersService.prototype.clearAndRun = function(q) {
			// reset
			this.page = 1;
			this.data = [];
			this.query = (q || (this.lastQuery || ""));
			this.loaded = false;
			this.last_page = false;
			this.nextPage();
			return;
		};
		

		UsersService.prototype.search = function(query) {
			var _this = this;
			
			query = query.trim();

			// min query length is 2 chars
			if (query.length <= 1) {
				if (!this.lastQuery) { return; }	// we've already reset, don't do it again.
				// reset
				this.page = 1;
				this.data = [];
    			this.query = "";
    			this.loaded = false;
    			this.last_page = false;
    			this.lastQuery = this.query;
				this.nextPage();
				return;
			}

			// prevent dupes
			if (this.lastQuery == query) {
				return;
			}

			if (this.filterTextTimeout) {
				$timeout.cancel(this.filterTextTimeout);
			}
			this.filterTextTimeout = $timeout(function() {
				_this.clearAndRun(query);
			}, 600);
    	};

		UsersService.prototype.nextPage = function(download) {
			if (this.busy) { return; }
			this.busy = true;
    		var _this = this;


			if (this.query && this.lastQuery != this.query) {
    			// new query, reset list
    			this.page = 1;
    			this.data = [];
    			this.lastQuery = this.query;
    		}
    		
    		var url = '/api/v1/users?page=' + this.page;
    		url += '&query=' + this.query;
    		
    		// additional params such as start, end, cctype, merchanct, etc
    		if ($state.params) {
    			_.each(_.keys($state.params), function(k) {
    				if ($state.params[k]) {
    					url += '&' + k + '=' + $state.params[k];
    				}
    			});
    		}

    		if (this.page == this.last_page) {
    			this.busy = false;
    			return;
    		}

    		console.log('nextPage');
    		console.log('\tQuery: ' + this.query);
    		console.log('\tLast: ' + this.lastQuery);
    		console.log('\tPage: ' + this.page);
    		console.log('\tLast Page: ' + this.last_page);

    		$http.get(url)
			.success(function (rows) {
				_this.loaded = true;
				var new_data = rows;
				
				_.each(new_data, function(d) {
					_this.data.push(d);
				});

				_this.last_page = _this.page;
				if (rows.length == 30) {
					_this.page++;
				}
				
				$timeout(function() {
					_this.busy = false;
				},50);
			});
		};

		return UsersService;

	}])

	.factory('UsersAdminService', ['$http', '$timeout', '$state', '$window', function ($http, $timeout, $state, $window) {
		
		var UsersAdminService = function() {
			this.data = [];
			this.busy = false;
			this.done = false;
			this.page = 1;
			this.query = '';
			this.lastQuery = '';
			this.filterTextTimeout = false;
			this.loaded = false;
		};

		UsersAdminService.prototype.clear = function() {
			// reset
			this.page = 1;
			this.data = [];
			this.query = "";
			this.loaded = false;
			this.last_page = false;
			return;
		};
		

		UsersAdminService.prototype.clearAndRun = function(q) {
			// reset
			this.page = 1;
			this.data = [];
			this.query = (q || (this.lastQuery || ""));
			this.loaded = false;
			this.last_page = false;
			this.nextPageAdmin();
			return;
		};
		

		UsersAdminService.prototype.search = function(query) {
			var _this = this;
			
			query = query.trim();

			// min query length is 2 chars
			if (query.length <= 1) {
				if (!this.lastQuery) { return; }	// we've already reset, don't do it again.
				// reset
				this.page = 1;
				this.data = [];
    			this.query = "";
    			this.loaded = false;
    			this.last_page = false;
    			this.lastQuery = this.query;
				this.nextPageAdmin();
				return;
			}

			// prevent dupes
			if (this.lastQuery == query) {
				return;
			}

			if (this.filterTextTimeout) {
				$timeout.cancel(this.filterTextTimeout);
			}
			this.filterTextTimeout = $timeout(function() {
				_this.clearAndRun(query);
			}, 600);
    	};

		UsersAdminService.prototype.nextPageAdmin = function(download) {
			if (this.busy) { return; }
			this.busy = true;
    		var _this = this;


			if (this.query && this.lastQuery != this.query) {
    			// new query, reset list
    			this.page = 1;
    			this.data = [];
    			this.lastQuery = this.query;
    		}
    		
    		var url = '/api/v2/users?page=' + this.page;
    		url += '&query=' + this.query;
    		
    		// additional params such as start, end, cctype, merchanct, etc
    		if ($state.params) {
    			_.each(_.keys($state.params), function(k) {
    				if ($state.params[k]) {
    					url += '&' + k + '=' + $state.params[k];
    				}
    			});
    		}

    		if (this.page == this.last_page) {
    			this.busy = false;
    			return;
    		}

    		console.log('nextPage');
    		console.log('\tQuery: ' + this.query);
    		console.log('\tLast: ' + this.lastQuery);
    		console.log('\tPage: ' + this.page);
    		console.log('\tLast Page: ' + this.last_page);

    		$http.get(url)
			.success(function (rows) {
				_this.loaded = true;
				var new_data = rows;
				
				_.each(new_data, function(d) {
					_this.data.push(d);
				});

				_this.last_page = _this.page;
				if (rows.length == 30) {
					_this.page++;
				}
				
				$timeout(function() {
					_this.busy = false;
				},50);
			});
		};

		return UsersAdminService;

	}]);
})();