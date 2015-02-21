"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	git = require("git-rev"),
	reload = require("browser-sync").reload,
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("app:build:html:src", function(callback){
	git.short(function(rev){
		var pipe = gulp.src(c.pagesSrcGlob)
			.pipe(
				$.if(c.production,
					$.minifyHtml({
						empty: true
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
			.pipe($.if(c.debug, $.filelog("app:build:html:src")))
			.pipe(gulp.dest(c.dist));
		pipe.on("end", callback);
		pipe.pipe(reload({stream: true}));
	});
});
