"use strict";

var self;
module.exports = exports = self = {
	"webserver": {
		"port": process.env.PORT || 8000,
		"staticDir": __dirname + "/frontend/build"
	}
};