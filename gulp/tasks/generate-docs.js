var gulp = require('gulp'),
    sassDoc = require('sassdoc'),
    config = require("../config.json"),
    $ = require("gulp-load-plugins")({
        camelize: true
    }),
    path = require('path'),
    c = require("../common.js");

gulp.task('app:generate:docs:sass', function(){
    return gulp.src(c.src + path.sep+ config.folderSettings.subFolders.styles + path.sep + 'utils' + path.sep + '**/*.{css,scss}')
        .pipe($.if(c.debug, $.filelog(this.currentTask.name)))
        .pipe(sassDoc({
            dest: config.folderSettings.docs + path.sep + 'sass',
            groups: {
                undefined: 'Miscellaneous',
                colours: 'Colours',
                components: 'Components',
                spacing: 'Spacing',
                typography: 'Typography'
            }
        }));
});