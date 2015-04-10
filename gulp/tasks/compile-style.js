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
	git.short(function(rev){
		var sassFiles = mainBowerFiles({filter: c.stylesRegex});
		var sassDirectories = [];
		sassFiles.forEach(function(sassFile){
			sassDirectories.push(path.dirname(sassFile));
		});
		var pipe = gulp.src(c.stylesSrcGlob)
			.pipe($.plumber({
				errorHandler: c.onError
			}))
			.pipe($.sass({
				includePaths: sassDirectories,
				onError: c.onError
			}))
			.pipe($.autoprefixer({browsers: c.prefixBrowsers, cascade: !c.production}))
			.pipe($.if(c.production, $.csso(), $.cssbeautify()))
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
			.pipe(gulp.dest(c.stylesDist))
			.pipe($.size({title: "app:build:style:src"}));
		pipe.on("end", callback);
		pipe.pipe(reload({stream: true, once: true}));
	});
});

gulp.task("app:build:style:vendor", function() {
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
		.pipe($.if(c.debug, $.filelog("app:build:style:vendor")))
		.pipe($.sass({onError: c.onError}))
		.pipe($.cssUrlAdjuster({replace: urlRewriter}))
		.pipe($.if(!!c.debug, $.cssbeautify(), $.csso()))
		.pipe($.autoprefixer({browsers: c.prefixBrowsers, cascade: true}))
		.pipe($.concat(c.concatVendorCSSFile))
		.pipe(gulp.dest(c.stylesDist))
		.pipe(reload({stream: true, once: true}))
		.pipe($.size({title: "app:build:style:vendor"}));
});
