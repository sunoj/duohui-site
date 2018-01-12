var gulp = require('gulp');
var preprocess = require('gulp-preprocess');
var browserSync = require("browser-sync").create();
var pug = require('gulp-pug');
var shell = require('gulp-shell');
var del = require('del');
var rsync = require('gulp-rsync');
var runSequence = require('run-sequence');

gulp.task('html', function() {
  gulp.src('./src/*.pug')
    .pipe(preprocess({ context: { curtime: Date.now() } }))
    .pipe(pug())
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
    .pipe(gulp.dest('./dist/'))
});

gulp.task('serve', function(done) {
  browserSync.init({
    server: {
      baseDir: './dist',
      serveStaticOptions: {
        extensions: ['html'] // pretty urls
      }
    },
    
  });
  done();
})

gulp.task('reload', function (done) {
  setTimeout(function(){
    browserSync.reload();
    done();
  }, 300)
});

gulp.task('dev', ['scripts', 'css', 'html', 'static', 'serve'], function(cb) {
  gulp.watch('./src/**/*.js', ['scripts']);
  gulp.watch('./src/**/*.css', ['css']);
  gulp.watch('./src/**/*.pug', ['html']);
  gulp.watch('./static/**/*.*', ['static']);

  gulp.watch('./dist/**/*.*', ['reload']);
});

gulp.task('clean', () => del(['dist/*'], { dot: true }));

gulp.task('build', ['scripts', 'css', 'html', 'static'])

gulp.task('rsync', function () {
  return gulp.src(['dist/**/*.*'])
    .pipe(rsync({
      root: './dist',
      username: 'deploy',
      hostname: `2.tinyservices.net`,
      destination: '/home/deploy/www/duohui-web',
      incremental: true
    }))
})

gulp.task('sandbox', function () {
  return deploy('sandbox')
});

gulp.task('sync_to_instances', shell.task("ssh -t deploy@2.tinyservices.net ./plant-web-admin push duohui-web 10.105.117.198 10.105.113.208 10.154.47.36"));

gulp.task('deploy', function (cb) {
  return runSequence(
    'rsync',
    'sync_to_instances',
    cb
  )
});