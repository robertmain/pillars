(function(){
	"use strict";

	angular.module("pillars", [
		"pillars.controllers",
		"pillars.filters",
		"ui.router",
		"ngMaterial"
	])

	.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "$provide", "$locationProvider", "$mdThemingProvider", function($stateProvider, $urlRouterProvider, $httpProvider, $provide, $locationProvider, $mdThemingProvider){
		$mdThemingProvider.theme("default")
			.primaryPalette("blue");
		$stateProvider
			.state("index", {
				controller: "MainCtrl",
				templateUrl: "views/home.html",
				url: "/"
			})
			//Your Custom Routes Go Here
			.state("404", {
				templateUrl: "views/404.html",
				url: "/404"
			});
		$urlRouterProvider.when("","/").otherwise("/404"); //404 Route
	}])

	.run(["$state", function($state){
		$state.go("index"); //Display the index page on start (redirect to the "app" state)
	}]);
})();
