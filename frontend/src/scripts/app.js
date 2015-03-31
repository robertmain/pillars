(function(){
	"use strict";

	angular.module("pillars", [
		"pillars.controllers",
		"pillars.filters",
		"ui.router"
	])

	.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "$provide", "$locationProvider", function($stateProvider, $urlRouterProvider, $httpProvider, $provide, $locationProvider){
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
