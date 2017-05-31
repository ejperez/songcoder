'use strict';

var sass = require('gulp-sass');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');

gulp.task('default', function () {
	// place code for your default task here
});

gulp.task('scripts', function (cb) {
	pump([
			gulp.src('assets/js/*.js'),
			concat('scripts.js'),
			gulp.dest('dist/js'),
			rename('scripts.min.js'),
			uglify(),
			gulp.dest('dist/js')
		],
		cb
	);
});

gulp.task('styles', function (cb) {
	pump([
			gulp.src('assets/css/print.css'),
			cleanCSS(),
			rename('print.min.css'),
			gulp.dest('dist/css')
		],
		cb
	);
});

gulp.task('sass', function (cb) {
	pump([
			gulp.src('assets/sass/*.scss'),
			sass().on('error', sass.logError),
			gulp.dest('dist/css'),
			concat('styles.css'),
			cleanCSS(),
			rename('styles.min.css'),
			gulp.dest('dist/css')
		],
		cb
	);
});

gulp.task('sass:watch', function () {
	gulp.watch('assets/sass/*.scss', ['sass']);
});