"use strict";

var self;
module.exports = exports = self = {
	"webserver": {
		"port": process.env.PORT || 8000,
		"static": __dirname + "/frontend/build"
	}
};