(function(){
	"use strict";
	angular.module("pillars.filters", [])
	.filter("reverse", function() {
		return function(text){
			return text.split("").reverse().join("");
		};
	})

	.filter("timeago", function(){
		/*global moment:true*/
		return function(date){
			return moment(date).fromNow();
		};
	})

	.filter("stripTags", function(){
		return function(string){
			return String(string).replace(/<[^>]+>/gm, "");
		};
	})
}());