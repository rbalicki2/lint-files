'use strict';

// BUG: If there's a file in the staging area that was deleted
// in the working directory, it won't be src'ed and won't be linted.
// TODO: fix that in gulp-git-show?

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    notify = require('gulp-notify'),
    config = require('./config.json'),
    argv = require('./argv.js'),
    glob = require('glob'),
    gitShow = require('gulp-git-show'),
    gulpif = require('gulp-if'),
    _ = require('lodash');

gulp.task('lint', ['lint-src', 'lint-gulp']);

gulp.task('lint-src', function() {
  var paramFiles = parseFiles(argv.files),
      allFiles,
      filesToLint,
      pipe;

  if (argv.files && paramFiles.length) {
    allFiles = globArray(config.selectors.srcScripts);
    filesToLint = _.intersection(allFiles,paramFiles);
  } else {
    filesToLint = config.selectors.srcScripts;
  }

  return gulp
    .src(filesToLint)
    .pipe(gulpif(!!argv.staged, gitShow({
      staged: true
    })))
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
  var paramFiles = parseFiles(argv.files),
      allFiles,
      filesToLint;

  if (argv.files && paramFiles.length) {
    allFiles = globArray(config.selectors.gulpScripts);
    filesToLint = _.intersection(allFiles,paramFiles);
  } else {
    filesToLint = config.selectors.gulpScripts;
  }

  return gulp
    .src(filesToLint)
    .pipe(gulpif(!!argv.staged, gitShow({
      staged: true
    })))
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