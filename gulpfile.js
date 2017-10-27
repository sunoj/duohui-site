var gulp = require('gulp');
var preprocess = require('gulp-preprocess');
var superstatic = require('superstatic').server;
var browserSync = require("browser-sync").create();

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

gulp.task('serve', function(done) {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  done();
})


gulp.task('reload', function (done) {
  browserSync.reload();
  done();
});

gulp.task('dev', ['scripts', 'css', 'html', 'static', 'serve'], function(cb) {
  gulp.watch('./src/**/*.js', ['scripts', 'reload']);
  gulp.watch('./src/**/*.css', ['css', 'reload']);
  gulp.watch('./src/**/*.html', ['html', 'reload']);
  gulp.watch('./static/**/*.*', ['static', 'reload']);
});