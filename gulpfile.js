var gulp = require('gulp');
var preprocess = require('gulp-preprocess');
var superstatic = require('superstatic').server;

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

gulp.task('dev', ['scripts', 'css', 'html', 'static'], function(cb) {
  gulp.watch('./src/**/*.js', ['scripts']);
  gulp.watch('./src/**/*.css', ['css']);
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./static/**/*.*', ['static']);

  var app = superstatic({
    config: {
      public: './dist'
    },
    cwd: __dirname,
    port: 3474,
    host: 'localhost',
    debug: true
  });

  app.listen(function(err) {
    if (err) { console.log(err); }
    console.log('Visit http://localhost:3474 to view Duohui site.')
  });
});