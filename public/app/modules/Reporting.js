(function() {
	var secretEmptyKey = '[$empty$]';

	angular.module('reporting', ['ui.router', 'ngAnimate', 'graphing', 'user', 'isoCurrency'])
	
	.config(['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ) {
		
		$urlRouterProvider.when('/reporting/status', '/reporting/status/overview');
		$urlRouterProvider.when('/reporting/cctype', '/reporting/cctype/overview');

		$stateProvider
		.state('reporting', {
			url: '/reporting',
			controller: 'ReportingController',
			templateUrl: '/app/templates/reporting.html',
			requiresAuth: true
		})
		.state('reporting.overview', {
			url: '/overview',
			requiresAuth: true,
			templateUrl: '/app/templates/reporting.overview.html',
			controller: [ '$scope', function($scope) {

				$scope.items = ['Top MIDS', 'Frequent Fliers', 'CVV Matches', 'AVS Matches'];
				$scope.filters = ['By Volume', 'By Count'];
				$scope.most = $scope.items[0];
				$scope.filt = $scope.filters[0];

				$scope.render = {
					  midVol: function() {
					    return $scope.most == 'Top MIDS' && $scope.filt == 'By Volume';
					  },
					  midCt: function() {
					    return $scope.most == 'Top MIDS' && $scope.filt == 'By Count';
					  },
					  fliersVol: function() {
					    return $scope.most == 'Frequent Fliers' && $scope.filt == 'By Volume';
					  },
					  fliersCt: function () {
					  	return $scope.most == 'Frequent Fliers' && $scope.filt == 'By Count';
					  },
					  cvvVol: function() {
					    return $scope.most == 'CVV Matches' && $scope.filt == 'By Volume';
					  },
					  cvvCt: function () {
					  	return $scope.most == 'CVV Matches' && $scope.filt == 'By Count';
					  },
					  avsVol: function() {
					    return $scope.most == 'AVS Matches' && $scope.filt == 'By Volume';
					  },
					  avsCt: function () {
					  	return $scope.most == 'AVS Matches' && $scope.filt == 'By Count';
					  }
					  
				};

				$scope.getOverview();
			}]
		})
		.state('reporting.mids', {
			url: '/mids',
			requiresAuth: true,
			templateUrl: '/app/templates/reporting.mids.html'
		})
		.state('reporting.status', {
			url: '/status',
			requiresAuth: true,
			templateUrl: '/app/templates/reporting.status.html'
		})
		.state('reporting.status.overview', {
			url: '/overview',
			requiresAuth: true,
			views: {
				'statusViews': {	
					templateUrl: '/app/templates/reporting.status.overview.html',
					controller: [ '$scope', '$timeout', function($scope, $timeout) {
						$timeout(function() {
							$scope.getStatusData();
						});
					}]
				}
			}
		})
		.state('reporting.status.byProcessor', {
			url: '/byProcessor',
			requiresAuth: true,
			parent: 'reporting.status',
			views: {
				'statusViews': {	
					templateUrl: '/app/templates/reporting.byProcessor.html',
					controller: [ '$scope', '$timeout', function($scope, $timeout) {
						$scope.getProcessorStatusData();
					}]
				}
			}
		})
		.state('reporting.status.byMid', {
			url: '/byMid',
			requiresAuth: true,
			views: {
				'statusViews': {
					templateUrl: '/app/templates/reporting.byMid.html',
					controller: [ '$scope', '$timeout', function($scope, $timeout) {
						$scope.getMidStatusData();
					}]
				}
			}
		})
		.state('reporting.cctype', {
			url: '/cctype',
			requiresAuth: true,
			templateUrl: '/app/templates/reporting.cctype.html'
		})


		.state('reporting.cctype.overview', {
			url: '/overview',
			requiresAuth: true,
			views: {
				'typeViews': {	
					templateUrl: '/app/templates/reporting.cctype.overview.html',
					controller: [ '$scope', '$timeout', function($scope, $timeout) {
						$timeout(function() {
							$scope.getTypeData();
						});
					}]
				}
			}	
		})
		.state('reporting.cctype.byProcessor', {
			url: '/byProcessor',
			requiresAuth: true,
			views: {
				'typeViews': {	
					templateUrl: '/app/templates/reporting.byProcessor.html',
					controller: [ '$scope', '$timeout', function($scope, $timeout) {
						$timeout(function() {
							$scope.getProcessorTypeData();
						});
					}]
				}
			}
		})
		.state('reporting.cctype.byMid', {
			url: '/byMid',
			requiresAuth: true,
			views: {
				'typeViews': {
					templateUrl: '/app/templates/reporting.byMid.html',
					controller: [ '$scope', '$timeout', function($scope, $timeout) {
						$timeout(function() {
							$scope.getMidTypeData();
						});
					}]
				}
			}
		})

		.state('reporting.reasoncode', {
			url: '/reasoncode',
			requiresAuth: true,
			templateUrl: '/app/templates/reporting.reasoncode.html',
			controller: [ '$scope', '$timeout', function($scope, $timeout) {
						$timeout(function() {
							$scope.getReasonCodeData();
						});
			}]
		})
		.state('reporting.billing', {
			url: '/billing',
			requiresAuth: true,
			templateUrl: '/app/templates/reporting.billing.html',
			controller: [ '$http', '$scope', '$stateParams', 'ReportingService', function($http, $scope, $stateParams, ReportingService){
				$scope.loaded = false;
				$scope.billing = [];
				ReportingService.getBilling().then(function(res) {
					$scope.loaded = true;
					var d = _.sortBy(res.data, function(n) {
						mon = n.month_num.toString();
						if (n.month_num < 10) {
							mon = "0" + mon;
						}
						if (n.half == "a") {
							mon += "1";
						} else {
							mon += "2";
						}
						return n.year + mon;
					});
					$scope.billing = d.reverse();
				});
			}]
		});
	
	}])
	
	.controller('ReportingController',
		['$scope', '$rootScope', 'ReportingService', '$state', '$timeout', 'UserService',
		function($scope, $rootScope, ReportingService, $state, $timeout, UserService) {
		//$scope.data = res.data;
		$scope.data = null;
		$scope.last = null;
		$scope.$state = $state;	// for navigation active to work	
		$scope.winloss = {};
		$scope.active = 'count';
		$scope.currency = "USD";
		
        $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
        };

        $scope.dateOptions = {
                showWeeks:'false'
        };

		// hack to fix auto activation of first tab
		if ($state.current.url != "/overview") {
			setTimeout(function() {
				angular.element(document.querySelectorAll('.nav-tabs li')[0]).removeClass('active');
			},50);
		}
		

		$scope.graphstatus1 = {};
		$scope.graphstatus2 = {};
		$scope.graphtype1 = {};
		$scope.graphtype2 = {};
		$scope.graphBarHistory = {};
		$scope.graphBarReasons = {};
		$scope.graphBarReasons2 = {};
		

		$scope.$emit.date = {
			start: {
				val: moment().utc().subtract($scope.daterange, 'month').format(),
				opened: false
			},
			end: {
				val: moment().utc().format(),
				opened: false
			}
		};

		
		ReportingService.setDates($scope.date);

		
		$scope.$watch("date.start.val", function(newValue, oldValue){
			//@TODO: alert location for history option, like chargeback list
			if (newValue == oldValue) { return; }
			ReportingService.setDates($scope.date);
			if ($scope.last) {
				$scope[$scope.last]();
			}
		});
		$scope.$watch("date.end.val", function(newValue, oldValue){
			//@TODO: alert location for history option, like chargeback list
			if (newValue == oldValue) { return; }
			ReportingService.setDates($scope.date);
			if ($scope.last) {
				$scope[$scope.last]();
			}
		});
		
		
		// go full screen inside reporting
		angular.element('#pages').removeClass("container");

		
		var all = {'_id': '', 'name': '- All'};
		$scope.selectedMerchant = all;
		$scope.cu = UserService.getCurrentUser();
		$scope.merchants = [all];
		UserService.getChildren().then(function(res) {
			var current = all;
			_.each(res.data, function(m) {
				var parent = m.parent_id;
				var child = m._id;
				
				if (m.parent !== m.child) {
				$scope.merchants.push({ '_id': m._id , 'name': '- ' + m.name });
				}
				
				if (m._id == ReportingService.getMerchant()) {
				current = { '_id': m._id , 'name': '- ' + m.name };
				}		
			});

			// default is first 
			ReportingService.setMerchant( (ReportingService.getMerchant() || $scope.merchants[0]._id) );
			$scope.selectedMerchant = current;
		});	
		
		
		// ng-change will call setMerchant
		$scope.setMerchant = function(m) {
			$scope.selectedMerchant = _.find($scope.merchants, function(merch) {
				return merch.name == m.name;
			});
			ReportingService.setMerchant(m._id);
			
			if (m._id != $scope.last_merchant_id) {
				$scope[$scope.last]();
			}
			$scope.last_merchant_id = m._id;
		};

		//for toggling reason code graph buttons
		$scope.animateButton = function(name) { $scope.active = name; };

		$scope.getOverview = function() {
			$scope.last = 'getOverview';
			ReportingService.getDashboard().then(function(res) {
				$scope.data = res;
				if ($scope.data.hwl) {
					$timeout(function() {
						$scope.winloss.update($scope.data.winloss);		
					},150);
				}	
			});
			$timeout(function() {
				ReportingService.getHistory().then(function(res) {
					$scope.graphBarHistory.update(res.data);
				});	
			},50);
		};

		
		$scope.getStatusData = function() {
			$scope.last = 'getStatusData';
			ReportingService.getStatusData().then(function(res) {
				$scope.graphstatus1.update(res.data.byCount);
				$scope.graphstatus2.update(res.data.byVolume);
			});
		};

		$scope.getProcessorStatusData = function() {
			$scope.last = 'getProcessorStatusData';
			ReportingService.getProcessorStatusData().then(function(res) {
				$scope.processorData = res.data;
			});
		};

		$scope.getMidStatusData = function() {
			$scope.last = 'getMidStatusData';
			ReportingService.getMidStatusData().then(function(res) {
				$scope.midData = res.data;
			});
		};

		$scope.getTypeData = function() {
			$scope.last = 'getTypeData';
			ReportingService.getTypeData().then(function(res) {
				$scope.graphtype1.update(res.data.byCount);
				$scope.graphtype2.update(res.data.byVolume);
			});
		};

		$scope.getProcessorTypeData = function() {
			$scope.last = 'getProcessorTypeData';
			ReportingService.getProcessorTypeData().then(function(res) {
				$scope.processorData = res.data;
			});
		};

		$scope.getReasonCodeData = function() {
			$scope.last = 'getReasonCodeData';
			ReportingService.getReasonCodeData().then(function(res) {
					$scope.graphBarReasons.update(res.data.byCount);
					$scope.graphBarReasons2.update(res.data.byVolume);
			});
		};

		$scope.getMidTypeData = function() {
			$scope.last = 'getMidTypeData';
			ReportingService.getMidTypeData().then(function(res) {
				$scope.midData = res.data;
			});
		};

		$scope.showList = function() {
			var ngModelCtrl = angular.element('input').controller('ngModel');
        	ngModelCtrl.$setViewValue(' ');
		};
		
	}])
	
	.factory('ReportingService', ['$http', '$window', function ($http, $window) {
		var reportingService = {};

		var start, end, merchant, merchants;
		reportingService.setDates = function(d){
			start = moment(d.start.val).valueOf();
			end = moment(d.end.val).valueOf();
		};

		reportingService.getDates = function(){
			return {
				start: start,
				end: end
			};
		};
		
		reportingService.setMerchant = function(m){
			merchant = m;	// store merchant for easier ref below.
			$window.sessionStorage.merchant = merchant;
			return merchant;
		};

		reportingService.getMerchant = function(){
			if ($window.sessionStorage.merchant) {
				return $window.sessionStorage.merchant;
			} else {
				return '';
			}
		};

		reportingService.getDashboard = function() {
			return $http
			.get('/api/v1/dashboard?user=' + reportingService.getMerchant() + "&start=" + start + "&end=" + end)
			.then(function (res) {
				res.data.hwl = true;
				if (_.isNaN(res.data.winloss.won / res.data.winloss.count)) {
					res.data.hwl = false;
				}
				return res.data;
			});
		};

		reportingService.getBilling = function() {
			return $http.get('/api/v1/billing');
		};

		reportingService.getHistory = function() {
			return $http.get('/api/v1/history?start=' + start + "&end=" + end + '&user=' + reportingService.getMerchant() );
		};

		reportingService.getStatusData = function() {
			return $http.get('/api/v1/report/status?start=' + start + "&end=" + end + '&user=' + reportingService.getMerchant()  );
		};

		reportingService.getMidStatusData = function() {
			return $http.get('/api/v1/report/midStatus?start=' + start + "&end=" + end + '&user=' + reportingService.getMerchant() );
		};

		reportingService.getTypeData = function() {
			return $http.get('/api/v1/report/cctypes?start=' + start + "&end=" + end + '&user=' + reportingService.getMerchant()  );
		};

		reportingService.getMidTypeData = function() {
			return $http.get('/api/v1/report/midTypes?start=' + start + "&end=" + end + '&user=' + reportingService.getMerchant()  );
		};

		reportingService.getProcessorTypeData = function() {
			return $http.get('/api/v1/report/parentTypes?start=' + start + "&end=" + end + '&user=' + reportingService.getMerchant() );
		};

		reportingService.getProcessorStatusData = function() {
			return $http.get('/api/v1/report/parentStatus?start=' + start + "&end=" + end + '&user=' + reportingService.getMerchant() );
		};

		reportingService.getReasonCodeData = function() {
			return $http.get('/api/v1/report/reasonCodes?start=' + start + "&end=" + end + '&user=' + reportingService.getMerchant() );
		};

		return reportingService;
	}]);

})();
