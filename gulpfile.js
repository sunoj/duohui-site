const preprocess = require('gulp-preprocess')
const postcss = require('gulp-postcss')
const nodesass = require('gulp-sass')
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

const html2 = function () {
  return src('./src/*.html')
    .pipe(preprocess({ context: { curtime: Date.now() } }))
    .pipe(dest('./dist/'))
}

const scripts = function() {
  return src(['./src/**/*.js'])
    .pipe(preprocess())
    .pipe(dest('./dist/'))
}

const css = function() {
  return src('./src/**/*.css')
    .pipe(postcss())
    .pipe(preprocess())
    .pipe(dest('./dist/'))
}

const sass = function () {
  return src('./src/**/*.scss')
    .pipe(nodesass())
    .pipe(preprocess())
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
  watch('./src/**/*.scss', sass)
  watch('./src/**/*.pug', html)
  watch('./src/**/*.html', html2)
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

exports.dev = series(scripts, css, sass, html, html2, static, serve)

exports.clean = () => del(['dist/*'], { dot: true });

exports.build = parallel(scripts, css, sass, html, html2, static)

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

const sync_to_instances = shell.task("ssh -t deploy@2.tinyservices.net ./plant-web-admin push duohui-web 10.154.57.202 10.105.55.246 10.105.242.113")

exports.deploy = series(syncToServer, sync_to_instances)