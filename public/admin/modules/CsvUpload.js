(function() {

	angular.module('csvupload', ['ui.router', 'ngCsvImport'])
	
	.config(['$stateProvider', function( $stateProvider ) {
		
		$stateProvider.state('csvupload', {
			url: '/admin/csvupload',
			templateUrl: '/admin/templates/csvupload.html',
			requiresAuth: true,
			controller: 'CsvController'
		});

	}])

	.controller('CsvController', [ '$scope', '$state', 'CsvService', 'CsvAlertService', function($scope, $state, CsvService, CsvAlertService) {
		
		$scope.csv = {
			content: null,
			header: true,
			separator: ',',
			result: null
		};
		$scope.fields = [];
		$scope.map = [];
		$scope.user = "";
		$scope.chargebacks = [];
		$scope.cb_total = 0;

		$scope.cbFieldsObj = {
			status:"status",
			merchant:"merchant",
			chargebackdate:"chargebackDate",
			type:"type",
			fullname:"fullName",
			cardswipe:"cardSwipe",
			sendto:"sendTo",
			cardnumber:'CardNumber',	// not stored, but used to determine prefix, suffix and type
			casenumber:'portal_data.CaseNumber',
			refnumber:'portal_data.RefNumber',
			ccprefix:'portal_data.CcPrefix',
			ccsuffix:'portal_data.CcSuffix',
			chargebackamt:'portal_data.ChargebackAmt',
			midnumber:'portal_data.MidNumber',
			reasoncode:'portal_data.ReasonCode',
			reasontext:'portal_data.ReasonText',
			authcode:'gateway_data.AuthCode',
			avsstatus:'gateway_data.AvsStatus',
			firstname:'gateway_data.FirstName',
			middlename:'gateway_data.MiddleName',
			lastname:'gateway_data.LastName',
			billingaddr1:'gateway_data.BillingAddr1',
			billingaddr2:'gateway_data.BillingAddr2',
			billingcity:'gateway_data.BillingCity',
			billingcountry:'gateway_data.BillingCountry',
			billingpostal:'gateway_data.BillingPostal',
			billingstate:'gateway_data.BillingState',
			phone:'gateway_data.Phone',
			ccexpire:'gateway_data.CcExpire',
			cctype:'gateway_data.CcType',
			currency:'gateway_data.Currency',
			cvvstatus:'gateway_data.CvvStatus',
			orderid:'gateway_data.OrderId',
			transhistory:'gateway_data.TransHistory',
			transid:'gateway_data.TransId',
			transstatus:'gateway_data.TransStatus',
			transtype:'gateway_data.TransType',
			transdate:'gateway_data.TransDate',
			transamt:'gateway_data.TransAmt',
			'orig-transid':'gateway_data.Originating.TransId',
			'orig-cvvstatus':'gateway_data.Originating.CvvStatus',
			'orig-transdate':'gateway_data.Originating.TransDate',
			'orig-transamt':'gateway_data.Originating.TransAmt',
			'orig-authcode':'gateway_data.Originating.AuthCode',
			'orig-orderid':'gateway_data.Originating.OrderId',
			orderdate:'crm_data.OrderDate',
			deliveryaddr1:'crm_data.DeliveryAddr1',
			deliveryaddr2:'crm_data.DeliveryAddr2',
			deliverycity:'crm_data.DeliveryCity',
			deliverycountry:'crm_data.DeliveryCountry',
			deliverypostal:'crm_data.DeliveryPostal',
			deliverystate:'crm_data.DeliveryState',
			email:'crm_data.Email',
			ipaddress:'crm_data.IpAddress',
			pricepoint:'crm_data.PricePoint',
			productname:'crm_data.ProductName',
			isrecurring:'crm_data.IsRecurring',
			canceldatesystem:'crm_data.CancelDateSystem',
			refunddatefull:'crm_data.RefundDateFull',
			refunddatepartial:'crm_data.RefundDatePartial',
			refundamount:'crm_data.RefundAmount',
			rma:'crm_data.Rma',
			has_tracking:'shipping_data.has_tracking',
			shippingdate:'shipping_data.ShippingDate',
			trackingnum:'shipping_data.TrackingNum',
			trackingsum:'shipping_data.TrackingSum'
		};
 
	
		// typeahead uses this array to auto-complete fields if user deletes default match
		$scope.cbFields = [
			"status",
			"merchant",
			"chargebackDate",
			"type",
			"fullName",
			"cardSwipe",
			"sendTo",
			'CardNumber',	// not stored, but used to determine prefix, suffix and type
			'portal_data.CaseNumber',
			'portal_data.RefNumber',
			'portal_data.CcPrefix',
			'portal_data.CcSuffix',
			'portal_data.ChargebackAmt',
			'portal_data.MidNumber',
			'portal_data.ReasonCode',
			'portal_data.ReasonText',
			'gateway_data.AuthCode',
			'gateway_data.AvsStatus',
			'gateway_data.FirstName',
			'gateway_data.MiddleName',
			'gateway_data.LastName',
			'gateway_data.BillingAddr1',
			'gateway_data.BillingAddr2',
			'gateway_data.BillingCity',
			'gateway_data.BillingCountry',
			'gateway_data.BillingPostal',
			'gateway_data.BillingState',
			'gateway_data.Phone',
			'gateway_data.CcExpire',
			'gateway_data.CcType',
			'gateway_data.Currency',
			'gateway_data.CvvStatus',
			'gateway_data.OrderId',
			'gateway_data.TransHistory',
			'gateway_data.TransId',
			'gateway_data.TransStatus',
			'gateway_data.TransType',
			'gateway_data.TransDate',
			'gateway_data.TransAmt',
			'gateway_data.Originating.TransId',
			'gateway_data.Originating.CvvStatus',
			'gateway_data.Originating.TransDate',
			'gateway_data.Originating.TransAmt',
			'gateway_data.Originating.AuthCode',
			'gateway_data.Originating.OrderId',
			'crm_data.OrderDate',
			'crm_data.DeliveryAddr1',
			'crm_data.DeliveryAddr2',
			'crm_data.DeliveryCity',
			'crm_data.DeliveryCountry',
			'crm_data.DeliveryPostal',
			'crm_data.DeliveryState',
			'crm_data.Email',
			'crm_data.IpAddress',
			'crm_data.PricePoint',
			'crm_data.ProductName',
			'crm_data.IsRecurring',
			'crm_data.CancelDateSystem',
			'crm_data.RefundDateFull',
			'crm_data.RefundDatePartial',
			'crm_data.RefundAmount',
			'crm_data.Rma',
			'shipping_data.has_tracking',
			'shipping_data.ShippingDate',
			'shipping_data.TrackingNum',
			'shipping_data.TrackingSum'
		];


		$scope.service = CsvService;

		/****************
		 appendCbData
		 @param: cb - the chargeback to modify
		 @param: path - the dot notation path in the object to store value.
		 @param: value - value to store

		 @return:
		 @out: The cb object is updated.
		 **********************/
		$scope.appendCbData = function(cb, path, value) {
			// Break the path into its pieces
			var path_ll = path.split(".");
			// Get the last key in the path
			var last_key = path_ll.slice(-1)[0];
			// Remove the last key from the path list
			path_ll = path_ll.slice(0,-1);
			// Start with a reference to the root of cb
			var dest = cb;

			// Walk down the path, creating objects as we go if not there.
			for( var i = 0; i < path_ll.length; i++) {
				// Is there something here?
				if( !dest[path_ll[i]]) {
					// Nope, create an object
					dest[path_ll[i]] = {};
				}
				// Move dest to next object
				dest = dest[path_ll[i]];
			}
			// Save the value.
			dest[last_key] = value;
		};

		$scope.save = function() {
			$scope.chargebacks = [];
			// Now we need to convert the CSV objects to dispute objects.
			_.each($scope.json, function( csvObj) {
				var cb = {};	// start with empty object
				// iterate over the key/value pairs for the CSV object
				_.each(csvObj, function(value, key) {
					key = key.trim();
		      if(value === "") {
		        delete csvObj[key];
		      } else {
						// Did key get mapped? If not skip it.
						if($scope.map.hasOwnProperty(key)) {
							// Get the dot notated path into a chargeback object
							var path = $scope.map[key];
							// update the chargeback object
							$scope.appendCbData(cb, path, value);
						}
					}
				});
				// add the chargeback object to the list
				if (Object.keys(cb).length !== 0){
					$scope.chargebacks.push(cb);
					$scope.cb_total = $scope.chargebacks.length;
				}
			});

			$scope.service.save( { 'user': $scope.user, 'chargebacks': $scope.chargebacks } ).then(function () {
				$scope.json = {};
				$scope.user = "";
				CsvAlertService.setSuccess('Success!');
				CsvAlertService.setTotal($scope.cb_total);
				$state.go('dashboard');
			}, function (res) {
				console.log(res);
			});

		};

		

		var processed = false;
		$scope.$watch("csv.result", function(newValue, oldValue){
			if (newValue && !processed) {
				$scope.json = JSON.parse(newValue);
				if ($scope.json.length) {
					_.each($scope.json[0], function(value, key) {
						key = key.trim();
						if( key.charAt(0) !== '#') { // Do we skip this column
							// Force the key to lower case for matching.
							var testKey = key.toLowerCase();
							// Get the path in a dispute if defined in the fields
							if($scope.cbFieldsObj.hasOwnProperty(testKey)) {
								var path = $scope.cbFieldsObj[testKey];
								 $scope.map[key] = path;
							}
							$scope.fields.push({'field': key, 'example': value});
						}
					});
					processed = true;
				}
			}
		},true);

		
	}])

	.factory('CsvService', ['$http', '$timeout', function ($http, $timeout) {
			
		var service = {};

		service.save = function(data) {
			return $http
				.post('/api/v1/chargebacks', data)
				.then(function (res) {
					return res.data;
				});
		};

		service.getUsers = function(q) {
			return $http
				.get('/api/v2/admin/users?query=' + q)
				.then(function(response){
					return response.data;
				});
		};
		return service;
	}])

	.factory('CsvAlertService', function () {
	  var success = {},
	      total = 0,
	      alert = false;
	  return {
	    getSuccess: function () {
	      return success;
	    },
	    setSuccess: function (value) {
	      success = value;
	      alert = true;
	    },
	    getTotal: function () {
	      return total;
	    },
	    setTotal: function (value) {
	      total = value;
	      alert = true;
	    },
	    reset: function () {
	      success = {};
	      total = 0;
	      alert = false;
	    },
	    hasAlert: function () {
	      return alert;
	    }
	  };
	});


})();
