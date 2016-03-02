(function() {

	angular.module('reset', ['ui.router'])
	
	.config(['$stateProvider', function( $stateProvider ) {
		
		$stateProvider.state('reset', {
			url: '/reset/{_id}',
			controller: 'ResetController',
			templateUrl: '/app/templates/reset.html',
			resolve: {
				res: ['$http', '$rootScope', '$stateParams', 'ResetService', function($http, $rootScope, $stateParams, ResetService){
					var s = new ResetService();
					return s.get($stateParams._id).then(function(res) {
						$rootScope.data = res.data;
					},function(res) {
						$rootScope.link_error = true;
					});
				}]
			}
		});

	}])

	.controller('ResetController', ['$scope', '$state', 'res', 'ResetService', 'UtilService', function($scope, $state, res, ResetService, UtilService) {

		$scope.service = new ResetService();
		$scope.errors = {};
		
		// watch for changes to clear out errors
		$scope.$watch("data", function(newValue, oldValue){
			$scope.errors = {};
			$scope.$broadcast('show-errors-reset');	
			var popups = document.querySelectorAll('.popover');
			_.each(popups, function(p) { p.remove(); });
		},true);


		$scope.reset = function() {
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.resetForm.$valid) {
				$scope.service.post($scope.data)
				.then(function(res) {
					$scope.done = true;
					$scope.data.reset_token = false;
				},function(res) {
					$scope.errors = UtilService.formatErrors(res.data);
				});
			}
		};

	}])

	.factory('ResetService', ['$http', function ($http) {
		
		var ResetService = function() {
			
			this.post = function(d) {
				return $http.post('/api/v1/reset', d);
			};
			this.get = function(id) {
				return $http.get('/api/v1/reset/' + id);
			};

			
		};
 
		return (ResetService);

	}]);

})();