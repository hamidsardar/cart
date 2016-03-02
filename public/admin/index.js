(function() {

	var app = angular.module('app', [ 
		"ui.router", 
		"ui.bootstrap", 
		"ui.bootstrap.showErrors", 
		"angular.filter",
		"angulartics",
		"angulartics.google.analytics",
		"cgBusy",
		"utils",
		"user",
		"login",
		"dashboard",
		"csvupload",
		"users",
		"home"
	])

	.config(['$locationProvider', '$urlRouterProvider', 'datepickerPopupConfig', function( $locationProvider, $urlRouterProvider, $datepickerPopupConfig) {
		$locationProvider.html5Mode(true).hashPrefix('!');
		$datepickerPopupConfig.appendToBody = true;
	}])

	.directive('nav', function() {
		return {
			restrict: 'E',
			controller: 'ApplicationController',
			controllerAs: 'appCtrl',
			templateUrl: '/admin/templates/nav.html'
		};
	})

	.controller('ApplicationController', 
		['$scope', '$rootScope', '$state', 'AUTH_EVENTS', 'UserService',
		function ($scope, $rootScope, $state, AUTH_EVENTS, UserService) {

			var cloudFrontUrl = "https://dksl2s5vm2cnl.cloudfront.net/whitelabel/";
			// Get the parts of the host name.
			var domain_ll = window.location.hostname.split(".");
			// Default logo name
			var logoname = "cart_chargeback_com";
			var logo_url = "";
			var css_url = "";
			// If cart dev, treat as if it is cart for retrieving the logo.
			if( domain_ll[0] === 'cartdev') {
				domain_ll[0] = 'cart';
			}

			// Is this a cart domain, ie. cart.chargeback.com or cart.processingspecialists.com
			if( domain_ll[0] === 'cart' ) {
				// Combine the host name parts with underscores.
				logoname = domain_ll.join("_");
			} else {
				//use just the domain as the file name.
				logoname = domain_ll[0];
			}
			// Make sure it's not local host.
			logoname = logoname !== "localhost" ? logoname : "cart_chargeback_com";

			if(domain_ll[1] === 'localhost') {
				logo_url = "/images/" + logoname + '.png';
				css_url = "/css/"+ logoname + ".css";
			} else {
				logo_url = cloudFrontUrl + "images/" + logoname + '.png';
				css_url = cloudFrontUrl + "css/" + logoname + ".css";
			}

			$scope.$state = $state;	// for navigation active to work
			$scope.isCollapsed = true;
			$scope.settings = {};
			$scope.settings.logo = logo_url;
			$scope.settings.whitelabelcss = css_url;

			$scope.$state = $state;	// for navigation active to work
			$scope.isCollapsed = true;

			if (UserService.isAuthenticated()) {
				var user = UserService.getCurrentUser();
				// immediate auth error
				if (!user) {
					return UserService.logout();
				}
				$scope.currentUser = user;
			}

			$scope.runFS = function(FS) {
				if ($scope.currentUser) {
					FS.identify($scope.currentUser._id, {
						displayName: $scope.currentUser.name,
						email: $scope.currentUser.email,
						pageType: 'Admin'
					});
				}
			};

			$rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
				$scope.currentUser = UserService.getCurrentUser();
			});
			
			
		
    }]);
	
})();