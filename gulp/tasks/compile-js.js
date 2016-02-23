"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	git = require("git-rev"),
	browsersync = require("../browsersync.js"),
	mainBowerFiles = require("main-bower-files"),
	merge = require("event-stream").merge,
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("app:build:js:src", function(callback) {
	var taskName = this.currentTask.name;
	git.short(function(rev){
		var pipe = gulp.src(c.scriptsSrcGlob)
			.pipe($.plumber({
				errorHandler: c.onError
			}))
			.pipe($.order([
				"app.js",
				"app-*.js"
			]))
			.pipe($.if(!c.production, $.jscs({fix: false})))
			.pipe($.if(!c.production, $.jscs.reporter()))
			.pipe($.if(c.production, $.stripDebug()))
			.pipe($.if(!c.production, $.complexity({breakOnErrors: false})))
			.pipe($.if(c.debug, $.debug({title: taskName})))
			.pipe($.if(!c.production, $.sourcemaps.init()))
			.pipe($.concat(c.concatSrcJsFile))
			.pipe($.size({title: taskName}))
			//Any plugins between sourcemaps.init and sourcemaps.write need to have sourcemaps support
			//unless they don't modify the output. There's a list of compatible plugins on the gulp-sourcemaps page
			.pipe($.if(c.production, $.uglify(c.uglifyConfig)))
			//An issue is open about header's sourcemaps support but it isn't yet available
			//until then headers for this file are only enabled for production
			.pipe($.if(c.production,
				$.header(
					"/*!\r\n * " + c.copyrightBanner.join("\r\n * ") + "\r\n*/\r\n",
					{
						packageFile: c.packageFile,
						gitRev: rev,
						d: new Date()
					}
				)
			))
			.pipe($.if(!c.production, $.sourcemaps.write()))
			.pipe(gulp.dest(c.scriptsDist));

		pipe.on("end", callback);
		pipe.on("end", browsersync.reload);
	});
});

gulp.task("app:build:js:vendor", function(){
	var taskName = this.currentTask.name;
	var polyfillStream = gulp.src(c.scriptsSrcGlob)
		.pipe($.autopolyfiller(c.jsPolyfillsFile, {
			browsers: c.prefixBrowsers
		}));
	var vendorStream = gulp.src(mainBowerFiles({filter: c.scriptsRegex}))
		.pipe($.if(c.debug, $.debug({title: taskName})))
		.pipe($.concat(c.concatVendorJsFile));
	var pipe = merge(polyfillStream, vendorStream)
		.pipe($.plumber({
			errorHandler: c.onError
		}))
		.pipe($.order([
			c.jsPolyfillsFile,
			c.concatVendorJsFile
		]))
		.pipe($.if(c.debug, $.jsPrettify(), $.uglify(c.vendorUglifyConfig)))
		.pipe($.concat(c.concatVendorJsFile))
		.pipe(gulp.dest(c.scriptsDist))
		.pipe($.size({title: taskName}));
	pipe.on("end", browsersync.reload);
	return pipe;
});
