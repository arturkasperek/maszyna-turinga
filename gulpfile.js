var gulp = require('gulp'),
    sass = require('gulp-sass'),
    webserver = require('gulp-webserver');

gulp.task('sass', function() {
    gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./website/css/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('webserver', function() {
    gulp.src('')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            port: 3000
        }));
});

gulp.task('default', ['sass', 'sass:watch', 'webserver']);
