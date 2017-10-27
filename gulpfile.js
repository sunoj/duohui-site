var gulp = require('gulp');
var preprocess = require('gulp-preprocess');

gulp.task('html', function() {
  gulp.src('./src/*.html')
    .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}}))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('scripts', function() {
  gulp.src(['./src/**/*.js'])
    .pipe(preprocess())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('css', function() {
  gulp.src('./src/**/*.css')
    .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}}))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('static', function() {
  gulp.src('./static/**/*.*')
    .pipe(gulp.dest('./dist/static'))
});

gulp.task('dev', ['scripts', 'css', 'html', 'static'], function() {
  gulp.watch('./src/**/*.js', ['scripts']);
  gulp.watch('./src/**/*.css', ['css']);
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./static/**/*.*', ['static']);
});