"use strict";

var gulp = require("gulp"),
    c = require("../common.js"),
    browsersync = require("../browsersync.js"),
    $ = require("gulp-load-plugins")({
        camelize: true
    });

gulp.task("app:build:images:src", function(){
    var taskName = this.currentTask.name;
    var pipe = gulp.src(c.imagesSrcGlob)
        .pipe($.plumber({
            errorHandler: c.onError
        }))
        .pipe($.if(c.debug, $.debug({title: taskName})))
        .pipe($.size({title: taskName + ":pre"}))
        .pipe($.if(c.production, $.imagemin()))
        .pipe($.size({title: taskName + ":post"}))
        .pipe(gulp.dest(c.imagesDist));
    pipe.on("end", browsersync.reload);
    return pipe;
});
