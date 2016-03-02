(function() {

	angular.module('dashboard', ['ui.router', 'ngAnimate', 'graphing', 'angularMoment','user'])
	
	.config(['$stateProvider', function( $stateProvider ) {
		
		$stateProvider
		.state('dashboard', {
			url: '/dashboard',
			templateUrl: '/app/templates/dashboard.html',
			requiresAuth: true,
			controller: 'DashboardController'
		})
		.state('admindashboard', {
			url: '/admin/dashboard',
			controller: [ '$scope', function($scope) {
					window.location = "/admin/dashboard";
			}]
		});	
	}])

	.controller('DashboardController', [ '$scope', 'DashboardService', 'UserService','ReportingService', '$timeout', function($scope, DashboardService, UserService, ReportingService, $timeout) {
		$scope.dbs = new DashboardService();
		$scope.winloss = {};
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
		
		$scope.dbs.setDates($scope.date);
		
		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.opened = true;
		};

		$scope.dateOptions = {
			showWeeks:'false'
		};

		$scope.dbs.loadDashboard().then(function(data) {
			if (data.hwl) {
				$timeout(function() {
					$scope.winloss.update(data.winloss);
				},150);

			}
		});

		$scope.$watch("date.start.val", function(newValue, oldValue){
			//@TODO: alert location for history option, like chargeback list
			if (newValue == oldValue) { return; }
			$scope.dbs.setDates($scope.date);
			$scope.dbs.loadDashboard().then(function(data) {
				if (data.hwl) {
					$timeout(function() {
						$scope.winloss.update(data.winloss);
					},150);

				}
			});
			if ($scope.last) {
				$scope[$scope.last]();
			}
		});
		$scope.$watch("date.end.val", function(newValue, oldValue){
			//@TODO: alert location for history option, like chargeback list
			if (newValue == oldValue) { return; }
			$scope.dbs.setDates($scope.date);
			$scope.dbs.loadDashboard().then(function(data) {
				if (data.hwl) {
					$timeout(function() {
						$scope.winloss.update(data.winloss);
					},150);

				}
			});
			if ($scope.last) {
				$scope[$scope.last]();
			}
		});

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
			ReportingService.setMerchant(m._id);
			if (m._id != $scope.last_merchant_id) {
				$scope.dbs.setMerchant();
				$scope.dbs.loadChargebacks();
				$scope.dbs.loadDashboard().then(function(data) {
					if (data.hwl) {
						$timeout(function() {
							$scope.winloss.update(data.winloss);
						},150);

					}
				});
			}
			$scope.last_merchant_id = m._id;
		};

		$scope.showList = function() {
			var ngModelCtrl = angular.element('input').controller('ngModel');
        	ngModelCtrl.$setViewValue(' ');
		};
	}])


	.factory('DashboardService', ['$http', '$timeout', 'ReportingService', function ($http, $timeout, ReportingService) {

		var DashboardService = function() {
			this.data_chargebacks = [];
			this.data_dashboard = [];
			this.loaded_chargebacks = false;
			this.current = ReportingService.setMerchant(ReportingService.getMerchant());
		};

		var start, end;
		DashboardService.prototype.setDates = function(d){
			start = moment(d.start.val).valueOf();
			end = moment(d.end.val).valueOf();
		};

		DashboardService.prototype.getDates = function(){
			start = start;
			end = end;
		};


		DashboardService.prototype.setMerchant = function(){
			this.current = ReportingService.setMerchant(ReportingService.getMerchant());
		};

		DashboardService.prototype.loadChargebacks = function() {
			var _this = this;
			$http.get('/api/v1/chargebacks?status=New&limit=10&user=' + this.current)
			.success(function (rows) {
				_this.data_chargebacks = rows;
				_this.loaded_chargebacks = true;
			});
		};

		DashboardService.prototype.loadDashboard = function() {
			var _this = this;
			if (start !== undefined && end !== undefined) {
				return $http.get('/api/v1/dashboard?start=' + start + '&end=' + end + '&user=' + _this.current)
					.then(function (res) {

						res.data.hwl = true;
						if (_.isNaN(res.data.winloss.won / res.data.winloss.count)) {
							res.data.hwl = false;
						}

						_this.data_dashboard = res.data;
						return res.data;
					});
			} else {
				return $http.get('/api/v1/dashboard?user=' + _this.current)
					.then(function (res) {

						res.data.hwl = true;
						if (_.isNaN(res.data.winloss.won / res.data.winloss.count)) {
							res.data.hwl = false;
						}

						_this.data_dashboard = res.data;
						return res.data;
					});
			}
		};

		return DashboardService;

	}]);
})();