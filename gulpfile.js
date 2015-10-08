'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('default', [
  'scripts',
  'static',
  'styles',
  'templates'
], function() {
  console.log('You Dun Bin Gulped!!!1!!');
});

gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('static', function() {
  console.log('Ran Static');
});

gulp.task('styles', function() {
  console.log('Ran Styles');
});

gulp.task('templates', function() {
  return gulp.src('src/templates/**/*.html')
    .pipe(gulp.dest('build'));
});
