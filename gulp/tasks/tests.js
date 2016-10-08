"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	$ = require("gulp-load-plugins")({
		camelize: true
	}),
	karma = require('karma').Server;

gulp.task("__app:test:js", function(done){
	new Server({
		configFile: __dirname + '../../test/frontend/karma.conf.js',
		singleRun: true
	}, done).start();
});
