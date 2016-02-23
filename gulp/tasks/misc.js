"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	browsersync = require("../browsersync.js"),
	mainBowerFiles = require("main-bower-files"),
	bower = require("bower"),
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("__app:copy:fonts", function(){
	var taskName = this.currentTask.name;
	return gulp.src(
			mainBowerFiles({filter: c.fontsRegex}),
			{ base: c.bowerComponents }
		)
		.pipe($.if(c.debug, $.debug({title: taskName})))
		.pipe(gulp.dest(c.fontsDist));
});

//This task matches empty directories so we exclude directories and only take files
gulp.task("__app:copy:files", function() {
	var taskName = this.currentTask.name;
	var pipe = gulp.src(c.otherFilesSrc, {nodir: true})
		.pipe(gulp.dest(c.dist))
		.pipe($.size({title: taskName}));
	pipe.on("end", browsersync.reload);
	return pipe;
});

gulp.task("__app:install:dependencies", function(callback){
	bower.commands.install()
		.on("end", function () {
			callback();
		});
});
