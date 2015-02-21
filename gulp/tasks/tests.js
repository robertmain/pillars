"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("__app:test:js", function(){
	return gulp.src([
		c.scriptsDist + "/" + c.concatVendorJsFile,
		c.scriptsDist + "/" + c.concatSrcJsFile,
		"test/frontend/**/*.test.js"
	])
		.pipe($.karma({
			configFile: "test/frontend/karma.conf.js",
			action: "run"
		}))
		.on("error", function(err) {
			throw err;
		});
});
