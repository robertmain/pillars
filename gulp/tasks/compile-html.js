"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	git = require("git-rev"),
	browsersync = require("../browsersync.js"),
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("app:build:html:src", function(callback){
	var taskName = this.currentTask.name;
	git.short(function(rev){
		var pipe = gulp.src(c.pagesSrcGlob)
			.pipe(
				$.if(c.production,
					$.htmlmin({
						collapseWhitespace: true
					}),
					$.htmlPrettify({
						"indent_char": "\t",
						"indent_size": "1"
					})
				)
			)
			.pipe(
				$.header(
					"<!--\r\n * " + c.copyrightBanner.join("\r\n * ") + "\r\n-->\r\n",
					{
						packageFile: c.packageFile,
						gitRev: rev,
						d: new Date()
					}
				)
			)
			.pipe($.if(c.debug, $.debug({title: taskName})))
			.pipe(gulp.dest(c.dist));
		pipe.on("end", callback);
		pipe.on("end", browsersync.reload);
	});
});
