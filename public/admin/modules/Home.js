(function() {

	angular.module('home', ['ui.router'])
	
	.config(['$stateProvider', function( $stateProvider ) {
		
		$stateProvider.state('home', {
			url: '/admin',
			controller: 'HomeController',
			templateUrl: '/admin/templates/home.html'
		})
		.state('home-s', {
			url: '/admin/',
			controller: 'HomeController',
			templateUrl: '/admin/templates/home.html'
		});

	}])

	.controller('HomeController', [ "$scope", function($scope) {
		
		$scope.goHome = function() {
			window.location = "/";
		};

	}]);

})();