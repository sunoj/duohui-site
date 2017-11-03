var gulp = require('gulp');
var preprocess = require('gulp-preprocess');
var browserSync = require("browser-sync").create();
var pug = require('gulp-pug');
var del = require('del');
var rsync = require('gulp-rsync');

gulp.task('html', function() {
  gulp.src('./src/*.pug')
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

function deploy(target) {
  return gulp.src(['dist/**/*.*'])
    .pipe(rsync({
      root: './dist',
      username: 'deploy',
      hostname: `${target}.tinyservices.net`,
      destination: '/home/deploy/www/duohui-web',
      incremental: true
    }))
}

gulp.task('sandbox', function () {
  return deploy('sandbox')
});

gulp.task('deploy', function () {
  deploy('1')
  deploy('3')
});