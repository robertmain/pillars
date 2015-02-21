"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	reload = require("browser-sync").reload,
	mainBowerFiles = require("main-bower-files"),
	bower = require("bower"),
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("__app:copy:fonts", function(){
	return gulp.src(
			mainBowerFiles({filter: c.fontsRegex}),
			{ base: c.bowerComponents }
		)
		.pipe($.if(c.debug, $.filelog("__app:copy:fonts")))
		.pipe(gulp.dest(c.fontsDist));
});

//This task matches empty directories so we exclude directories and only take files
gulp.task("__app:copy:files", function() {
	return gulp.src(c.otherFilesSrc, {nodir: true})
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
