"use strict";

var gulp = require("gulp"),
	c = require("../common.js");

gulp.task("__app:watch", function() {
	gulp.watch(c.stylesSrcGlob, ["app:build:style:src"]);
	gulp.watch(c.scriptsSrcGlob, ["app:build:js:src"]);
	gulp.watch(c.scriptsSrcGlob, ["__app:test:js"]);
	gulp.watch(c.pagesSrcGlob, ["app:build:html:src"]);
	//gulp.watch(c.imagesSrcGlob, ["app:build:images:src"]);
	gulp.watch(c.otherFilesSrc, ["__app:copy:files"]);
	gulp.watch(c.bowerComponents, ["app:build"]);
});
