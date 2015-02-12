"use strict";

var gulp = require("gulp"),
merge = require("event-stream").merge,
browserSync = require("browser-sync"),
packageFile = require("../package.json"),
frontEndConfig = require("../frontend/config.js"),
$ = require("gulp-load-plugins")({
    camelize: true
}),
runSequence = require("run-sequence"),
mainBowerFiles = require("main-bower-files"),
reload = browserSync.reload,
PrettyError = require("pretty-error"),
del = require("del"),
vinylPaths = require("vinyl-paths"),
argv = require("yargs").argv,
git = require("git-rev"),
path = require("path"),
c = require("./config.js");

var onError = function(error) {
    var pe = new PrettyError();
    pe.skipNodeFiles();
    console.log(pe.render(error));
};

var uglifyConfig = {
    mangle: true,
    preserveComments: "some",
    output: {
        beautify: false
    }
};

var production = argv.production,
    debug = argv.debug;

var copyrightBanner = [
    "@copyright <%= packageFile.author %> <%= d.getFullYear() %> - <%= packageFile.description %>",
    "@version v<%= packageFile.version %>",
    "@link <%= packageFile.homepage %>",
    "@license <%= packageFile.license %>",
    "@revision <%= gitRev %>"
];

process.on("uncaughtException", function(e){
    onError(e);
});

gulp.task("app:build:js:src", function(callback) {
    git.short(function(rev){
        var srcStream = gulp.src(c.srcScripts + "/*.js")
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.order([
            "app.js",
            "app-*.js"
        ]))
        .pipe($.if(!!production, $.stripDebug()))
        .pipe($.if(!production, $.complexity({breakOnErrors: false})))
        .pipe($.if(debug, $.filelog()))
        .pipe($.size({title: "app:build:js:src"}));

        var polyfillStream = srcStream.pipe($.autopolyfiller(c.jsPolyfillsFile, {
            browsers: c.prefixBrowsers
        }));
        callback(null, merge(polyfillStream, srcStream)
                .pipe($.order([
                    c.jsPolyfillsFile,
                    c.concatSrcJsFile
                ]))
                .pipe($.concat(c.concatSrcJsFile))
                .pipe($.if(!!production, $.uglify(uglifyConfig), $.jsPrettify()))
                .pipe(
                    $.header(
                        "/*!\r\n * " + copyrightBanner.join("\r\n * ") + "\r\n*/\r\n",
                        {
                            packageFile: packageFile,
                            gitRev: rev,
                            d: new Date()
                        }
                    )
                )
                .pipe(gulp.dest(c.distScripts))
                .pipe(reload({stream: true, once: true}))
            );
    });
});

gulp.task("app:build:js:vendor", function(){
    return gulp.src(mainBowerFiles({filter: /\.(js)$/i}))
    .pipe($.plumber({
        errorHandler: onError
    }))
    .pipe($.if(debug, $.filelog()))
    .pipe($.concat(c.concatVendorJsFile))
    .pipe($.uglify(uglifyConfig))
    .pipe(gulp.dest(c.distScripts))
    .pipe(reload({stream: true, once: true}))
    .pipe($.size({title: "app:build:js:vendor"}));
});

gulp.task("app:build:style:src", function(callback) {
    var sassFiles = mainBowerFiles({filter: /\.(scss)$/i});
    var sassDirectories = [];
    sassFiles.forEach(function(sassFile){
        sassDirectories.push(path.dirname(sassFile));
    });
    git.short(function(rev){
        var pipe = gulp.src(c.srcStyles + "/**/*.scss")
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.if(!!production, $.sass({
            includePaths: require("node-neat").with(require("node-bourbon").includePaths).concat(sassDirectories),
            outputStyle: "compressed",
            onError: onError
        }), $.sass({
            includePaths: require("node-neat").with(require("node-bourbon").includePaths).concat(sassDirectories),
            outputStyle: "expanded",
            onError: onError
        })))
        .pipe($.autoprefixer(c.prefixBrowsers, {cascade: true}))
        .pipe($.if(debug, $.filelog()))
        .pipe($.concat(c.concatSrcCSSFile))
        .pipe(
            $.header(
                "/*!\r\n * " + copyrightBanner.join("\r\n * ") + "\r\n*/\r\n",
                {
                    packageFile: packageFile,
                    gitRev: rev,
                    d: new Date()
                }
            )
        )
        .pipe(gulp.dest(c.distStyles))
        .pipe(reload({stream: true, once: true}))
        .pipe($.size({title: "app:build:style:src"}));
        callback(null, pipe);
    });
});

gulp.task("app:build:style:vendor", function() {
    return gulp.src(mainBowerFiles({filter: /\.(css)$/i}))
    .pipe($.plumber({
        errorHandler: onError
    }))
    .pipe($.sass({
        includePaths: mainBowerFiles({filter: /\.(scss)$/i}),
        outputStyle: "compressed",
        onError: onError
    }))
    .pipe($.autoprefixer(c.prefixBrowsers, {cascade: true}))
    .pipe($.if(debug, $.filelog()))
    .pipe($.concat(c.concatVendorCSSFile))
    .pipe(gulp.dest(c.distStyles))
    .pipe(reload({stream: true, once: true}))
    .pipe($.size({title: "app:build:style:vendor"}));
});

gulp.task("app:build:html:src", function(callback){
    runSequence("__app:reload:html");
    git.short(function(rev){
        var pipe = gulp.src(c.src + "/**/*.html")
        .pipe(
            $.if(!!production,
                $.minifyHtml({
                    empty: true
                }),
                $.htmlPrettify({
                    "indent_char": "\t",
                    "indent_size": "1"
                })
            )
        )
        .pipe(
            $.header(
                "<!--\r\n * " + copyrightBanner.join("\r\n * ") + "\r\n-->\r\n",
                {
                    packageFile: packageFile,
                    gitRev: rev,
                    d: new Date()
                }
            )
        )
        .pipe($.if(debug, $.filelog()))
        .pipe(gulp.dest(c.dist))
        .pipe(reload({stream: true, once: true}));
        callback(null, pipe);
    });
});

gulp.task("app:test:js", function(callback){
    runSequence(
        [
            "app:build:js:vendor",
            "app:build:js:src"
        ],
        "__app:test:js",
        callback
    );
});

gulp.task("app:build", function(callback) {
    var buildTasks = [
        "__app:clean:project",
        "__app:install:dependencies",
        [
            "app:build:style:src",
            "app:build:style:vendor",
            "app:build:html:src",
            "__app:copy:files",
            "app:build:js:vendor",
            "app:build:js:src"
        ],
    ];

    if(!production){
        buildTasks.push("__app:test:js");
    }
    buildTasks.push(callback);
    runSequence.apply(null, buildTasks);
});

gulp.task("app:serve", function(callback) {
    runSequence("app:build", "__app:watch", "__app:proxy:local", callback);
});


/**
* Private Tasks
*
* Since JS doesn"t support proper OOP, these tasks have double underscores at the beginning
* of their names to incidcate privacy. That is to say that whilst these tasks /can/ be called
* from the command line, they are really reserved only for internal use by other gulp tasks.
*
*/

gulp.task("__app:test:js", function(){
    return gulp.src([
        c.distScripts + "/" + c.concatVendorJsFile,
        c.distScripts + "/" + c.concatSrcJsFile,
        "test/frontend/**/*.test.js"
    ])
    .pipe($.karma({
        configFile: "test/frontend/karma.conf.js",
        action: "run"
    }))
    .on("error", function(err) {
        throw err;
    });
});

gulp.task("__app:watch", function() {
    gulp.watch(c.srcStyles + "/**/**/*.scss", ["app:build:style:src"]);
    gulp.watch(c.srcJs, ["app:build:js:src"]);
    gulp.watch(c.srcJs, ["__app:test:js"]);
    gulp.watch(c.src + "/**/*.html", ["app:build:html:src"]);
    gulp.watch(c.src + "/**/*.{" + c.otherMyTypes + "}", ["__app:copy:files"]);
    gulp.watch(c.bowerComponents, ["app:build:js:vendor"]);
});

gulp.task("__app:clean:project", function() {
    return gulp.src(c.dist, {read: false})
    .pipe($.plumber({
        errorHandler: onError
    }))
    .pipe(vinylPaths(del));
});

gulp.task("__app:copy:files", function() {
    return gulp.src([
        c.src + "/**/*.{" + c.otherMyTypes + "}",
        "!" + c.src + "/" + "/*." + c.pageFileTypes,
        "!" + c.srcScripts + "/**/*.*",
        "!" + c.srcStyles + "/**/*.*"
    ])
    .pipe(gulp.dest(c.dist))
    .pipe(reload({stream: true, once: true}))
    .pipe($.size({title: "__app:copy:files"}));
});

gulp.task("__app:install:dependencies", $.shell.task(["bower install"]));

gulp.task("__app:serve:local", function() {
    browserSync({
        notify: true,
        open: false,
        tunnel: true,
        logConnections: true,
        logPrefix: packageFile.name,
        server:{
            baseDir: c.dist,
            directory: true
        }
    });
});

gulp.task("__app:proxy:local", function() {
    $.shell.task(["node " + packageFile.main])();
    browserSync({
        notify: true,
        open: false,
        tunnel: true,
        logConnections: true,
        logPrefix: packageFile.name,
        proxy: "localhost:" + frontEndConfig.webserver.port
    });
});

gulp.task("__app:clean:css", function(){
    return gulp.src([c.dist + "**/*.css"], {read: false})
    .pipe(vinylPaths(del))
    ;
});

gulp.task("__app:clean:js", function(){
    return gulp.src([c.dist + "**/*.js"], {read: false})
    .pipe(vinylPaths(del))
    ;
});

gulp.task("__app:clean:images", function(){
    return gulp.src([c.dist + "**/*.{" + c.imageFileTypes + "}"], {read: false})
    .pipe(vinylPaths(del))
    ;
});

gulp.task("__app:reload:html", function(){
    return gulp.src(c.htmlFiles)
    .pipe($.changed(c.htmlFiles))
    .pipe(reload({stream: true}))
    ;
});

/**
* End Private Tasks
*
*/
