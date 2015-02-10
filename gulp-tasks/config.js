"use strict";

var gulpConfig = require(__dirname + "/config.json");

var src = gulpConfig.folderSettings.src;
var dist = gulpConfig.folderSettings.dist;
var pageFileTypes = gulpConfig.fileTypes.pages.join(",");

module.exports = {
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
    jsPolyfillsFile: gulpConfig.filenameSettings.jsPolyfillsFile,
    prefixBrowsers: gulpConfig.browserSettings.supportedBrowsers,

    pageFileTypes: pageFileTypes,
    htmlFiles: dist + "**/*.{" + pageFileTypes + "}",
    srcJs: src + "/**/*.js",

    bowerComponents: gulpConfig.folderSettings.bowerComponents
};
