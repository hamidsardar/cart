(function() {

	angular.module('dashboard', ['ui.router'])
	
	.config(['$stateProvider', function( $stateProvider ) {
		
		$stateProvider
		.state('dashboard', {
			url: '/admin/dashboard',
			templateUrl: '/admin/templates/dashboard.html',
			requiresAuth: true,
			controller: 'DashboardController'
		})
		.state('cartdashboard', {
			url: '/dashboard',
			controller: [ '$scope', function($scope) {
					window.location = "/dashboard";
			}]
		});	
	}])

	.controller('DashboardController', [ '$scope', 'DashboardService', 'CsvAlertService', function($scope, DashboardService, CsvAlertService) {
		$scope.dbs = new DashboardService();
	
		if (CsvAlertService.hasAlert()) {
			$scope.showSuccessAlert = true;
		  $scope.success = CsvAlertService.getSuccess();
		  $scope.cb_total = CsvAlertService.getTotal();
		  CsvAlertService.reset();
		}			
	}])

	.factory('DashboardService', ['$http', '$timeout', function ($http, $timeout) {
			
		var DashboardService = function() {
			
		};

		return DashboardService;

	}]);

})();