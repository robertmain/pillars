"use strict";
var gulp = require("gulp");

module.exports = gulp; //for Chrome plugin + gulp-devtools
var gulpCommon = require("./gulp/common.js");
process.on("uncaughtException", function(e){
    gulpCommon.onError(e);
});

//Load custom tasks from the `gulp/tasks` directory (if it exists)
require("require-dir")("gulp/tasks");
