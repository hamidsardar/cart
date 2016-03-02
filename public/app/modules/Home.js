(function() {

	angular.module('home', ['ui.router'])
	
	.config(['$stateProvider', function( $stateProvider ) {
		
		$stateProvider.state('/', {
			url: '/',
			controller: 'HomeController',
			templateUrl: '/app/templates/home.html'
		});

	}])

	.controller('HomeController', ['$scope', function($scope) {
		var name = window.location.hostname.split(".").join("_");
		if(name == "localhost") {
			name = "cart_chargeback_com";
		}
		$scope.jumbotron = "'/app/templates/" + name + ".html'";
		
	}]);

})();