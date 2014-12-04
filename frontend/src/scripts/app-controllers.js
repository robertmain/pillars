(function(){
	"use strict";

	angular.module('pillars.controllers', [])

	.controller('MainCtrl', [function(){
		var self = this;
		self.frameworkName = "Pillars";
		self.title = self.frameworkName;
		self.tagline = "Your Starting Framework For Every Web Project"
	}])
}());