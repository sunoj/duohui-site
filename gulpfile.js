var preprocess = require('gulp-preprocess');
var pug = require('gulp-pug');
var shell = require('gulp-shell');
var del = require('del');
var rsync = require('gulp-rsync');
const { watch, dest, src, series, parallel } = require('gulp')

const html = function() {
  return src('./src/*.pug')
    .pipe(preprocess({ context: { curtime: Date.now() } }))
    .pipe(pug())
    .pipe(dest('./dist/'))
}

const scripts = function() {
  return src(['./src/**/*.js'])
    .pipe(preprocess())
    .pipe(dest('./dist/'))
}

const css = function() {
  return src('./src/**/*.css')
    .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}}))
    .pipe(dest('./dist/'))
}

const static = function() {
  return src('./static/**/*.*')
    .pipe(dest('./dist/'))
}


function serve() {
  const browserSync = require('browser-sync').create()
  watch('./src/**/*.js', scripts)
  watch('./src/**/*.css', css)
  watch('./src/**/*.pug', html)
  watch('./static/**/*.*', static)

  browserSync.init({
    server: {
      baseDir: "dist",
      serveStaticOptions: {
        extensions: ["html"]
      }
    },
    ui: false,
    
  })
  watch('dist/**/*.*').on('change', browserSync.reload)
}

exports.dev = series(scripts, css, html, static, serve)

exports.clean = () => del(['dist/*'], { dot: true });

exports.build = parallel(scripts, css, html, static)

const syncToServer = function () {
  return src(['dist/**/*.*'])
    .pipe(rsync({
      root: './dist',
      username: 'deploy',
      hostname: `2.tinyservices.net`,
      destination: '/home/deploy/www/duohui-web',
      incremental: true
    }))
}

exports.sandbox = function () {
  return deploy('sandbox')
}

const sync_to_instances = shell.task("ssh -t deploy@2.tinyservices.net ./plant-web-admin push duohui-web 10.154.57.202 10.105.55.246 10.105.242.113")

const deploy = function (cb) {
  return series(syncToServer, sync_to_instances, cb)
}