var gulp = require('gulp');

// default
gulp.task('default', [
  'server',
  'copy',
  'html',
  'css',
  'sprite',
  'iconfont',
  'imgMin',
  'imgMinPng',
  'js',
  'lib',
  'watch'
]);

