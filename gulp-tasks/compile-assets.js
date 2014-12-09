'use strict';

var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	gulpConfig = require(__dirname + '/config.json'),
	packageFile = require('../package.json'),
	frontEndConfig = require('../frontend/config.js'),
	$ = require('gulp-load-plugins')({
		camelize: true
	}),
	runSequence = require('run-sequence'),
	mainBowerFiles = require('main-bower-files'),
	reload = browserSync.reload,
	PrettyError = require('pretty-error'),
	del = require('del'),
	vinylPaths = require('vinyl-paths'),
	argv = require('yargs').argv;

var pageFileTypeArray = ['html'],
	fontFileTypeArray = ['eot', 'svg', 'ttf', 'woff'],
	imageFileTypeArray = ['jpg', 'JPG', 'png', 'PNG'];

var src = gulpConfig.folderSettings.src,
	dist = gulpConfig.folderSettings.dist,
	imageFileTypes = imageFileTypeArray.join(','),
	otherMyTypes = fontFileTypeArray.concat(imageFileTypeArray).join(','), //html,eot,svg,ttf,woff
	srcStyles = src + '/' + gulpConfig.folderSettings.styles,
	distStyles = dist + '/' + gulpConfig.folderSettings.styles,
	srcScripts = src + '/' + gulpConfig.folderSettings.scripts,
	distScripts = dist + '/' + gulpConfig.folderSettings.scripts,
	srcImages = src + '/' + gulpConfig.folderSettings.images,
	distImages = dist + '/' + gulpConfig.folderSettings.images,
	concatSrcCSSFile = gulpConfig.filenameSettings.concatSrcCSSFile,
	concatVendorCSSFile = gulpConfig.filenameSettings.concatVendorCSSFile,
	concatSrcJsFile = gulpConfig.filenameSettings.concatSrcJsFile,
	concatVendorJsFile = gulpConfig.filenameSettings.concatVendorJsFile,
	prefixBrowsers = gulpConfig.browserSettings.supportedBrowsers;

var pageFileTypes = pageFileTypeArray.join(','),
	htmlFiles = dist + '**/*.{' + pageFileTypes + '}',
	srcJs = src + '/**/*.js';

var onError = function(error) {
	var pe = new PrettyError();
	pe.skipNodeFiles();
	console.log(pe.render(error));
};

var uglifyConfig = {
	mangle: true,
	preserveComments: 'some',
	output: {
		beautify: false
	}
};

var production = argv.production;

var copyrightBanner = ['\@copyright <%= packageFile.author %> <%= d.getFullYear() %> - <%= packageFile.description %>',
	'@version v<%= packageFile.version %>',
	'@link <%= packageFile.homepage %>',
	'@license <%= packageFile.license %>'];

process.on('uncaughtException', function(e){
	onError(e);
});

gulp.task('app:build:js:src', function() {
	return gulp.src(srcScripts + '/*.js')
	.pipe($.plumber({
		errorHandler: onError
	}))
	.pipe($.order([
		'app.js',
		'app-*.js'
	]))
	.pipe($.if(!!production, $.stripDebug()))
	.pipe($.complexity({breakOnErrors: false}))
	.pipe($.concat(concatSrcJsFile))
	.pipe($.if(!!production, $.uglify(uglifyConfig), $.jsPrettify()))
	.pipe($.header('/*!\r\n * ' + copyrightBanner.join('\r\n * ') + '\r\n*/\r\n', {packageFile: packageFile, d: new Date()}))
	.pipe(gulp.dest(distScripts))
	.pipe(reload({stream: true, once: true}))
	.pipe($.size({title: 'app:build:js:src'}));
});

gulp.task('app:build:js:vendor', function(){
	return gulp.src(mainBowerFiles({filter: /\.(js)$/i}))
	.pipe($.plumber({
		errorHandler: onError
	}))
	.pipe($.concat(concatVendorJsFile))
	.pipe($.uglify(uglifyConfig))
	.pipe(gulp.dest(distScripts))
	.pipe(reload({stream: true, once: true}))
	.pipe($.size({title: 'app:build:js:vendor'}));
});

gulp.task('app:build:style:src', function() {
	return gulp.src(srcStyles + '/**/*.scss')
	.pipe($.plumber({
		errorHandler: onError
	}))
	.pipe($.if(!!production, $.sass({
		includePaths: require('node-neat').with(require('node-bourbon').includePaths),
		outputStyle: 'compressed',
		onError: onError
	}), $.sass({
		includePaths: require('node-neat').with(require('node-bourbon').includePaths),
		outputStyle: 'expanded',
		onError: onError
	})))
	.pipe($.autoprefixer(prefixBrowsers, {cascade: true}))
	.pipe($.concat(concatSrcCSSFile))
	.pipe($.header('/*!\r\n * ' + copyrightBanner.join('\r\n * ') + '\r\n*/\r\n', {packageFile: packageFile, d: new Date()}))
	.pipe(gulp.dest(distStyles))
	.pipe(reload({stream: true, once: true}))
	.pipe($.size({title: 'app:build:style:src'}));
});

gulp.task('app:build:style:vendor', function() {
	return gulp.src(mainBowerFiles({filter: /\.(s?css)$/i}))
	.pipe($.plumber({
		errorHandler: onError
	}))
	.pipe($.sass({
		includePaths: require('node-neat').with(require('node-bourbon').includePaths),
		outputStyle: 'compressed',
		onError: onError
	}))
	.pipe($.autoprefixer(prefixBrowsers, {cascade: true}))
	.pipe($.concat(concatVendorCSSFile))
	.pipe(gulp.dest(distStyles))
	.pipe(reload({stream: true, once: true}))
	.pipe($.size({title: 'app:build:style:vendor'}));
});

gulp.task('app:build:html:src', function(){
	runSequence('__app:reload:html');
	return gulp.src(src + '/**/*.html')
	.pipe($.if(!!production, $.minifyHtml({empty: true}), $.htmlPrettify({indent_char: '\t', indent_size: '1'})))
	.pipe($.header('<!--\r\n * ' + copyrightBanner.join('\r\n * ') + '\r\n-->\r\n', {packageFile: packageFile, d: new Date()}))
	.pipe(gulp.dest(dist))
	.pipe(reload({stream: true, once: true}));
});

gulp.task('app:test:js', function(callback){
	runSequence([
		'app:build:js:vendor',
		'app:build:js:src'
	], '__app:test:js', callback);
});

gulp.task('app:build', function(callback) {
	runSequence('__app:clean:project','__app:install:dependencies',
		[
			'app:build:style:src',
			'app:build:style:vendor',
			'app:build:html:src',
			'__app:copy:files',
			'app:build:js:vendor'
		],
		'app:build:js:src',
		// 'app:test:js:src',
		callback);
});

gulp.task('app:serve', function(callback) {
	runSequence('app:build', '__app:watch', '__app:proxy:local', callback);
});


/**
 * Private Tasks
 *
 * Since JS doesn't support proper OOP, these tasks have double underscores at the beginning
 * of their names to incidcate privacy. That is to say that whilst these tasks /can/ be called
 * from the command line, they are really reserved only for internal use by other gulp tasks.
 *
*/

gulp.task('__app:test:js', function(){
	return gulp.src([
		distScripts + '/vendor.js',
		distScripts + '/src.js',
		'test/frontend/*.test.js'
	])
	.pipe($.karma({
		configFile: 'test/frontend/karma.conf.js',
		action: 'run'
	}))
	.on('error', function(err) {
		throw err;
	});
});

gulp.task('__app:watch', function() {
	gulp.watch(srcStyles + '/**/**/*.scss', ['app:build:style:src']);
	gulp.watch(srcJs, ['app:build:js:src']);
	gulp.watch(srcJs, ['app:test:js:src']);
	gulp.watch(src + '/**/*.html', ['app:build:html:src']);
	gulp.watch(src + '/**/*.{' + otherMyTypes + '}', ['__app:copy:files']);
	gulp.watch(gulpConfig.folderSettings.bowerComponents, ['app:build:js:vendor']);
});

gulp.task('__app:clean:project', function() {
	return gulp.src(dist, {read: false})
	.pipe($.plumber({
		errorHandler: onError
	}))
	.pipe(vinylPaths(del));
});

gulp.task('__app:copy:files', function() {
	return gulp.src([
		src + '/**/*.{' + otherMyTypes + '}',
		'!' + src + '/' + '/*.' + pageFileTypes,
		'!' + srcScripts + '/**/*.*',
		'!' + srcStyles + '/**/*.*'
	])
	.pipe(gulp.dest(dist))
	.pipe(reload({stream: true, once: true}))
	.pipe($.size({title: '__app:copy:files'}));
});

gulp.task('__app:install:dependencies', $.shell.task([
	'bower install'
]));

gulp.task('__app:serve:local', function() {
	browserSync({
		notify: true,
		open: false,
		tunnel: true,
		logConnections: true,
		logPrefix: packageFile.name,
		server:{
			baseDir: dist,
			directory: true
		}
	});
});

gulp.task('__app:proxy:local', function() {
	$.shell.task([
		'node index.js'
	])();
	browserSync({
		notify: true,
		open: false,
		tunnel: true,
		logConnections: true,
		logPrefix: packageFile.name,
		proxy: 'localhost:' + frontEndConfig.webserver.port
	});
});

gulp.task('__app:clean:css', function(){
	return gulp.src([dist + '**/*.css'], {read: false})
		.pipe(vinylPaths(del))
	;
});

gulp.task('__app:clean:js', function(){
	return gulp.src([dist + '**/*.js'], {read: false})
		.pipe(vinylPaths(del))
	;
});

gulp.task('__app:clean:images', function(){
	return gulp.src([dist + '**/*.{' + imageFileTypes + '}'], {read: false})
		.pipe(vinylPaths(del))
	;
});

gulp.task('__app:reload:html', function(){
	return gulp.src(htmlFiles)
		.pipe($.changed(htmlFiles))
		.pipe(reload({stream: true}))
	;
});

/**
 * End Private Tasks
 *
*/
