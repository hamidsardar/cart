

describe('chargebacks module', function() {

	beforeEach(module('chargebacks'));

	describe('chargebacks', function(){

		it('should ....', inject(function($rootScope, $state) {
			//spec body
			var scope = $rootScope.$new(),
				ctrl = $state.go('chargebacks', { $scope: scope });
			expect(ctrl).toBeDefined();
		}));

	});

});