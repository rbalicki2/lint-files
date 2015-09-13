'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    notify = require('gulp-notify'),
    config = require('./config.json'),
    argv = require('./argv.js'),
    glob = require('glob'),
    _ = require('lodash');

gulp.task('lint', ['lint-src', 'lint-gulp']);

gulp.task('lint-src', function() {
  var paramFiles,
      allFiles,
      filesToLint;

  if (argv.files) {
    allFiles = globArray(config.selectors.srcScripts);
    paramFiles = parseFiles(argv.files);
    filesToLint = _.intersection(allFiles,paramFiles);
  } else {
    filesToLint = config.selectors.srcScripts;
  }

  return gulp
    .src(filesToLint)
    .pipe(jshint(config.lint.options.src))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .on('error', function(err) {
      if (argv.notify) {
        notify.onError(function(err) {
          return 'lint error ' + err.message;
        })(err);
      }
    });
});

gulp.task('lint-gulp', function() {
  var paramFiles,
      allFiles,
      filesToLint;

  if (argv.files) {
    allFiles = globArray(config.selectors.gulpScripts);
    paramFiles = parseFiles(argv.files);
    filesToLint = _.intersection(allFiles,paramFiles);
  } else {
    filesToLint = config.selectors.srcScripts;
  }

  return gulp
    .src(filesToLint)
    .pipe(jshint(config.lint.options.gulp))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .on('error', function(err) {
      if (argv.notify) {
        notify.onError(function(err) {
          return 'lint error ' + err.message;
        })(err);
      }
    });
});

function parseFiles (str) {
  return _.filter((str || '').split(','), function(filename) {
    return filename.length;
  });
}

function globArray (arrayOfGlobs) {
  var files = [];
  arrayOfGlobs.forEach(function(globString) {
    files = files.concat(glob.sync(globString));
  });
  files = _.uniq(files);

  return files;
}