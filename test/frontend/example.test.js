describe('MainCtrl', function() {
	beforeEach(module('pillars'));
	it('makes sure tha true is true', inject(function($controller) {
		var ctrl = $controller('MainCtrl', {});
		//You can test various properties of your main controller here..
		expect(true).toEqual(true);
	}));
});