"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	git = require("git-rev"),
	reload = require("browser-sync").reload,
	mainBowerFiles = require("main-bower-files"),
	path = require("path"),
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("app:build:style:src", function(callback) {
	git.short(function(rev){
		var sassFiles = mainBowerFiles({filter: /\.(scss)$/i});
		var sassDirectories = [];
		sassFiles.forEach(function(sassFile){
			sassDirectories.push(path.dirname(sassFile));
		});
		var pipe = gulp.src(c.srcStyles + "/**/*.scss")
			.pipe($.plumber({
				errorHandler: c.onError
			}))
			.pipe($.sass({
				includePaths: sassDirectories,
				outputStyle: "compressed",
				onError: c.onError
			}))
			.pipe($.if(!c.production, $.cssbeautify()))
			.pipe($.autoprefixer(c.prefixBrowsers, {cascade: true}))
			.pipe($.if(c.debug, $.filelog("app:build:style:src")))
			.pipe($.concat(c.concatSrcCSSFile))
			.pipe(
				$.header(
					"/*!\r\n * " + c.copyrightBanner.join("\r\n * ") + "\r\n*/\r\n",
					{
						packageFile: c.packageFile,
						gitRev: rev,
						d: new Date()
					}
				)
			)
			.pipe(gulp.dest(c.distStyles))
			.pipe(reload({stream: true, once: true}))
			.pipe($.size({title: "app:build:style:src"}));
		callback(null, pipe);
	});
});

gulp.task("app:build:style:vendor", function() {
	return gulp.src(mainBowerFiles({filter: /\.(s?css)$/i}))
		.pipe($.plumber({
			errorHandler: c.onError
		}))
		.pipe($.sass({
			includePaths: require("node-neat").with(require("node-bourbon").includePaths),
			outputStyle: "compressed",
			onError: c.onError
		}))
		.pipe($.autoprefixer(c.prefixBrowsers, {cascade: true}))
		.pipe($.concat(c.concatVendorCSSFile))
		.pipe(gulp.dest(c.distStyles))
		.pipe(reload({stream: true, once: true}))
		.pipe($.size({title: "app:build:style:vendor"}));
});
