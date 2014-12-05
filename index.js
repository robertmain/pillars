'use strict';

var express = require('express'),
	app = express(),
	frontEndConfig = require(__dirname + '/frontend/config.js'),
	gulpConfig = require(__dirname + '/gulp-tasks/config.json'),
	packageFile = require(__dirname + '/package.json');

app.use(express.static(__dirname + '/' + gulpConfig.folderSettings.dist));
app.listen(frontEndConfig.webserver.port);