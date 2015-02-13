"use strict";

var gulp = require("gulp"),
	c = require("../common.js"),
	browserSync = require("browser-sync"),
	appConfig = require("../../config.js"),
	$ = require("gulp-load-plugins")({
		camelize: true
	});

gulp.task("__app:serve:local", function() {
	browserSync({
		notify: true,
		open: false,
		tunnel: true,
		logConnections: true,
		logPrefix: c.packageFile.name,
		server:{
			baseDir: c.dist,
			directory: true
		}
	});
});

gulp.task("__app:proxy:local", function() {
	$.shell.task(["node " + c.packageFile.main])();
	browserSync({
		notify: true,
		open: false,
		tunnel: true,
		logConnections: true,
		logPrefix: c.packageFile.name,
		proxy: "localhost:" + appConfig.webserver.port
	});
});
