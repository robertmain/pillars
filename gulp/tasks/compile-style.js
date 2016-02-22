"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	config = require("../config.json"),
	git = require("git-rev"),
	reload = require("browser-sync").reload,
	mainBowerFiles = require("main-bower-files"),
	path = require("path"),
	url = require("url"),
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("app:build:style:src", function(callback) {
	var taskName = this.currentTask.name;
	git.short(function(rev){
		var pipe = gulp.src(c.stylesSrcGlob)
			.pipe($.plumber({
				errorHandler: c.onError
			}))
			.pipe($.sass({
				includePaths: c.projectRoot + path.sep + c.bowerComponents
			}))
			.pipe($.autoprefixer({browsers: c.prefixBrowsers, cascade: !c.production}))
			.pipe($.if(c.production, $.csso(), $.cssbeautify()))
			.pipe($.if(c.debug, $.debug({title: taskName})))
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
			.pipe(gulp.dest(c.stylesDist))
			.pipe($.size({title: taskName}));
		pipe.on("end", callback);
		pipe.pipe(reload({stream: true, once: true}));
	});
});

gulp.task("app:build:style:vendor", function() {
	var taskName = this.currentTask.name;
	var urlRewriter = function(rewriteurl, filename){
		if(rewriteurl.charAt(0) === "/"){
			return rewriteurl;
		}
		var absUrl = path.resolve(path.dirname(filename), rewriteurl);
		var rootRelative = path.relative(c.bowerComponents, absUrl);
		rootRelative = rootRelative.replace(/\\/g, "/");
		var fileUrl = url.parse(rootRelative);
		if(config.fileTypes.fonts.indexOf(path.extname(fileUrl.pathname).substr(1)) !== -1){
			return "/" + config.folderSettings.subFolders.fonts + "/" + rootRelative;
		}
		return rewriteurl;
	};

	return gulp.src(mainBowerFiles({filter: c.stylesRegex}))
		.pipe($.plumber({
			errorHandler: c.onError
		}))
		.pipe($.if(c.debug, $.debug({title: taskName})))
		.pipe($.sass({onError: c.onError}))
		.pipe($.cssUrlAdjuster({replace: urlRewriter}))
		.pipe($.if(!!c.debug, $.cssbeautify(), $.csso()))
		.pipe($.autoprefixer({browsers: c.prefixBrowsers, cascade: true}))
		.pipe($.concat(c.concatVendorCSSFile))
		.pipe(gulp.dest(c.stylesDist))
		.pipe(reload({stream: true, once: true}))
		.pipe($.size({title: taskName}));
});
