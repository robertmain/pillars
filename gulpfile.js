'use strict';
var gulp = require('gulp');

module.exports = gulp; //for Chrome plugin + gulp-devtools

//Load custom tasks from the `gulp-tasks` directory (if it exists)
require('require-dir')('gulp-tasks');