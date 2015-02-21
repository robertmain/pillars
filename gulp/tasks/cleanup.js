"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	vinylPaths = require("vinyl-paths"),
	del = require("del"),
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("__app:clean:project", function() {
	return gulp.src(c.dist, {read: false})
		.pipe($.plumber({
			errorHandler: c.onError
		}))
		.pipe(vinylPaths(del));
});

gulp.task("__app:clean:css", function(){
	return gulp.src([c.distStylesGlob], {read: false})
		.pipe(vinylPaths(del));
});

gulp.task("__app:clean:js", function(){
	return gulp.src([c.distScriptsGlob], {read: false})
		.pipe(vinylPaths(del));
});

gulp.task("__app:clean:images", function(){
	return gulp.src([c.distImagesGlob], {read: false})
		.pipe(vinylPaths(del));
});
