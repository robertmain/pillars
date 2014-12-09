describe('the testing framework', function(){
	it('should work', function(){
		expect(true).toEqual(true);
	});
});
describe('MainCtrl', function() {
	beforeEach(module('pillars'));
	it('ensures the tests can access angular source', inject(function($controller) {
		var ctrl = $controller('MainCtrl', {});

		expect(ctrl.frameworkName).toBe("Pillars");
	}));
});