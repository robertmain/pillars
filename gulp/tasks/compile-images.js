"use strict";

var gulp = require("gulp"),
    c = require("../common.js"),
    reload = require("browser-sync").reload,
    $ = require("gulp-load-plugins")({
        camelize: true
    });

gulp.task("app:build:images:src", function(){
    var pipe = gulp.src(c.imagesSrcGlob)
        .pipe($.plumber({
            errorHandler: c.onError
        }))
        .pipe($.if(c.debug, $.filelog("app:build:images:src")))
        .pipe($.size({title: "app:build:style:src:pre"}))
        .pipe($.if(c.production, $.imagemin()))
        .pipe($.size({title: "app:build:style:src:post"}))
        .pipe(gulp.dest(c.imagesDist));
    pipe.pipe(reload({stream: true}));
    return pipe;
});
