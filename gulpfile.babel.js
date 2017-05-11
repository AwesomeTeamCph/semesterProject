'use strict';

import gulp from 'gulp';
import concat from 'gulp-concat';
import ngAnnotate from 'gulp-ng-annotate';
import plumber from 'gulp-plumber';
import strip from 'gulp-strip-comments';
import uglify from 'gulp-uglify';
import bytediff from 'gulp-bytediff';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import minifyCss from 'gulp-clean-css';
import del from 'del';
import env from 'gulp-env';
import templateCache from 'gulp-angular-templatecache';
import babel from 'gulp-babel';
import gls from 'gulp-live-server';
import runSequence from 'run-sequence';

gulp.task('default', ['watch']);

// for cleaning the public/src folder before each iteration
gulp.task('clean:dist', () => del(['public/dist', 'dist']));

gulp.task('clean:coverage', () => del(['coverage/']));

// for creating a single concatenated angular application, comments stripped out,
// an assuring that the injections are alright.
// creates an app.js file in the public/dist folder
gulp.task('app', () => {
  return gulp.src(['public/app/app.js', 'public/app/**/*.js'])
      .pipe(plumber())
      .pipe(babel())
      .pipe(concat('app.js', { newLine: ';' }))
      .pipe(ngAnnotate({ add: true }))
      .pipe(strip())
      .pipe(plumber.stop())
      .pipe(gulp.dest('public/dist/'));
});

// is for minifying the app.js created.
// creates an app.min.js file in the public/dist folder
gulp.task('app.min', () => {
  return gulp.src('public/dist/app.js')
      .pipe(plumber())
      .pipe(bytediff.start())
      .pipe(uglify({ mangle: true }))
      .pipe(bytediff.stop())
      .pipe(rename('app.min.js'))
      .pipe(plumber.stop())
      .pipe(gulp.dest('public/dist/'));
});

// is for minifying the style.css created.
// creates an css.min file in the public folder
gulp.task('style.css.min', () => {
  return gulp.src('public/style.css')
      .pipe(plumber())
      .pipe(bytediff.start())
      .pipe(autoprefixer())
      .pipe(minifyCss({ compatibility: 'ie8' }))
      .pipe(bytediff.stop())
      .pipe(rename('style.min.css'))
      .pipe(plumber.stop())
      .pipe(gulp.dest('public/'));
});

// For creating a templatecache of the html templates
gulp.task('html:cache', () => {
  return gulp.src('public/app/**/*.html')
      .pipe(plumber())
      .pipe(templateCache('templates.js', { standalone: true }))
      .pipe(plumber.stop())
      .pipe(gulp.dest('public/dist'));
});

gulp.task('mocha:env', () => {
  env({
    vars: {
      NODE_ENV: 'test'
    }
  });
});

gulp.task('dev:env', () => {
  env({
    vars: {
      NODE_ENV: 'development'
    }
  });
});

gulp.task('build', done => {
  runSequence('clean:dist',
      ['app', 'html:cache'],
      ['app.min'], done);
});

/*
// should be used for development
// is for watching for file changes, and then run the concat and minify tasks
gulp.task('watch', ['dev:env', 'build'], () => {
  const server = gls.new('./dist/bin/www');
  server.start();
  gulp.watch('public/app/!**!/!*.js', ['build:angular']);
  gulp.watch('public/style.css', ['css.min']);
  gulp.watch('public/!**!/!*.html', ['html:cache']);
});*/