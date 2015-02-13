"use strict";

var gulp = require("gulp"),
    c = require("../common.js");

gulp.task("__app:watch", function() {
    gulp.watch(c.srcStyles + "/**/**/*.scss", ["app:build:style:src"]);
    gulp.watch(c.srcJs, ["app:build:js:src"]);
    gulp.watch(c.srcJs, ["__app:test:js"]);
    gulp.watch(c.src + "/**/*.html", ["app:build:html:src"]);
    gulp.watch(c.src + "/**/*.{" + c.otherMyTypes + "}", ["__app:copy:files"]);
    gulp.watch(c.bowerComponents, ["app:build:js:vendor"]);
});
/*
gulp.task("__app:reload:html", function(){
    return gulp.src(c.htmlFiles)
    .pipe($.changed(c.htmlFiles))
    .pipe(reload({stream: true}))
    ;
});
*/
