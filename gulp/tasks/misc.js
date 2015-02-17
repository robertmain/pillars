"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	reload = require("browser-sync").reload,
	bower = require("bower"),
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("__app:copy:files", function() {
	return gulp.src([
		c.src + "/**/*.{" + c.otherMyTypes + "}",
		"!" + c.src + "/" + "/*." + c.pageFileTypes,
		"!" + c.srcScripts + "/**/*.*",
		"!" + c.srcStyles + "/**/*.*"
	])
	.pipe($.if(c.debug, $.filelog("__app:copy:files")))
	.pipe(gulp.dest(c.dist))
	.pipe(reload({stream: true, once: true}))
	.pipe($.size({title: "__app:copy:files"}));
});

gulp.task("__app:install:dependencies", function(callback){
	bower.commands.install()
		.on("end", function () {
			callback();
		});
});
