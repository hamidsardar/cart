(function() {

	angular.module('chargeback', ['ui.router', 'upload', 'csvuploads', 'ngAnimate','iso-4217-currency-codes', 'isoCurrency', 'reasoncodes'])

	.config(['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ) {

		$urlRouterProvider.when('/chargeback/{_id}', '/chargeback/{_id}/card');

		$stateProvider
		.state('chargeback', {
			url: '/chargeback/{_id}',
			controller: 'ChargebackController',
			templateUrl: '/app/templates/chargeback.html',
			requiresAuth: true,
			resolve: {
				res: ['$http', '$stateParams', '$state', 'ChargebackService', function($http, $stateParams, $state, ChargebackService){
					if ($stateParams._id) {
						return ChargebackService.get($stateParams._id);
					} else {
						return false;
					}
				}]
			}
		})
		.state('chargebacknew', {
			requiresAuth: true,
			templateUrl: '/app/templates/chargeback.new.html'
		})
		.state('chargebacknew.default', {
			url: '/chargeback',
			requiresAuth: true,
			views: {
				'newViews': {
					controller: 'ChargebackController',
					templateUrl: '/app/templates/chargeback.new.default.html',
					resolve: {
						res: ['$http', '$stateParams', 'ChargebackService', function($http, $stateParams, ChargebackService){
							return false;
						}]
					}
				}
			}	
		})
		.state('chargebacknew.upload', {
			url: '/upload',
			requiresAuth: true,
			views: {
				'newViews': {
					controller: 'CsvUploadsController',
					templateUrl: '/app/templates/chargeback.new.upload.html',
				}
			}	
		})		
		.state('chargeback.card', {
			url: '/card',
			requiresAuth: true,
			templateUrl: '/app/templates/chargeback.card.html'
		})
		.state('chargeback.data', {
			url: '/data',
			requiresAuth: true,
			templateUrl: '/app/templates/chargeback.data.html',
			resolve: {
				scroll: function() {
					$("html, body").animate({ scrollTop: 0 }, 200);
				}
			}
		})
		.state('chargeback.review', {
			url: '/review',
			requiresAuth: true,
			templateUrl: '/app/templates/chargeback.review.html',
			resolve: {
				scroll:  function() {
					$("html, body").animate({ scrollTop: 0 }, 200);
				}
			}
		})
		.state('chargebackconfirmation', {
			url: '/chargeback/{_id}/confirmation',
			requiresAuth: true,
			templateUrl: '/app/templates/chargeback.confirmation.html',
			controller: 'ChargebackController',
			resolve: {
				res: ['$http', '$stateParams', '$state', 'ChargebackService', function($http, $stateParams, $state, ChargebackService){
					if ($stateParams._id) {
						return ChargebackService.get($stateParams._id);
					} else {
						return false;
					}
				}]
			}
		});

	}])
	
	.controller('UpperCtrl', ['$scope', '$filter', 
		function($scope, $filter){
			
			$scope.$watch('data.newCurrency', function(val){
				$scope.data.newCurrency = $filter('uppercase')(val); 
			}, true);

			$scope.$watch('data.gateway_data.BillingCountry', function(val){
				$scope.data.gateway_data.BillingCountry = $filter('uppercase')(val);
			});
	}])


	.controller('ChargebackController', ['$scope', '$rootScope', 'ChargebackService', 'FileUploader', '$timeout', 'res', '$state', '$modal', 'UtilService', 'ISO4217', 'ReasonCodeList',
			function($scope, $rootScope, ChargebackService, FileUploader, $timeout, res, $state, $modal, UtilService, ISO4217, ReasonCodeList) {
		// jshint maxstatements:60
		// jshint maxcomplexity:15 
				
		// data is retrieved in resolve within route
		$scope.data = (res ? res.data : ChargebackService.getDefaults());
		$scope.errors = {};

		if ($scope.data.status == "In-Progress" && $state.current.name != "chargeback.data" && $state.current.name != "chargeback.review" && $state.current.name != "chargebackconfirmation") {
			$state.go('chargeback.data', { '_id': res.data._id }, { location: "replace"} );
		} else if (_.indexOf(["Accept","Sent","Won","Lost"], $scope.data.status ) != -1 && ($state.current.name != "chargeback.review" && $state.current.name != "chargebackconfirmation")) {
			$state.go('chargeback.review', { '_id': res.data._id }, { location: "replace"} );
		}
	
		// Setup data.
		var setupData = function() {
			$scope.methods = {};
			$scope.settings = {
				// Set up variables for the state of the various date pickers. Had issues with using only one variable.
				chargeBackDateOpened: false,
				transDateOpened: false,
				transDateOrigOpened: false,
				canceledDateOpened: false,
				orderDateOpened: false,
				refundDateOpened: false,
				deliveryDateOpened: false,
				ipRegex : /^NA|(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
			};

			$scope.data.chc = true;
			$scope.settings.state = $state;
			$scope.settings.disableReview = true;
			$scope.settings.shipping_companies = ["", "USPS", "Fedex", "UPS", "DHL"];
			$scope.settings.cctypes = [
				"",
				"VISA",
				"MASTERCARD",
				"AMEX",
				"DISCOVER",
				//"ELECTRON",
				//"MAESTRO",
				//"DANKORT",
				//"INTERPAYMENT",
				//"UNIONPAY",
				//"DINERS",
				//"JCB"
			];
			$scope.settings.internal_types = [
				"Retrieval-Request",
				"Chargeback",
				"Pre-Arbitration"
			];

			$scope.settings.currencies = ["USD", "EUR", "CAD", "GBP","JPY", "CHF", "AUD", "NZD", "YEN", "CAN", "MYR", "OTHER"];		
		};
		setupData();

		var getCurrency = function() {
			ChargebackService.getCurrency().then(function(res) {
				if (res.data.selectedCurrency[0] !== undefined){
					var currency = res.data.selectedCurrency[0].currency;
					addCurrencyToList(currency);
					var c = _.findIndex($scope.settings.currencies, function(m) {
						return m == currency;
					});
					$scope.data.gateway_data.Currency = $scope.settings.currencies[c];
				}
				
				else if (res.data.selectedCurrency[0] === undefined){
					$scope.data.gateway_data.Currency = $scope.settings.currencies[0];
				}

			});	
		};	


		if ($scope.data.gateway_data && !$scope.data.gateway_data.Currency){
			getCurrency();
		}

		var addCurrencyToList = function(m){
			if ($scope.settings.currencies.indexOf(m) === -1){
				$scope.settings.currencies.push(m);
			}
		};

		//if currency is not already in list, add it on page load. 
		$timeout(function(){
			addCurrencyToList($scope.data.gateway_data.Currency);
		}, 1000);	

		//if user selects "OTHER" currency, ensure the input is a valid currency code.
		$scope.methods.newCurrency = function(m){
			if (ISO4217.isCurrencyCode(m)) {
				addCurrencyToList(m);
				$scope.data.gateway_data.Currency = m;
				$scope.data.newCurrency = m;
			} else {
				return $scope.data.newCurrency = "";
			}	
		};

		// ng-change will call changeCurrency
		$scope.methods.changeCurrency = function(m) {
			$scope.data.gateway_data.Currency = m;
		};		

		$scope.dtmax = new Date();

		if (!$scope.data.attachments) { $scope.data.attachments = []; }

        $scope.open=function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
        };

        $scope.dateOptions = {
                showWeeks:'false'
        };

		$scope.methods.setCard = function(c) {
			$scope.data.type = c;
			save();
			if ($state.current.name == "chargeback.card") {
				$state.go('chargeback.data');
			}
		};

		if ($scope.data.gateway_data && !$scope.data.gateway_data.TransDate) {
			$scope.data.gateway_data.TransDate = "";
		}

		if (!$scope.data.internal_type) {
			$scope.data.internal_type = "Chargeback";
		}


		$scope.$watch("data", function(newValue, oldValue){
			$scope.errors = {};
			var popups = document.querySelectorAll('.popover');
			_.each(popups, function(p) { p.remove(); });
		},true);

		//get mids for typeahead
		$scope.mids = [];
		ChargebackService.getMids().then(function(res){
			for (var i = 0, l = res.data.length; i < l; i++){
				$scope.mids.push(res.data[i].portal_data.MidNumber);
			}
			$scope.mids = _.uniq($scope.mids);
		});

		//match first character in mid typeahead
		$scope.startsWith = function(state, viewValue) {
      return state.substr(0, viewValue.length) == viewValue;
    };
		
		$scope.methods.getCardType = function() {
			ChargebackService.getCardType( ($scope.data.portal_data.CcPrefix || '') + "11010101" + ($scope.data.portal_data.CcSuffix || '') ).then(function(res) {
				if (res.data.cctype) {
					$scope.data.gateway_data.CcType = res.data.cctype;
				} else {
					$scope.data.gateway_data.CcType = "";
				}

			});
		};

		$scope.codes = {};
		$scope.methods.getCodes = function(){
			$timeout(function(){
				$scope.codes = ReasonCodeList.getCodes($scope.data.gateway_data.CcType, $scope.data.internal_type);
			}, 1000);	
			
		};

		$scope.onSelect = function ($item) {
		   $scope.$item = $item;
		   $scope.data.portal_data.ReasonText = $scope.$item.Text;
		   $scope.data.portal_data.ReasonCode = $scope.$item.Code;
		};

		var _this = this;
		$scope.methods.saveNew = function(data) {
			$scope.$broadcast('show-errors-check-validity');
			if ($scope.cbNewForm.$valid) {
				$scope.newService = ChargebackService.save($scope.data).then(function (res) {
					updateData(res);
					$state.go('chargeback.card', { '_id': res.data._id });
				}, function (res) {
					$scope.errors = UtilService.formatErrors(res.data);
				});
			}
		};


		$scope.methods.wonlost = function(wonlost, msg, confirmbtn, cancelbtn) {
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
					if (wonlost) {
						$scope.data.status = "Won";
					} else {
						$scope.data.status = "Lost";
					}
					save();
				}
			});
		};

		$scope.methods.undowonlost = function() {
			$scope.data.status = "Sent";
			save();
		};

		var save = function(halt_save_on_error) {
			$scope.$broadcast('show-errors-check-validity');
			if (!$scope.cbForm) { return; }
			if ($scope.cbForm.$valid) {
				$scope.settings.disableReview = false;
			} else {
				$scope.settings.disableReview = true;
			}

			if (halt_save_on_error && $scope.cbForm[halt_save_on_error]['$invalid']) {
				return;
			}

			// save no matter what, but don't let user proceed without fixing errors!
			ChargebackService.save($scope.data).then(function (res) {
				$scope.$broadcast('show-errors-check-validity');
				updateData(res);
				$scope.methods.checkForErrors($scope.data);
				addUploaders();
			}, function (res) {
				$scope.errors = UtilService.formatErrors(res.data);
			});

		};

		$scope.methods.ds = _.debounce(save, 2000, { leading: false, trailing: true });

		// clicking drag-n-drop zones triggers old-school upload dialog
		$scope.methods.triggerUpload = function(el) {
			angular.element(el).trigger('click');
		};

		$scope.methods.download = function() {
			if ($scope.data.docgen) {
				ChargebackService.getLink( $scope.data._id ).then(function(res) {
					if (res.data.url) {
						window.open( res.data.url, "_blank");
					} else {
						console.log('Bug in getLink()');
					}
				});
			} else {
				alert('Docgen URL does not exist.');
			}
		};

		
		$scope.methods.removeItem = function(item) {
			var i = 0;
			_.each($scope.data.attachments, function(a) {
				if (a && a._id == item._id) {
					// remove from data store.
					$scope.data.attachments.splice(i,1);
				}
				if (_.isFunction(item.remove)) {
					item.remove();
				}
				i++;
			});
			$scope.methods.ds();
			$scope.methods.checkForReceipt();
		};

		$scope.methods.submit = function(msg, confirmbtn, cancelbtn) {
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
					ChargebackService.submit($scope.data).then(function (res) {
						$scope.data = res.data;
						$state.go('chargebackconfirmation', { '_id': res.data._id });
					}, function (res) {
						$scope.errors = UtilService.formatErrors(res.data);
					});
				}
			});
		};

		$scope.methods.accept = function(msg, confirmbtn, cancelbtn) {
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
                $scope.data.status = "Accept";
		        save();
                        $state.go('chargebackconfirmation', { '_id': res.data._id });
                }
            });
	    };


		var addUploaders = function() {
			if ($scope.uploaders) {
				if( !$scope.data.attachments ){$scope.data.attachments = [];}
				$scope.uploaders['receipt'].setUploads($scope.data.attachments);
				$scope.uploaders['add'].setUploads($scope.data.attachments);
				$scope.uploaders['terms'].setUploads($scope.data.attachments);
				$scope.uploaders['checkout'].setUploads($scope.data.attachments);
				return;
			}
			$scope.uploaders = {};
			$scope.uploaders['receipt'] = new FileUploader({
				queueLimit: 1,
				type: "receipt"
			});
			$scope.uploaders['receipt'].setUploads($scope.data.attachments);
			$scope.uploaders['receipt'].onCompleteAll = function() {
				$scope.methods.ds();
				$scope.methods.checkForReceipt();
			};

			$scope.uploaders['add'] = new FileUploader({
				queueLimit: 1,
				type: "additional"
			});
			$scope.uploaders['add'].setUploads($scope.data.attachments);
			$scope.uploaders['add'].onCompleteAll = function() {
				$scope.methods.ds();
			};

			$scope.uploaders['terms'] = new FileUploader({
				queueLimit: 1,
				type: "terms"
			});
			$scope.uploaders['terms'].setUploads($scope.data.attachments);
			$scope.uploaders['terms'].onCompleteAll = function() {
				$scope.methods.ds();
			};

			$scope.uploaders['checkout'] = new FileUploader({
				queueLimit: 1,
				type: "checkout"
			});
			$scope.uploaders['checkout'].setUploads($scope.data.attachments);
			$scope.uploaders['checkout'].onCompleteAll = function() {
				$scope.methods.ds();
			};
		};
		addUploaders();

		$scope.settings.has_receipt = false;
		$scope.methods.checkForReceipt = function() {
			$scope.settings.has_receipt = false;
			_.each($scope.data.attachments, function(a) {
				if (a.type == "receipt") {
					$scope.settings.has_receipt = true;
				}
			});
		};

		$scope.methods.checkForReceipt();


		$scope.methods.copyBilling = function() {
			if (!$scope.data.crm_data) {
				$scope.data.crm_data = {};
			}
			$scope.data.crm_data.DeliveryAddr1 = $scope.data.gateway_data.BillingAddr1;
			$scope.data.crm_data.DeliveryAddr2 = $scope.data.gateway_data.BillingAddr2;
			$scope.data.crm_data.DeliveryCity = $scope.data.gateway_data.BillingCity;
			$scope.data.crm_data.DeliveryState = $scope.data.gateway_data.BillingState;
			$scope.data.crm_data.DeliveryPostal = $scope.data.gateway_data.BillingPostal;
			$scope.data.crm_data.DeliveryCountry = $scope.data.gateway_data.BillingCountry;
			save();
		};

		$scope.methods.checkForErrors = function(d) {
			if (d) {
				$timeout(function() {
					$scope.$broadcast('show-errors-check-validity');
					if ($scope.cbForm.$valid && $scope.data.type) {
						$scope.settings.disableReview = false;
					} else {
						$scope.settings.disableReview = true;
					}
				},500);
			}
		};
		$scope.methods.checkForErrors(res.data);

		/**
		 * updateData function updates $scope.data based on response from ChargebackService.save.
		 * It's called from $scope.methods.save and $scope.methods.saveNew.
		 * @param  {object} res ChargebackService.save success resolution object.
		 * @return {void}
		 */
		function updateData(res) {

			// Fields to omit when updating scope from server.
			var omit = {
				gateway_data: ['CcType'],
				data: ['chargebackDate', 'gateway_data', 'internal_type', 'portal_data', 'send_to'],
				send_to: ['fax'],
				portal_data: ['CaseNumber', 'RefNumber', 'MidNumber', 'ChargebackAmt', 'CcPrefix', 'CcSuffix', 'ReasonCode', 'ReasonText']
			};

			var data = res.data;

			// This extends the $scope.data but omits the given fields, which
			// should prevent overwriting of user input
			_.extend($scope.data.gateway_data, _.omit(data.gateway_data, omit.gateway_data));
			_.extend($scope.data.send_to, _.omit(data.send_to, omit.send_to));
			_.extend($scope.data.portal_data, _.omit(data.portal_data, omit.portal_data));
			_.extend($scope.data, _.omit(data, omit.data));

		}

	}])


	.directive('amount', ['$filter', function($filter){
		
			// Handles user input, returns val or a valid float.
			function toFloat(val){
				if( isNaN(val) || val < 1) {
					return val;
				} else {	
					var f = parseFloat(val);
					return f;
				}	
			}	

		    return {
		    	scope: true,
		        require: 'ngModel',
		        restrict: 'A',
		        link: function($scope, elem, attr, ngModel){
		        	
		        	ngModel.$formatters.push(function(val) {
							if (isNaN(val) || val < 1) {
								return val;
							} else {
								return $filter('isoCurrency')(val, $scope.data.gateway_data.Currency);
							}
					});
		        	
		        	ngModel.$parsers.push(toFloat);	
		          
			} 
		};	 

	}]) 	

	.service('ChargebackService', ['$http', 'UserService', function ($http, UserService) {

		this.get = function(_id) {
			return $http.get('/api/v1/chargeback/' + _id);
		};

		this.getCurrency = function() {
			return $http.get('/api/v1/dashboard');
		};

		this.getMids = function(_id){
			return $http.get('api/v1/chargebacks?');
		};

		this.getCardType = function(card) {
			return $http.get('/api/v1/cctype/' + card);
		};

		this.getLink = function(_id) {
			return $http.get('/api/v1/s3-link/' + _id);
		};

		this.save = function(data) {
			if (data._id) {
				return $http.put('/api/v1/chargeback/' + data._id, data);
			} else {
				return $http.post('/api/v1/chargeback', data);
			}
		};

		this.submit = function(data) {
			return $http.post('/api/v1/submitchargeback', data);
		};

		this.getDefaults = function() {
			var user = UserService.getCurrentUser();
			if (!user.send_to) { user.send_to = {}; }
			return {
				user_entered: true,
				status: 'New',
				manual: true,
				gateway_data: {
					TransType: "Card Settle",
					TransStatus: "Complete"
				},
				send_to: {
					email: (user.send_to.email || undefined),
					fax: (user.send_to.fax || undefined)
				}
			};
		};

	}]);

})();
