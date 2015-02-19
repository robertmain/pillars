(function(){
	"use strict";

	angular.module("pillars.controllers", [])

	.controller("MainCtrl", function(){var self = this;})
	.controller("SidebarCtrl", ["Page", function(Page){
		var self = this;
		self.pages = Page.all();
		self.setCurrent = Page.setCurrent;
	}]);
}());