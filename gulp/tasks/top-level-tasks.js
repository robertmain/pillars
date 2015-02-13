"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	runSequence = require("run-sequence");

gulp.task("app:test", function(callback){
	runSequence(
		[
			"app:build:js:vendor",
			"app:build:js:src"
		],
		"__app:test:js",
		callback
	);
});

gulp.task("app:build", function(callback) {
	var buildTasks = [
		"__app:clean:project",
		"__app:install:dependencies",
		[
			"app:build:style:src",
			"app:build:style:vendor",
			"app:build:html:src",
			"__app:copy:files",
			"app:build:js:vendor",
			"app:build:js:src"
		],
	];

	if(!c.production){
		buildTasks.push("__app:test:js");
	}
	buildTasks.push(callback);
	runSequence.apply(null, buildTasks);
});

gulp.task("app:serve", function(callback) {
	runSequence("app:build", "__app:watch", "__app:proxy:local", callback);
});
