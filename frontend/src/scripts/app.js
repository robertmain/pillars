(function(){
	"use strict";

	angular.module("pillars", [
		"pillars.controllers",
		"pillars.services",
		"pillars.filters",
		"ui.router",
		"ngMaterial",
		"angular-gestures"
	])

	.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "$provide", "$locationProvider", "$mdThemingProvider", function($stateProvider, $urlRouterProvider, $httpProvider, $provide, $locationProvider, $mdThemingProvider){
		$mdThemingProvider.theme("default")
			.primaryPalette("indigo");
		$stateProvider
			.state("app", {
				controller: "MainCtrl",
				templateUrl: "views/home.html",
				url: "/"
			})
			.state("app.content", {

			})
			//Your Custom Routes Go Here
			.state("404", {
				templateUrl: "views/404.html",
				url: "/404"
			});
		$urlRouterProvider.when("","/").otherwise("/404"); //404 Route
	}])

	.run(["$state", function($state){
		$state.go("app"); //Display the app page on start (redirect to the "app" state)
	}]);
})();
