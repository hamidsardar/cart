(function() {

	angular.module('chargebacks', ['chargeback', 'ui.router', 'ngAnimate', 'infinite-scroll', 'user', 'isoCurrency'])

	.config(['$stateProvider', function( $stateProvider ) {

		$stateProvider.state('chargebacks', {
			url: '/chargebacks?status&start&end&cctype&mid&merchant&name&avs&cvv',
			templateUrl: '/app/templates/chargebacks.html',
			requiresAuth: true,
			controller: 'ChargebacksController'
		});

	}])

	.controller('ChargebacksController', ['$scope', '$timeout', 'ChargebacksService', 'ChargebackService', 'ReportingService','UserService', '$state', '$location', '$modal', '$http',
            function($scope, $timeout, ChargebacksService, ChargebackService, ReportingService, UserService, $state, $location, $modal, $http) {


		$scope.methods = {};

        $scope.open= function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
        };

        $scope.dateOptions = {
                showWeeks:'false'
        };


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

		$scope.setMerchant = function(m) {
			ReportingService.setMerchant(m._id);
			if (m._id != $scope.last_merchant_id) {
				$scope.cbs.clearAndRun();
			}
			$scope.last_merchant_id = m._id;
		};
		
		$scope.filters = "";
		_.forOwn($state.params, function(num,key) {
			if ($state.params[key] && _.contains(['status', 'merchant', 'mid', 'cctype', 'name', 'cvs', 'avs'], key)) {
				if ($scope.filters) { $scope.filters += ", "; }
				$scope.filters += key + "=" + $state.params[key];
			}
		});

		$scope.methods.hideChargeback = function(cb, msg, confirmbtn, cancelbtn){
			var modalInstance = $modal.open({
				templateUrl: '/app/templates/confirm-modal.html',
				controller: 'ModalInstanceCtrl',
				size: "md",
				resolve: {
					data: function () {
						return {
							'msg': msg,
							'confirm': confirmbtn,
							'cancel': cancelbtn
						};
					}
				}
			});
			modalInstance.result.then(function (confirm) {
				if (confirm) {
					$http.put('/api/v1/hidechargeback/' + cb._id)
						.then(function(){
							$scope.cbs.clearAndRun();
						});
				}
			});
		};

        $scope.cbs = new ChargebacksService();

        // Code for handling selection and bulk PDF downloads
		$scope.n_pdfs_tobe_downloaded = 0;
        $scope.pdf_checkbox  = function(cb) {
            if(cb.checked) {
                $scope.n_pdfs_tobe_downloaded += 1;
            } else {
                if ($scope.n_pdfs_tobe_downloaded > 0) {
                    $scope.n_pdfs_tobe_downloaded -= 1;
                }
            }
        };
        var _download_file = function(res) {
            if (res.data.url) {
                var a = document.createElement('a');
                a.href = res.data.url;
                a.download = 'MyDownload.pdf';
                a.click();
            } else {
                alert('PDF not found, contact system administrator');
            }
        };
        $scope.pdf_bulk_download_click = function() {
            for (var i = 0; i < $scope.cbs.data.length; i++) {
                var cb = $scope.cbs.data[i];
                if (cb.checked) {
                    ChargebackService.getLink(cb._id).then(_download_file);
                }
            }
        };

        $scope.load_start = false;
        $scope.load_end = false;
        $scope.$watch('date.start.val', function(newValue, oldValue) {
			if ($scope.load_start) {
				$location.search('start', moment(new Date(newValue)).utc().valueOf() );
			}
			$scope.load_start = true;
		});
		$scope.$watch("date.end.val", function(newValue, oldValue){
			if ($scope.load_end) {
				$location.search('end', moment(new Date(newValue)).utc().valueOf() );
			}
			$scope.load_end = true;
		});


		$scope.goTo = function(d) {
			if (d.status == "In-Progress" || d.status == "Errored") {
				$state.go('chargeback.data', { '_id': d._id });
			} else if (_.indexOf(["Sent","Won","Lost"], d.status ) != -1) {
				$state.go('chargeback.review', { '_id': d._id });
			} else {
				$state.go('chargeback.card', { '_id': d._id });
			}
		};

		$scope.download = function() {
			var url = $scope.cbs.nextPage(true);
			window.open(url, "_blank");
		};

		$scope.$on(
			"$destroy",
			function( event ) {
				$timeout.cancel( $scope.cbs.filterTextTimeout );
			}
		);

		$scope.showList = function() {
			var ngModelCtrl = angular.element('input').controller('ngModel');
        	ngModelCtrl.$setViewValue(' ');
		};

	}])

    .factory('ChargebacksService', ['$http', '$timeout', '$state', '$window', 'ReportingService', function ($http, $timeout, $state, $window, ReportingService) {

		var ChargebacksService = function() {
			this.data = [];
			this.current = ReportingService.setMerchant(ReportingService.getMerchant());
			this.busy = false;
			this.done = false;
			this.page = 1;
			this.query = '';
			this.lastQuery = '';
			this.filterTextTimeout = false;
			this.start = moment().utc().subtract(3, 'month');
			this.end = new Date();
			this.loaded = false;
		};

		ChargebacksService.prototype.clear = function() {
			// reset
			this.page = 1;
			this.current = '';
			this.data = [];
			this.query = "";
			this.loaded = false;
			this.last_page = false;
			return;
		};


		ChargebacksService.prototype.clearAndRun = function(q) {
			// reset
			this.page = 1;
			this.data = [];
			this.current = ReportingService.setMerchant(ReportingService.getMerchant());
			this.query = (q || (this.lastQuery || ""));
			this.loaded = false;
			this.last_page = false;
			this.nextPage();
			return;
		};

		ChargebacksService.prototype.search = function(query) {
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

		ChargebacksService.prototype.nextPage = function(download) {
			if (this.busy) { return; }
			this.busy = true;
    		var _this = this;


			if (this.query && this.lastQuery != this.query) {
    			// new query, reset list
    			this.page = 1;
    			this.data = [];
    			this.lastQuery = this.query;
    		}

    		var url = '/api/v1/chargebacks?page=' + this.page;
    		//url += '&start=' + this.start + "&end=" + this.end;
    		url += '&limit=30&query=' + this.query + '&merchant=' + this.current;

    		// additional params such as start, end, cctype, merchant, etc
    		if ($state.params) {
    			_.each(_.keys($state.params), function(k) {
    				if ($state.params[k]) {
    					url += '&' + k + '=' + $state.params[k];
    				}
    			});
    		}

    		if (download) {
    			_this.busy = false;
    			return url + '&export=csv&cbkey=' + $window.sessionStorage.token;
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
		
		return ChargebacksService;

	}]);

})();
