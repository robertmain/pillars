"use strict";
var gulp = require("gulp");

module.exports = gulp; //for Chrome plugin + gulp-devtools
var gulpCommon = require("./gulp/common.js");
process.on("uncaughtException", function(e){
    gulpCommon.onError(e);
});

//Sets up the magic that allows us to grab the task name inside the task
gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
gulp.Gulp.prototype._runTask = function(task) {
  this.currentTask = task;
  this.__runTask(task);
}

//Load custom tasks from the `gulp/tasks` directory (if it exists)
require("require-dir")("gulp/tasks");
