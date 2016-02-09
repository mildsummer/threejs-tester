var gulp = require('gulp');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');

var config  = require('../config');

// javascripts
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('lib', function(){
  gulp.src(config.src.lib)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(uglify({preserveComments:'some'})) // minify＆ライセンスコメント残す
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(config.dist.js))
    .pipe(browserSync.reload({stream: true}));
});