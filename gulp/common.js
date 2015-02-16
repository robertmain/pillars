"use strict";

var gulpConfig = require(__dirname + "/config.json"),
	argv = require("yargs").argv,
	PrettyError = require("pretty-error"),
	appConfig = require(__dirname + "/../config.js");

var src = gulpConfig.folderSettings.src;
var dist = appConfig.webserver.staticDir;
var pageFileTypes = gulpConfig.fileTypes.pages.join(",");

module.exports = {
	//Paths
	src: src,
	dist: dist,
	imageFileTypes: gulpConfig.fileTypes.images.join(","),
	otherMyTypes: gulpConfig.fileTypes.fonts.concat(gulpConfig.fileTypes.images).join(","),
	srcStyles: src + "/" + gulpConfig.folderSettings.styles,
	distStyles: dist + "/" + gulpConfig.folderSettings.styles,
	srcScripts: src + "/" + gulpConfig.folderSettings.scripts,
	distScripts: dist + "/" + gulpConfig.folderSettings.scripts,
	srcImages: src + "/" + gulpConfig.folderSettings.images,
	distImages: dist + "/" + gulpConfig.folderSettings.images,
	concatSrcCSSFile: gulpConfig.filenameSettings.concatSrcCSSFile,
	concatVendorCSSFile: gulpConfig.filenameSettings.concatVendorCSSFile,
	concatSrcJsFile: gulpConfig.filenameSettings.concatSrcJsFile,
	concatVendorJsFile: gulpConfig.filenameSettings.concatVendorJsFile,
	prefixBrowsers: gulpConfig.browserSettings.supportedBrowsers,

	pageFileTypes: pageFileTypes,
	htmlFiles: dist + "**/*.{" + pageFileTypes + "}",
	srcJs: src + "/**/*.js",

	bowerComponents: gulpConfig.folderSettings.bowerComponents,

	//Misc
	production: Boolean(argv.production),
	onError: function(error) {
		var pe = new PrettyError();
		pe.skipNodeFiles();
		console.log(pe.render(error));
	},
	uglifyConfig: {
		mangle: true,
		preserveComments: "some",
		output: {
			beautify: false
		}
	},
	copyrightBanner: [
		"@copyright <%= packageFile.author %> <%= d.getFullYear() %> - <%= packageFile.description %>",
		"@version v<%= packageFile.version %>",
		"@link <%= packageFile.homepage %>",
		"@license <%= packageFile.license %>",
		"@revision <%= gitRev %>"
	],
	packageFile: require("../package.json"),
	jsPolyfillsFile: gulpConfig.filenameSettings.jsPolyfillsFile
};
